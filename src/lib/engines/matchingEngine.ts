import { Candidate, EngagementMode, Master, MatchResult } from '../types';
import { cosineSimilarity, embedText, tokenize } from './hashingEmbedder';

const JLPT_SCORES: Record<string, number> = {
  N1: 1.0,
  N2: 0.85,
  N3: 0.7,
  N4: 0.5,
  N5: 0.35,
  none: 0.15
};

export function computeMatch(master: Master, candidate: Candidate): MatchResult {
  // 1. Build Master Profile text and tokens
  const masterText = [
    master.craft,
    master.craftJa || '',
    master.category,
    master.region,
    master.regionJa || '',
    master.bio || '',
    ...(master.techniques || [])
  ].join(' ');

  const masterTokens = tokenize(masterText);
  const masterVector = embedText(masterText);

  // 2. Candidate Profile text and tokens
  const candidateText = [
    candidate.name,
    candidate.region,
    ...candidate.skills,
    ...candidate.interests,
    candidate.bio || ''
  ].join(' ');

  const candidateVector = embedText(candidateText);

  // 3. Skill Overlap Calculation
  let skillMatches = 0;
  let directMatches: string[] = [];

  for (const skill of candidate.skills) {
    const skillTokens = tokenize(skill);
    let matchedTokenCount = 0;

    for (const st of skillTokens) {
      const hasMatch = masterTokens.some(
        mt => mt === st || mt.includes(st) || st.includes(mt)
      );
      if (hasMatch) {
        matchedTokenCount++;
      }
    }

    if (matchedTokenCount === skillTokens.length && skillTokens.length > 0) {
      skillMatches += 1.0;
      directMatches.push(skill);
    } else if (matchedTokenCount > 0) {
      skillMatches += 0.5;
      directMatches.push(`${skill} (partial)`);
    }
  }

  const rawOverlap = candidate.skills.length > 0 ? skillMatches / candidate.skills.length : 0;
  const embeddingSim = cosineSimilarity(masterVector, candidateVector);
  // Blend 70% direct overlap + 30% semantic embedding similarity
  const skillScore = Math.min(1.0, rawOverlap * 0.7 + embeddingSim * 0.3);

  // 4. Determine Recommended Engagement Mode
  let recommendedMode: EngagementMode = 'remote-apprentice';
  if (candidate.modes.includes('ssw-relocation') && candidate.sswEligible) {
    recommendedMode = 'ssw-relocation';
  } else if (candidate.modes.includes('license-franchise')) {
    recommendedMode = 'license-franchise';
  } else if (candidate.modes.includes('remote-apprentice')) {
    recommendedMode = 'remote-apprentice';
  } else if (candidate.modes.length > 0) {
    recommendedMode = candidate.modes[0];
  }

  // 5. Language Score
  const langScore = JLPT_SCORES[candidate.japaneseLevel] ?? 0.2;

  // 6. Visa Score
  let visaScore = 0.95;
  if (recommendedMode === 'ssw-relocation') {
    visaScore = candidate.sswEligible ? 1.0 : 0.25;
  } else {
    visaScore = 0.95; // Remote apprenticeships and franchises do not depend heavily on relocation visas
  }

  // 7. Temperament Score
  let interestMatches = 0;
  for (const interest of candidate.interests) {
    const iTokens = tokenize(interest);
    if (iTokens.some(it => masterTokens.some(mt => mt.includes(it) || it.includes(mt)))) {
      interestMatches++;
    }
  }
  const interestRatio = candidate.interests.length > 0 ? interestMatches / candidate.interests.length : 0.2;
  const expRatio = Math.min(1.0, candidate.yearsExperience / 5.0); // 5+ years = 1.0
  const modeMatch = candidate.modes.includes(recommendedMode) ? 1.0 : 0.5;
  const temperamentScore = interestRatio * 0.4 + expRatio * 0.4 + modeMatch * 0.2;

  // 8. Final Weighted Score (0 to 100)
  // skill 0.45 + language 0.20 + visa 0.15 + temperament 0.20
  const totalRaw =
    skillScore * 0.45 +
    langScore * 0.2 +
    visaScore * 0.15 +
    temperamentScore * 0.2;

  const finalScore = Math.round(Math.min(100, Math.max(0, totalRaw * 100)));

  // 9. Generate Human-Readable Reasons (Bilingual)
  const reasons: string[] = [];
  const reasonsJa: string[] = [];

  if (directMatches.length > 0) {
    reasons.push(`Direct skill alignment: ${directMatches.slice(0, 3).join(', ')} directly transfer to ${master.category}.`);
    reasonsJa.push(`技術の直接一致: ${directMatches.slice(0, 3).join('、')}が${master.craftJa || master.craft}の現場に直結。`);
  } else {
    reasons.push(`Adjacent technical background in related craft engineering.`);
    reasonsJa.push(`関連分野における隣接技術と工学的基礎力を保有。`);
  }

  reasons.push(
    `Japanese proficiency (${candidate.japaneseLevel}) provides ${
      candidate.japaneseLevel === 'N1' || candidate.japaneseLevel === 'N2'
        ? 'fluent shop-floor and master-apprentice communication.'
        : candidate.japaneseLevel === 'N3'
        ? 'solid working capability for daily instructions.'
        : 'foundational vocabulary, best paired with visual manuals and translated guidance.'
    }`
  );
  reasonsJa.push(
    `日本語力（JLPT ${candidate.japaneseLevel}）: ${
      candidate.japaneseLevel === 'N1' || candidate.japaneseLevel === 'N2'
        ? '工房現場での円滑な対話・指示理解が即座に可能。'
        : candidate.japaneseLevel === 'N3'
        ? '日常的な業務指示や技術フィードバックの受領が可能。'
        : '基礎語彙力あり。図解マニュアルおよび翻訳補助コパイロット併用で指導可能。'
    }`
  );

  if (recommendedMode === 'ssw-relocation') {
    reasons.push(`SSW Visa eligible: Can immediately enter Japan for in-person master apprenticeship.`);
    reasonsJa.push(`特定技能ビザ（SSW）要件充足: 渡日しての住み込み・内弟子修行が即時可能。`);
  } else if (recommendedMode === 'license-franchise') {
    reasons.push(`High capacity to build an official licensed heritage craft studio in India.`);
    reasonsJa.push(`インド現地でのライセンス公認スタジオ開設・展開の実行力が極めて高い。`);
  } else {
    reasons.push(`Ideal candidate for structured remote apprenticeship with bilateral review cycles.`);
    reasonsJa.push(`定期的な技術レビューを伴う遠隔弟子入りプログラムに最適。`);
  }

  return {
    masterId: master.id,
    candidateId: candidate.id,
    candidate,
    score: finalScore,
    mode: recommendedMode,
    breakdown: {
      skill: parseFloat(skillScore.toFixed(2)),
      language: parseFloat(langScore.toFixed(2)),
      visa: parseFloat(visaScore.toFixed(2)),
      temperament: parseFloat(temperamentScore.toFixed(2))
    },
    reasons,
    reasonsJa
  };
}

export function rankCandidatesForMaster(master: Master, candidates: Candidate[]): MatchResult[] {
  const results = candidates.map(c => computeMatch(master, c));
  return results.sort((a, b) => b.score - a.score);
}
