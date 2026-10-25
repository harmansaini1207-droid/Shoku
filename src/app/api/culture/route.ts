import { NextRequest, NextResponse } from 'next/server';
import { analyzeEmail } from '@/lib/engines/cultureEngine';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email text required' }, { status: 400 });
    }

    const analysis = analyzeEmail(email);
    return NextResponse.json({ analysis });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Culture analysis error' }, { status: 500 });
  }
}
