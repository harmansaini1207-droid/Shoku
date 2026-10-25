import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const DEEPL_API_KEY = process.env.DEEPL_API_KEY || '507330e6-c1b9-4dbe-a564-33c847a930f1:fx';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AQ.Ab8RN6KBPtBAwV6DsowyWHv4rMIFIo_Of83OvLkoUcXTP2CRxA';

function isJapanese(text: string): boolean {
  return /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf]/.test(text);
}

export async function POST(req: NextRequest) {
  try {
    const { text, context, targetLang: requestedTarget, skipIntent } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const textIsJa = isJapanese(text);
    let targetLang = requestedTarget;
    if (!targetLang) {
      targetLang = textIsJa ? 'EN-US' : 'JA';
    } else {
      targetLang = targetLang.toUpperCase();
      if (targetLang === 'EN') targetLang = 'EN-US';
    }

    // 1. Call DeepL for Literal Translation
    let literalTranslation = '';
    try {
      const deeplRes = await fetch('https://api-free.deepl.com/v2/translate', {
        method: 'POST',
        headers: {
          Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: [text],
          target_lang: targetLang,
        }),
      });

      if (deeplRes.ok) {
        const deeplData = await deeplRes.json();
        literalTranslation = deeplData.translations?.[0]?.text || '';
      } else {
        const errText = await deeplRes.text();
        console.error('DeepL Error:', errText);
      }
    } catch (err) {
      console.error('DeepL Fetch Failed:', err);
    }

    // Fallback if DeepL didn't return text
    if (!literalTranslation) {
      literalTranslation = textIsJa
        ? 'Literal translation currently generating.'
        : '直訳を生成しています。';
    }

    if (skipIntent) {
      return NextResponse.json({
        translatedText: literalTranslation,
        literal: literalTranslation,
        sourceIsJa: textIsJa,
        targetLang,
      });
    }

    // 2. Call Gemini 2.5 Flash for Cultural Intent & Unspoken Subtext
    let culturalIntent = '';
    try {
      const prompt = `You are a specialist in Japanese craft lineage succession, workshop keigo, and unspoken cross-cultural communication (honne vs tatemae).
Analyze this message exchanged between a foreign apprentice candidate and a Japanese master craftsman:
"${text}"

Context details: ${context || 'Craft apprenticeship inquiry for a Japanese living master.'}

Provide a concise, authentic analysis covering:
1. True Intent (本音): What does this message communicate beneath the formal polite surface? (e.g. Is it an enthusiastic green-light, a guarded test of humility/patience, a traditional "soft refusal", or genuine curiosity about their tactile work ethic?)
2. Unspoken Cultural Nuance: Explain any specific phrase cues (such as "前向きに検討", "相談しながら", "工房の規律", etc.).
3. Apprentice Advice: How should the candidate interpret this and respectfully respond?

Format your response in 2-3 crisp, elegant paragraphs with clean bullet points where appropriate.`;

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 600,
            },
          }),
        }
      );

      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        culturalIntent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
      } else {
        const errText = await geminiRes.text();
        console.error('Gemini Error:', errText);
      }
    } catch (err) {
      console.error('Gemini Fetch Failed:', err);
    }

    if (!culturalIntent) {
      culturalIntent =
        'This message follows formal Japanese craft workshop protocol. In traditional ateliers, commitment, punctuality, and humility in receiving tacit instruction precede formal acceptance.';
    }

    return NextResponse.json({
      translatedText: literalTranslation,
      literal: literalTranslation,
      intent: culturalIntent,
      detectedJa: textIsJa,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Translation failed' }, { status: 500 });
  }
}
