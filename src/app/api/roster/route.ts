import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { masterRepository } from '@/lib/repository/masterRepository';
import { SEED_CANDIDATES } from '@/lib/data/seed';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mtaduagclxirfhvjnrzo.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_CGUpc5vRZawcTL1PduTiMw_RbBDWdQr';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  const masters = await masterRepository.getAllMastersAsync();
  let candidates = SEED_CANDIDATES;
  try {
    const { data, error } = await supabase.from('candidates').select('*');
    if (!error && data && data.length > 0) {
      candidates = data as any;
    }
  } catch {
    // Fall back to seed candidates
  }
  return NextResponse.json({
    masters,
    candidates
  });
}
