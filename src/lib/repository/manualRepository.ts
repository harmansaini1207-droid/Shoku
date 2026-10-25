import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { CraftManual } from '../types';

const DATA_DIR = path.join(process.cwd(), 'data', 'generated');
const MANUALS_FILE = path.join(DATA_DIR, 'manuals.json');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mtaduagclxirfhvjnrzo.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_CGUpc5vRZawcTL1PduTiMw_RbBDWdQr';
const supabase = createClient(supabaseUrl, supabaseKey);

declare global {
  // eslint-disable-next-line no-var
  var __shokuManualRepo: ManualRepositoryImpl | undefined;
}

function manualToRow(m: CraftManual) {
  return {
    id: m.id,
    master_id: m.masterId,
    craft: m.craft,
    overview: m.overview || '',
    overview_ja: m.overviewJa || '',
    tools: m.tools || [],
    techniques: m.techniques || [],
    heritage_notes: m.heritageNotes || '',
    heritage_notes_ja: m.heritageNotesJa || '',
    produced_by: m.producedBy || 'Gemini Tacit Knowledge Codifier',
    generated_at: m.generatedAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function rowToManual(r: any): CraftManual {
  return {
    id: r.id,
    masterId: r.master_id || r.masterId,
    craft: r.craft || '',
    generatedAt: r.generated_at || r.generatedAt || new Date().toISOString(),
    overview: r.overview || '',
    overviewJa: r.overview_ja || r.overviewJa || '',
    tools: Array.isArray(r.tools)
      ? r.tools
      : typeof r.tools === 'string'
      ? JSON.parse(r.tools)
      : [],
    techniques: Array.isArray(r.techniques)
      ? r.techniques
      : typeof r.techniques === 'string'
      ? JSON.parse(r.techniques)
      : [],
    heritageNotes: r.heritage_notes || r.heritageNotes || '',
    heritageNotesJa: r.heritage_notes_ja || r.heritageNotesJa || '',
    producedBy: r.produced_by || r.producedBy || 'Gemini Tacit Knowledge Codifier',
  };
}

class ManualRepositoryImpl {
  private manuals: Map<string, CraftManual> = new Map();

  constructor() {
    this.init();
  }

  private init() {
    // 1. Read from disk if present
    try {
      if (fs.existsSync(MANUALS_FILE)) {
        const raw = fs.readFileSync(MANUALS_FILE, 'utf-8');
        const list: CraftManual[] = JSON.parse(raw);
        for (const m of list) {
          this.manuals.set(m.masterId, m);
        }
      }
    } catch {
      // Graceful fallback to in-memory
    }

    // 2. Hydrate from Supabase
    this.syncFromSupabase();
  }

  public async syncFromSupabase(): Promise<void> {
    try {
      const { data, error } = await supabase.from('manuals').select('*');
      if (!error && data && data.length > 0) {
        for (const row of data) {
          const m = rowToManual(row);
          this.manuals.set(m.masterId, m);
        }
        this.persistToDisk();
      }
    } catch {
      // Offline or table not ready yet
    }
  }

  public getAllManuals(): CraftManual[] {
    return Array.from(this.manuals.values());
  }

  public getManualByMasterId(masterId: string): CraftManual | undefined {
    return this.manuals.get(masterId);
  }

  public async saveManual(manual: CraftManual): Promise<void> {
    this.manuals.set(manual.masterId, manual);
    this.persistToDisk();

    // Persist to Supabase
    try {
      const row = manualToRow(manual);
      await supabase.from('manuals').upsert([row]);
    } catch {
      // Non-blocking
    }
  }

  private persistToDisk(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(
        MANUALS_FILE,
        JSON.stringify(Array.from(this.manuals.values()), null, 2),
        'utf-8'
      );
    } catch {
      // Non-blocking
    }
  }
}

export const manualRepository =
  globalThis.__shokuManualRepo || (globalThis.__shokuManualRepo = new ManualRepositoryImpl());
