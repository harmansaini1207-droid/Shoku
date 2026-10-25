/**
 * Deterministic 256-dimension hashing embedder.
 * Zero external dependencies, runs 100% offline in microseconds.
 * Tokenizes English words, stems, and Japanese Unicode characters (Kanji, Hiragana, Katakana).
 */

const DIMENSIONS = 256;

// MurmurHash3-inspired 32-bit hash function for string tokens
function hashToken(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function tokenize(text: string): string[] {
  if (!text) return [];
  const clean = text.toLowerCase();
  const tokens: string[] = [];

  // Match English words/stems (2+ chars) and Japanese Kanji/Kana sequences
  const regex = /[a-z0-9_]{2,}|[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]{1,2}/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(clean)) !== null) {
    tokens.push(match[0]);
  }

  return tokens;
}

export function embedText(text: string): number[] {
  const vec = new Float32Array(DIMENSIONS);
  const tokens = tokenize(text);

  if (tokens.length === 0) {
    return Array.from(vec);
  }

  // Count term frequencies
  const tfMap = new Map<string, number>();
  for (const token of tokens) {
    tfMap.set(token, (tfMap.get(token) || 0) + 1);
  }

  // Hash each token into 256 buckets with sublinear TF weighting: 1 + log(tf)
  tfMap.forEach((count, token) => {
    const weight = 1 + Math.log(count);
    const hash = hashToken(token);
    const bucket = hash % DIMENSIONS;
    // Sign hashing to reduce collision bias
    const sign = (hash & 0x80000000) === 0 ? 1 : -1;
    vec[bucket] += sign * weight;
  });

  // L2 Normalize
  let norm = 0;
  for (let i = 0; i < DIMENSIONS; i++) {
    norm += vec[i] * vec[i];
  }
  norm = Math.sqrt(norm);

  if (norm > 0) {
    for (let i = 0; i < DIMENSIONS; i++) {
      vec[i] /= norm;
    }
  }

  return Array.from(vec);
}

export function cosineSimilarity(v1: number[], v2: number[]): number {
  if (!v1 || !v2 || v1.length !== v2.length) return 0;
  let dot = 0;
  for (let i = 0; i < v1.length; i++) {
    dot += v1[i] * v2[i];
  }
  // Clamp between 0 and 1 for matching rescales
  return Math.max(0, Math.min(1, (dot + 1) / 2));
}
