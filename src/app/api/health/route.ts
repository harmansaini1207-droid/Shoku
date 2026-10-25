import { NextResponse } from 'next/server';
import { config } from '@/lib/adapters/providerFactory';
import { masterRepository } from '@/lib/repository/masterRepository';

export const dynamic = 'force-dynamic';

export async function GET() {
  const mastersCount = masterRepository.getAllMasters().length;
  return NextResponse.json({
    status: 'healthy',
    mode: 'offline-first',
    mastersLoaded: mastersCount,
    config: {
      llmProvider: config.llmProvider,
      sttProvider: config.sttProvider,
      embeddingsProvider: config.embeddingsProvider
    },
    timestamp: new Date().toISOString()
  });
}
