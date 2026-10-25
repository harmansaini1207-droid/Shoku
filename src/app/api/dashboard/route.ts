import { NextResponse } from 'next/server';
import { masterRepository } from '@/lib/repository/masterRepository';
import { manualRepository } from '@/lib/repository/manualRepository';
import { SEED_CANDIDATES } from '@/lib/data/seed';
import { rankCandidatesForMaster } from '@/lib/engines/matchingEngine';
import { DashboardStats } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const masters = masterRepository.getAllMasters();
  const manuals = manualRepository.getAllManuals();

  const mastersAtRisk = masters.filter(m => m.noSuccessor).length;
  const totalMasters = masters.length;
  const craftsCaptured = manuals.length;
  const candidatesReady = SEED_CANDIDATES.length;

  let enterpriseValueAtRiskJpy = 0;
  let annualRevenueAtRiskJpy = 0;
  let strongMatches = 0;

  for (const m of masters) {
    if (m.noSuccessor) {
      enterpriseValueAtRiskJpy += m.enterpriseValueJpy || 0;
      annualRevenueAtRiskJpy += m.annualRevenueJpy || 0;
    }
    const ranked = rankCandidatesForMaster(m, SEED_CANDIDATES);
    strongMatches += ranked.filter(r => r.score >= 80).length;
  }

  const stats: DashboardStats = {
    mastersAtRisk,
    totalMasters,
    craftsCaptured,
    candidatesReady,
    strongMatches,
    enterpriseValueAtRiskJpy,
    annualRevenueAtRiskJpy,
    flywheel: {
      mastersOnboarded: totalMasters,
      craftsCaptured,
      talentMatched: strongMatches,
      contentReachEstimated: '1.4M+ Views (Documentary & Guild Reach)'
    }
  };

  return NextResponse.json({ stats });
}
