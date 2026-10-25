import { embedText } from '../engines/hashingEmbedder';

export interface ProviderConfig {
  llmProvider: 'scripted' | 'ollama' | 'openai-compat';
  llmBaseUrl: string;
  llmModel: string;
  sttProvider: 'scripted' | 'whisper-server';
  sttBaseUrl: string;
  embeddingsProvider: 'hash' | 'ollama';
  embeddingsModel: string;
}

export const config: ProviderConfig = {
  llmProvider: (process.env.LLM_PROVIDER as any) || 'scripted',
  llmBaseUrl: process.env.LLM_BASE_URL || 'http://localhost:11434',
  llmModel: process.env.LLM_MODEL || 'swallow:8b',
  sttProvider: (process.env.STT_PROVIDER as any) || 'scripted',
  sttBaseUrl: process.env.STT_BASE_URL || 'http://localhost:8000',
  embeddingsProvider: (process.env.EMBEDDINGS_PROVIDER as any) || 'hash',
  embeddingsModel: process.env.EMBEDDINGS_MODEL || 'bge-m3'
};

export class STTAdapter {
  static async transcribe(audioBlob?: Blob | Buffer): Promise<string> {
    if (config.sttProvider === 'whisper-server') {
      try {
        const formData = new FormData();
        if (audioBlob instanceof Blob) {
          formData.append('audio_file', audioBlob);
        }
        const res = await fetch(`${config.sttBaseUrl}/asr`, {
          method: 'POST',
          body: formData,
          signal: AbortSignal.timeout(3000)
        });
        if (res.ok) {
          const data = await res.json();
          return data.text || '';
        }
      } catch {
        // Fall back gracefully to scripted
      }
    }

    // Scripted offline default response
    return 'The steel sings at roughly 1050 degrees. We monitor the flux boiling bubbles and damp ash humidity with our palms to prevent seam failure.';
  }
}

export class EmbeddingsAdapter {
  static async getEmbedding(text: string): Promise<number[]> {
    if (config.embeddingsProvider === 'ollama') {
      try {
        const res = await fetch(`${config.llmBaseUrl}/api/embeddings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: config.embeddingsModel,
            prompt: text
          }),
          signal: AbortSignal.timeout(2000)
        });
        if (res.ok) {
          const json = await res.json();
          if (json.embedding && Array.isArray(json.embedding)) {
            return json.embedding;
          }
        }
      } catch {
        // Fallback to deterministic hash embedder
      }
    }

    return embedText(text);
  }
}
