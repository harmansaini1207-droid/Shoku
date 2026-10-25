import { NextRequest, NextResponse } from 'next/server';
import { masterRepository } from '@/lib/repository/masterRepository';
import { SEED_CANDIDATES } from '@/lib/data/seed';
import { rankCandidatesForMaster } from '@/lib/engines/matchingEngine';

export const dynamic = 'force-dynamic';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AQ.Ab8RN6KBPtBAwV6DsowyWHv4rMIFIo_Of83OvLkoUcXTP2CRxA';

/** Extract JSON array from Gemini multi-part response (skips thinking parts) */
function parseGeminiArray(data: any): any[] | null {
  const allParts: any[] = data.candidates?.[0]?.content?.parts || [];
  let targetText = '';
  for (let i = allParts.length - 1; i >= 0; i--) {
    const t: string = allParts[i]?.text || '';
    if (t.includes('[') && t.includes(']')) { targetText = t; break; }
  }
  if (!targetText) targetText = allParts.map((p: any) => p.text || '').join('\n');
  try {
    const jsonMatch = targetText.match(/\[\s*\{[\s\S]*\}\s*\]/);
    const cleanJson = jsonMatch ? jsonMatch[0] : targetText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    if (Array.isArray(parsed)) return parsed;
  } catch { /* fall through */ }
  return null;
}

/** Call Gemini with retry on 503 / 429 overload */
async function callGeminiWithRetry(prompt: string, attempts = 3): Promise<any[] | null> {
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 8192 },
          }),
        }
      );
      if (res.ok) {
        const result = parseGeminiArray(await res.json());
        if (result) return result;
      } else {
        const errText = await res.text();
        console.error(`Gemini attempt ${attempt + 1} failed (${res.status}):`, errText.slice(0, 200));
        if (res.status !== 503 && res.status !== 429) break;
      }
    } catch (err) {
      console.error(`Gemini attempt ${attempt + 1} threw:`, err);
    }
    if (attempt < attempts - 1) await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
  }
  return null;
}

async function evaluateWithGemini(master: any, candidates: any[]) {
  const candidateBlock = candidates
    .map(
      (c) => `ID: ${c.id}\nName: ${c.name}\nCraft Skills: ${c.skills.join(', ')}\nExperience: ${c.yearsExperience} years\nJapanese Proficiency: ${c.japaneseLevel}\nBio/Resume: ${c.bio}`
    )
    .join('\n---\n');

  const oralExplanation = master.craftExplanation
    ? `\nMASTER'S TRANSCRIBED CRAFT EXPLANATION (From Atelier Owner via Wispr Flow):\n"${master.craftExplanation}"\n`
    : (master.bio ? `\nAtelier Philosophy:\n"${master.bio}"\n` : '');

  const prompt = `You are the Master Kinship Matching Engine for Japanese traditional craft ateliers.
Evaluate every candidate resume below against Master ${master.name} (${master.craft}, Category: ${master.category}, Region: ${master.region}, Techniques: ${(master.techniques || []).join(', ')}).
${oralExplanation}
Candidates:
${candidateBlock}

For EACH candidate output an object with EXACTLY these keys:
- "candidateId": the EXACT id string shown above (e.g. "c-aarav-sharma")
- "score": integer 0-100 — craft synergy + tactile skill transfer + succession readiness based on the master's craft explanation and candidate resume
- "keyMatches": array of 3-5 skill/technique keywords that directly match the master's craft domain
- "fitExplanation": 2-3 sentences on HOW and WHY this candidate fits (or does not fit) this specific master's craft explanation and atelier requirements
- "recommendedMode": one of "ssw-relocation" | "remote-apprentice" | "license-franchise"

Return ONLY a raw JSON array. No markdown, no code fences, no commentary.`;

  return callGeminiWithRetry(prompt);
}

function generateFallbackFitExplanation(candidate: any, master: any): string {
  if (!candidate) return `Candidate demonstrates kinematic potential for Master ${master?.name}'s atelier.`;
  const matchingSkills = (candidate.skills || []).filter((s: string) =>
    (master.techniques || []).some((t: string) => t.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(t.toLowerCase())) ||
    (master.craft || '').toLowerCase().includes(s.toLowerCase())
  );
  if (matchingSkills.length > 0) {
    return `Candidate ${candidate.name} demonstrates direct kinematic synergy with Master ${master.name}'s atelier through verified aptitude in ${matchingSkills.join(', ')}. Their tactile background and Japanese proficiency (${candidate.japaneseLevel}) align with the workshop's generational succession requirements.`;
  }
  return `Candidate ${candidate.name} brings disciplined tactile experience in ${(candidate.skills || []).slice(0, 2).join(', ')}. Their manual dexterity and commitment to raw craft lineage provide a strong foundation for Master ${master.name}'s apprentice onboarding.`;
}

/** Overlay Gemini evaluations onto base statistical results */
function mergeEvals(baseResults: any[], geminiEvals: any[] | null, master: any) {
  return baseResults.map((r) => {
    const g = geminiEvals?.find(
      (ev: any) =>
        ev.candidateId === r.candidateId ||
        (ev.name && r.candidate?.name &&
          ev.name.toLowerCase().includes(r.candidate.name.toLowerCase()))
    );
    if (g) {
      return {
        ...r,
        score: Math.round(g.score ?? r.score),
        reasons: g.keyMatches?.length > 0 ? g.keyMatches : r.reasons,
        fitExplanation: g.fitExplanation || generateFallbackFitExplanation(r.candidate, master),
        mode: g.recommendedMode || r.mode,
      };
    }
    return {
      ...r,
      fitExplanation: generateFallbackFitExplanation(r.candidate, master),
    };
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const masterId = searchParams.get('masterId');
  const masters = masterRepository.getAllMasters();
  const targetMaster = masterId
    ? masterRepository.getMasterById(masterId) || masters[0]
    : masters[0];
  if (!targetMaster) return NextResponse.json({ error: 'No masters found' }, { status: 404 });

  const baseResults = rankCandidatesForMaster(targetMaster, SEED_CANDIDATES);
  const geminiEvals = await evaluateWithGemini(targetMaster, SEED_CANDIDATES);
  const finalResults = mergeEvals(baseResults, geminiEvals, targetMaster).sort((a, b) => b.score - a.score);

  return NextResponse.json({
    master: targetMaster,
    results: finalResults,
    poweredBy: 'Gemini 2.5 Flash',
    geminiSuccess: !!geminiEvals,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const masters = masterRepository.getAllMasters();
    const targetMaster = body.masterId
      ? masterRepository.getMasterById(body.masterId) || masters[0]
      : masters[0];
    if (!targetMaster) return NextResponse.json({ error: 'Master not found' }, { status: 404 });

    const baseResults = rankCandidatesForMaster(targetMaster, SEED_CANDIDATES);
    const geminiEvals = await evaluateWithGemini(targetMaster, SEED_CANDIDATES);
    const finalResults = mergeEvals(baseResults, geminiEvals, targetMaster).sort((a, b) => b.score - a.score);

    return NextResponse.json({
      master: targetMaster,
      results: finalResults,
      poweredBy: 'Gemini 2.5 Flash',
      geminiSuccess: !!geminiEvals,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Matching error' }, { status: 500 });
  }
}
