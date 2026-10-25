import { NextRequest, NextResponse } from 'next/server';
import { manualRepository } from '@/lib/repository/manualRepository';
import { masterRepository } from '@/lib/repository/masterRepository';
import { generateCraftManual } from '@/lib/engines/manualGenerator';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const masterId = searchParams.get('masterId');

  if (masterId) {
    let manual = manualRepository.getManualByMasterId(masterId);
    if (!manual) {
      const master = masterRepository.getMasterById(masterId);
      if (master) {
        manual = generateCraftManual(master);
        manualRepository.saveManual(manual);
      }
    }
    return NextResponse.json({ manual: manual || null });
  }

  const manuals = manualRepository.getAllManuals();
  return NextResponse.json({ manuals });
}

export async function POST(req: NextRequest) {
  try {
    const { masterId } = await req.json();
    if (!masterId) {
      return NextResponse.json({ error: 'masterId is required' }, { status: 400 });
    }

    const master = masterRepository.getMasterById(masterId);
    if (!master) {
      return NextResponse.json({ error: 'Master not found' }, { status: 404 });
    }

    const manual = generateCraftManual(master);
    manualRepository.saveManual(manual);

    return NextResponse.json({ manual, success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to generate manual' }, { status: 500 });
  }
}
