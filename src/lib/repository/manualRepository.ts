import fs from 'fs';
import path from 'path';
import { CraftManual } from '../types';

const DATA_DIR = path.join(process.cwd(), 'data', 'generated');
const MANUALS_FILE = path.join(DATA_DIR, 'manuals.json');

declare global {
  // eslint-disable-next-line no-var
  var __shokuManualRepo: ManualRepositoryImpl | undefined;
}

class ManualRepositoryImpl {
  private manuals: Map<string, CraftManual> = new Map();

  constructor() {
    this.init();
  }

  private init() {
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
  }

  public getAllManuals(): CraftManual[] {
    return Array.from(this.manuals.values());
  }

  public getManualByMasterId(masterId: string): CraftManual | undefined {
    return this.manuals.get(masterId);
  }

  public saveManual(manual: CraftManual): void {
    this.manuals.set(manual.masterId, manual);
    this.persistToDisk();
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
