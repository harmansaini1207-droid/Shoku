import { NextResponse } from 'next/server';
import { masterRepository } from '@/lib/repository/masterRepository';
import { SEED_CANDIDATES } from '@/lib/data/seed';

export const dynamic = 'force-dynamic';

export async function GET() {
  const masters = masterRepository.getAllMasters();
  return NextResponse.json({
    masters,
    candidates: SEED_CANDIDATES
  });
}
