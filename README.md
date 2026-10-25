# SHOKU (職人リンク)
> **Preserving Japan's Vanishing Tacit Craft Heritage with Next-Gen Indian Talent**

[![Next.js](https://img.shields.io/badge/Next.js-16%20(Turbopack)-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Offline-First](https://img.shields.io/badge/Architecture-100%25%20Offline%20First-red.svg)]()
[![Bilingual](https://img.shields.io/badge/Language-English%20%7C%20%E6%97%A5%E6%9C%AC%E8%AA%9E-gold.svg)]()

---

## WHY THIS EXISTS (The Thesis)

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





 API REFERENCE TABLE

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


