import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY || '';


/**
 * NOTE: WisperFlow is a desktop dictation app — it does NOT expose a public REST API.
 * The key `sk_xxx` is for their desktop product, not for server-side audio transcription.
 * We skip it and go directly to Gemini audio transcription as the primary fallback
 * when the browser's Web Speech API is unavailable.
 */

/** Gemini audio transcription — primary server-side fallback */
async function callGeminiAudioTranscribe(
  base64Audio: string,
  mimeType: string = 'audio/webm',
  craftHint?: string
): Promise<string | null> {
  if (!GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not set — skipping server transcription');
    return null;
  }
  try {
    const cleanMime = mimeType.split(';')[0].trim() || 'audio/webm';
    const prompt = craftHint
      ? `Transcribe this audio recording of a craft master explaining their craft (${craftHint}). Output only the transcribed text, nothing else.`
      : `Transcribe this audio recording accurately. Output only the transcribed text, nothing else.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: cleanMime,
                    data: base64Audio,
                  },
                },
                { text: prompt },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (res.ok) {
      const data = await res.json();
      const parts = data.candidates?.[0]?.content?.parts || [];
      for (let i = parts.length - 1; i >= 0; i--) {
        const t = parts[i]?.text;
        if (t && typeof t === 'string' && t.trim().length > 0) {
          return t.trim();
        }
      }
    } else {
      const err = await res.text();
      console.error('Gemini transcription error:', res.status, err.slice(0, 200));
    }
  } catch (err) {
    console.error('Gemini transcription exception:', err);
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    let base64Audio = '';
    let mimeType = 'audio/webm';
    let craftHint = '';

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('audio') as Blob | null;
      craftHint = (formData.get('craftHint') as string) || '';
      if (file) {
        mimeType = file.type || 'audio/webm';
        const arrayBuffer = await file.arrayBuffer();
        base64Audio = Buffer.from(arrayBuffer).toString('base64');
      }
    } else {
      const body = await req.json();
      base64Audio = body.audio || body.audioBase64 || '';
      mimeType = body.mimeType || 'audio/webm';
      craftHint = body.craftHint || '';
    }

    if (!base64Audio) {
      return NextResponse.json(
        { error: 'No audio data provided in request' },
        { status: 400 }
      );
    }

    // Try Gemini audio transcription
    const geminiResult = await callGeminiAudioTranscribe(base64Audio, mimeType, craftHint);
    if (geminiResult) {
      return NextResponse.json({
        success: true,
        text: geminiResult,
        provider: 'Gemini Speech Engine',
      });
    }

    // Nothing worked — return empty so the client knows to keep live speech result
    return NextResponse.json({
      success: false,
      text: '',
      provider: 'none',
    });
  } catch (err: any) {
    console.error('Transcription endpoint failed:', err);
    return NextResponse.json(
      { error: err.message || 'Audio transcription processing failed' },
      { status: 500 }
    );
  }
}
