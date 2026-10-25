// ========================================================
// Seed Supabase Database Script
// Run: node scripts/seed-supabase.mjs
// ========================================================

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mtaduagclxirfhvjnrzo.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_CGUpc5vRZawcTL1PduTiMw_RbBDWdQr';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔗 Connecting to Supabase at:', supabaseUrl);

async function main() {
  // Check connection
  const { error: testErr } = await supabase.from('masters').select('id').limit(1);
  if (testErr) {
    console.error('❌ Supabase error:', testErr.message);
    console.log('ℹ️ Make sure to run the SQL migration in your Supabase SQL editor first:');
    console.log('   Open supabase_schema.sql and execute it in Supabase dashboard.');
    return;
  }

  console.log('✓ Connected to Supabase tables!');

  // 1. Seed Masters
  try {
    const mastersRaw = fs.readFileSync(path.join(process.cwd(), 'data', 'generated', 'masters.json'), 'utf-8');
    const masters = JSON.parse(mastersRaw);
    const rows = masters.map((m) => ({
      id: m.id,
      name: m.name,
      name_ja: m.nameJa || '',
      craft: m.craft,
      craft_ja: m.craftJa || '',
      category: m.category || 'metalwork',
      region: m.region,
      region_ja: m.regionJa || '',
      age: m.age || 60,
      years_experience: m.yearsExperience || 30,
      no_successor: m.noSuccessor ?? false,
      annual_revenue_jpy: m.annualRevenueJpy || 0,
      enterprise_value_jpy: m.enterpriseValueJpy || 0,
      bio: m.bio || '',
      bio_ja: m.bioJa || '',
      techniques: m.techniques || [],
      languages: m.languages || [],
      image_url: m.imageUrl || '',
      craft_explanation: m.craftExplanation || '',
      audio_dossier_url: m.audioDossierUrl || '',
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('masters').upsert(rows);
    if (error) console.error('Error seeding masters:', error.message);
    else console.log(`✓ Seeded ${rows.length} masters to Supabase!`);
  } catch (err) {
    console.warn('Masters seed file warning:', err.message);
  }

  // 2. Seed Manuals
  try {
    const manualsPath = path.join(process.cwd(), 'data', 'generated', 'manuals.json');
    if (fs.existsSync(manualsPath)) {
      const manualsRaw = fs.readFileSync(manualsPath, 'utf-8');
      const manuals = JSON.parse(manualsRaw);
      const rows = manuals.map((m) => ({
        id: m.id,
        master_id: m.masterId,
        craft: m.craft || '',
        overview: m.overview || '',
        overview_ja: m.overviewJa || '',
        tools: m.tools || [],
        techniques: m.techniques || [],
        heritage_notes: m.heritageNotes || '',
        heritage_notes_ja: m.heritageNotesJa || '',
        produced_by: m.producedBy || 'Gemini Tacit Knowledge Codifier',
        generated_at: m.generatedAt || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase.from('manuals').upsert(rows);
      if (error) console.error('Error seeding manuals:', error.message);
      else console.log(`✓ Seeded ${rows.length} craft manuals to Supabase!`);
    }
  } catch (err) {
    console.warn('Manuals seed file warning:', err.message);
  }

  console.log('🎉 Done checking Supabase backend database!');
}

main().catch(console.error);
