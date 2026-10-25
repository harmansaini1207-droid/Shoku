import fs from 'fs';
import path from 'path';
import { Master } from '../types';
import { SEED_MASTERS } from '../data/seed';

const DATA_DIR = path.join(process.cwd(), 'data', 'generated');
const MASTERS_FILE = path.join(DATA_DIR, 'masters.json');

declare global {
  // eslint-disable-next-line no-var
  var __shokuMasterRepo: MasterRepositoryImpl | undefined;
}

class MasterRepositoryImpl {
  private masters: Map<string, Master> = new Map();

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
  }

  public getAllMasters(): Master[] {
    return Array.from(this.masters.values());
  }

  public getMasterById(id: string): Master | undefined {
    return this.masters.get(id);
  }

  public saveMaster(master: Master): void {
    this.masters.set(master.id, master);
    this.persistToDisk();
  }

  private persistToDisk(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(MASTERS_FILE, JSON.stringify(Array.from(this.masters.values()), null, 2), 'utf-8');
    } catch {
      // Non-blocking disk failure
    }
  }
}

export const masterRepository =
  globalThis.__shokuMasterRepo || (globalThis.__shokuMasterRepo = new MasterRepositoryImpl());
