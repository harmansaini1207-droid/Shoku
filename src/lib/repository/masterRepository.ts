import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { Master } from '../types';
import { SEED_MASTERS } from '../data/seed';

const DATA_DIR = path.join(process.cwd(), 'data', 'generated');
const MASTERS_FILE = path.join(DATA_DIR, 'masters.json');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mtaduagclxirfhvjnrzo.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_CGUpc5vRZawcTL1PduTiMw_RbBDWdQr';
const supabase = createClient(supabaseUrl, supabaseKey);

declare global {
  // eslint-disable-next-line no-var
  var __shokuMasterRepo: MasterRepositoryImpl | undefined;
}

function masterToRow(m: Master) {
  return {
    id: m.id,
    name: m.name,
    name_ja: m.nameJa || '',
    craft: m.craft,
    craft_ja: m.craftJa || '',
    category: m.category,
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
  };
}

function rowToMaster(r: any): Master {
  return {
    id: r.id,
    name: r.name,
    nameJa: r.name_ja || r.nameJa || '',
    craft: r.craft,
    craftJa: r.craft_ja || r.craftJa || '',
    category: r.category,
    region: r.region,
    regionJa: r.region_ja || r.regionJa || '',
    age: r.age,
    yearsExperience: r.years_experience ?? r.yearsExperience ?? 30,
    noSuccessor: r.no_successor ?? r.noSuccessor ?? false,
    annualRevenueJpy: r.annual_revenue_jpy ?? r.annualRevenueJpy ?? 0,
    enterpriseValueJpy: r.enterprise_value_jpy ?? r.enterpriseValueJpy ?? 0,
    bio: r.bio || '',
    bioJa: r.bio_ja || r.bioJa || '',
    techniques: Array.isArray(r.techniques)
      ? r.techniques
      : typeof r.techniques === 'string'
      ? JSON.parse(r.techniques)
      : [],
    languages: Array.isArray(r.languages)
      ? r.languages
      : typeof r.languages === 'string'
      ? JSON.parse(r.languages)
      : [],
    imageUrl: r.image_url || r.imageUrl || '',
    craftExplanation: r.craft_explanation || r.craftExplanation || '',
    audioDossierUrl: r.audio_dossier_url || r.audioDossierUrl || '',
  };
}

class MasterRepositoryImpl {
  private masters: Map<string, Master> = new Map();
  private supabaseChecked = false;

  constructor() {
    this.init();
  }

  private init() {
    // 1. Load seed masters
    for (const m of SEED_MASTERS) {
      this.masters.set(m.id, m);
    }

    // 2. Load disk persisted runtime masters if file exists
    try {
      if (fs.existsSync(MASTERS_FILE)) {
        const raw = fs.readFileSync(MASTERS_FILE, 'utf-8');
        const list: Master[] = JSON.parse(raw);
        for (const m of list) {
          this.masters.set(m.id, m);
        }
      }
    } catch {
      // Graceful fallback to in-memory only
    }

    // 3. Asynchronously hydrate from Supabase
    this.syncFromSupabase();
  }

  public async syncFromSupabase(): Promise<void> {
    try {
      const { data, error } = await supabase.from('masters').select('*');
      if (!error && data && data.length > 0) {
        for (const row of data) {
          const master = rowToMaster(row);
          this.masters.set(master.id, master);
        }
        this.persistToDisk();
      } else if (!error && data && data.length === 0) {
        // Table exists but empty: seed it to Supabase
        await this.seedToSupabase();
      }
      this.supabaseChecked = true;
    } catch (err) {
      // Supabase table not created yet or network offline
    }
  }

  private async seedToSupabase(): Promise<void> {
    try {
      const rows = Array.from(this.masters.values()).map(masterToRow);
      await supabase.from('masters').upsert(rows);
    } catch {
      // Ignore initial seed error if table not ready
    }
  }

  public getAllMasters(): Master[] {
    return Array.from(this.masters.values());
  }

  public async getAllMastersAsync(): Promise<Master[]> {
    if (!this.supabaseChecked) {
      await this.syncFromSupabase();
    }
    return Array.from(this.masters.values());
  }

  public getMasterById(id: string): Master | undefined {
    return this.masters.get(id);
  }

  public async saveMaster(master: Master): Promise<void> {
    this.masters.set(master.id, master);
    this.persistToDisk();

    // Persist directly to Supabase backend database
    try {
      const row = masterToRow(master);
      const { error } = await supabase.from('masters').upsert([row]);
      if (error) {
        console.warn('Supabase saveMaster notice:', error.message);
      }
    } catch (err: any) {
      console.warn('Supabase saveMaster offline/table notice:', err?.message || err);
    }
  }

  private persistToDisk(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(
        MASTERS_FILE,
        JSON.stringify(Array.from(this.masters.values()), null, 2),
        'utf-8'
      );
    } catch {
      // Non-blocking disk failure
    }
  }
}

export const masterRepository =
  globalThis.__shokuMasterRepo || (globalThis.__shokuMasterRepo = new MasterRepositoryImpl());
