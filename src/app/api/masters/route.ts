import { NextRequest, NextResponse } from 'next/server';
import { masterRepository } from '@/lib/repository/masterRepository';
import { Master } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const masters = await masterRepository.getAllMastersAsync();
  return NextResponse.json({ masters });
}

export async function POST(req: NextRequest) {
  try {
    const body: Master = await req.json();
    if (!body.name || !body.craft) {
      return NextResponse.json(
        { error: 'Master name and craft are required.' },
        { status: 400 }
      );
    }
    await masterRepository.saveMaster(body);
    return NextResponse.json({ master: body, success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save master' }, { status: 500 });
  }
}
