# SHOKU (職人リンク)
> **Preserving Japan's Vanishing Tacit Craft Heritage with Next-Gen Indian Talent**

[![Next.js](https://img.shields.io/badge/Next.js-16%20(Turbopack)-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Offline-First](https://img.shields.io/badge/Architecture-100%25%20Offline%20First-red.svg)]()
[![Bilingual](https://img.shields.io/badge/Language-English%20%7C%20%E6%97%A5%E6%9C%AC%E8%AA%9E-gold.svg)]()

---

## 1. WHY THIS EXISTS (The Thesis)

### The Problem
Japan is losing its master craftspeople. The average age of a recognized traditional artisan is over 70, and the majority have **no successor (後継者不在)**. When a master retires without an apprentice, decades of tacit knowledge evaporates forever:
* The heat at which steel **"sings"** under the hammer at 1050°C.
* How damp ash ruins a laminated weld seam.
* How a papermaker reads the slurry wave resistance across bamboo mesh.
* How an indigo dyer judges microbial fermentation by smell and sheen.

Regional craft ecosystems (Sakai blades, Mino washi, Arimatsu shibori, Bizen ceramics) are collapsing, taking billions of yen in enterprise value with them.

### The Reframe
This is not an unbridgeable cultural divide between Japan and India. **It is an explainable matching problem.**
India possesses a young, motivated, technically skilled workforce (metallurgists, textile chemists, precision engineers, glass carvers, master joiners) who would carry these crafts forward.
The bottlenecks are:
1. **Knowledge Transfer**: Tacit knowledge lives in hands and ears, rarely written down.
2. **Matching**: The right candidate is not connected to the right master with transparent criteria.
3. **Trust & Communication**: Reading unspoken Japanese business subtext (where polite deference "前向きに検討" often masks a refusal).

### The Solution: SHOKU
1. **Layer A (Knowledge Capture)**: Synthesize structured, teachable **Craft Manuals** from live spoken or text interviews.
2. **Layer B (Explainable Matching Engine)**: Compute deterministic **0 to 100 compatibility scores** across skill overlap, Japanese readiness, visa viability, and temperament.
3. **Layer C (Trust & Culture Co-pilot)**: Decode **Tatemae vs Honne** in Japanese business correspondence and generate culturally polite Keigo replies.
4. **Instant Bilingual Switcher**: One-click toggling between **English** and **日本語** across every surface.

---

## 2. KEY DESIGN & VISUAL ARCHITECTURE

* **Mechanical Archival Preloader**: Rolling triple-digit mechanical counter (`000` → `100%`) with dual SVG progress bars, Kanji heritage typography, and a 1-click **Skip** option for rapid live judging.
* **Three.js WebGL Shader Dissolve**: Custom GLSL FBM noise dissolve shader coupled with Lenis smooth scrolling and parallax Japanese Sumi-e branch masks over the traditional Crimson Sun canvas.
* **Formo Studio Craft Showcase**: Luxury deep crimson (`#8b151b`) washi capsule card featuring bold statement typography (`SHO • KU`), floating metric badges, and **interactive tacit hotspot inspection pins** ("Singing Weld", "Yakiba-tsuchi boundary", "Ash moisture check").

---

## 3. THREE-MINUTE LIVE DEMO SCRIPT FOR JUDGES

| Step | Surface | What You Do & What Judges Experience |
|---|---|---|
| **0:00 - 0:30** | **Preloader & Hero** | Watch the mechanical counter roll to 100% (or click Skip). Scroll down through the Three.js shader dissolve as the Sumi-e red sun reveals the craft crisis. Toggle **[ 🌐 EN \| 日本語 ]** to see instant UI translation. |
| **0:30 - 1:15** | **Formo Showcase & Hotspots** | Hover and click on the interactive pins on the craft centerpiece to inspect the tacit cues ("Singing Weld at 1050°C", "Damp Ash Moisture Test"). Click **"View Craft Manual"** to transition to Layer A. |
| **1:15 - 2:00** | **Layer A (Live Interview)** | Switch to **Live Interview**. Enter your name, craft (e.g. *Damascus Kitchen Cutlery*), and region. Answer the AI probes (or click **"Simulate Voice"**). Complete all probes, click **"Finalize"**, watch the celebratory confetti fire, and see yourself **instantly registered as an active master**! |
| **2:00 - 2:30** | **Layer B (Matching)** | Switch to **Talent Matching**. Notice your newly created master is immediately in the dropdown! Select a bladesmith to see metallurgical engineers ranked #1; switch to an indigo master to see textile chemists surface instantly. Inspect the transparent 4-factor breakdown and written reasons. |
| **2:30 - 3:00** | **Layer C & Dashboard** | Paste a negotiation email or click **"Polite Deferral (Soft No)"**. Watch the co-pilot decode the hidden refusal behind *"前向きに検討"*, highlight the Nemawashi requirements, and generate a polite Keigo reply. Finish on the **Impact Dashboard** to view the ¥850B+ valuation at risk and compounding flywheel. |

---

## 4. API REFERENCE TABLE

| Method | Endpoint | Payload / Query | Returns | Description |
|---|---|---|---|---|
| `GET` | `/api/roster` | None | `{ masters, candidates }` | Retrieves seed and runtime-created masters & candidates |
| `GET` | `/api/masters` | None | `{ masters }` | Lists all active registered masters |
| `POST` | `/api/masters` | `{ name, craft, category, region, ... }` | `{ master, success: true }` | Registers a new master |
| `GET` | `/api/manuals` | `?masterId=m-sakai-keisuke` | `{ manual }` | Retrieves or generates a structured Craft Manual |
| `POST` | `/api/manuals` | `{ masterId }` | `{ manual }` | Generates manual from technique library |
| `POST` | `/api/interview` | `{ action: 'start', masterName, craft, ... }` | `{ session, nextMessage }` | Starts live interview session |
| `POST` | `/api/interview` | `{ action: 'answer', sessionId, answerText }` | `{ session, nextMessage, isDone }` | Submits master answer and advances probes |
| `POST` | `/api/interview` | `{ action: 'finalize', sessionId }` | `{ master, manual, success: true }` | Synthesizes manual & registers master |
| `GET` | `/api/matching` | `?masterId=m-sakai-keisuke` | `{ master, results }` | Returns 0-100 ranked candidates with breakdown & reasons |
| `POST` | `/api/culture` | `{ email: string }` | `{ analysis: EmailAnalysis }` | Decodes Tatemae vs Honne and generates Keigo reply |
| `GET` | `/api/dashboard` | None | `{ stats: DashboardStats }` | Computes macro enterprise value, masters saved & flywheel |
| `POST` | `/api/transcribe` | `FormData: audio` | `{ transcript, provider }` | Speech-to-text with graceful scripted fallback |
| `GET` | `/api/health` | None | `{ status: 'healthy', mode: 'offline-first' }` | Verifies runtime status |

---

## 5. LOCAL RUN INSTRUCTIONS

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open in your browser
http://localhost:3000
```

Zero configuration, zero API keys, zero cloud locks. Everything runs locally out of the box!

