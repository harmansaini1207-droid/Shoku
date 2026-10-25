# 職 SHOKU — Craft Heritage × Human Potential

> **Connecting Japan's dying traditional crafts with India's next generation of artisans — powered by AI.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI%20Powered-orange?logo=google)](https://ai.google.dev/)
[![WisperFlow](https://img.shields.io/badge/WisperFlow-Voice%20Transcription-purple)](https://wisperflow.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green?logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## 🎯 The Problem

Japan has a **cultural emergency**.

The average traditional master craftsperson (職人, *shokunin*) is **over 70 years old**, and the majority have **no successor**. When they retire, centuries of tacit knowledge disappear forever:

- The exact temperature at which steel "sings" under a hammer at 1,050 °C
- How an indigo dyer smells microbial fermentation to judge the vat's readiness
- The bamboo-mesh slurry technique a Mino washi papermaker reads by wave resistance
- The hand pressure that distinguishes a master joiner's finished surface from a novice's

Entire regional craft ecosystems — **Sakai blades, Arimatsu shibori, Bizen ceramics, Mino washi** — are collapsing. The enterprise value of this disappearing knowledge is in the billions of yen.

Meanwhile, India has a **young, motivated, technically skilled workforce** — metallurgists, textile chemists, woodworkers, precision engineers — hungry for meaningful work and willing to dedicate years to mastery. They just do not know each other exist.

**This is not a cultural divide. It is a matching problem.**

---

## 💡 Our Solution: SHOKU

SHOKU is a bilingual AI platform that bridges Japanese craft masters and Indian craft apprentices through three intelligent layers:

### 🧠 Layer 1 — Knowledge Capture (Voice → Profile)
Masters speak in their own words. SHOKU listens, transcribes, and structures their knowledge into a living **Craft Profile** using:
- **Real-time in-person voice transcription** via WisperFlow API + Web Speech API
- **AI-powered profile generation** via Google Gemini — turning raw speech into structured craft manuals covering tools, techniques, failure modes, and tacit wisdom

### 🎯 Layer 2 — Explainable Matching Engine
No black-box algorithms. SHOKU computes **transparent 0–100 compatibility scores** for each candidate across:
- **Skill overlap** — craft domain alignment with master's listed techniques
- **Japanese readiness** — language level, cultural awareness, prior Japan exposure
- **Visa viability** — eligibility for Japan's Specified Skilled Worker program
- **Temperament fit** — patience, attention to detail, commitment to long-form mastery
- **Gemini AI analysis** — deep semantic comparison of candidate resume vs. master's craft profile

Each match comes with a **plain-English explanation** of why the candidate fits (or doesn't).

### 🌐 Layer 3 — Bilingual Interface
One-click toggle between **English** and **日本語** across every surface. Built for masters who only speak Japanese and candidates who only speak English.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🎙️ **Live Voice Transcription** | Real-time dictation via WisperFlow + Web Speech API — masters speak, SHOKU writes |
| 🤖 **AI Craft Profiles** | Gemini AI structures raw speech into detailed, searchable craft knowledge |
| 🔍 **Smart Candidate Matching** | Multi-dimensional scoring with plain-language explanations powered by Gemini |
| 📋 **Workshop Management** | Full business console for masters to manage their profile, workshops, and candidates |
| 👤 **Apprentice Profiles** | Candidates upload resumes; Gemini extracts skills and matches them to masters |
| 🌐 **Bilingual UI** | Full English ↔ 日本語 toggle — no barriers for either side |
| 📊 **Heritage Dashboard** | Live stats on masters saved, candidates matched, and enterprise value preserved |
| 🔒 **Dual Login System** | Separate portals for craft masters (business) and candidates (apprentices) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router, Turbopack), React 18, TypeScript |
| **Styling** | Vanilla CSS, custom design system with dark editorial aesthetic |
| **Animations** | GSAP 3, Lenis smooth scroll, Three.js background scenes |
| **AI — Profiles & Matching** | Google Gemini API (gemini-1.5-flash) |
| **Voice Transcription** | WisperFlow API + Web Speech API (SpeechRecognition) |
| **Backend / Auth** | Supabase (PostgreSQL, Auth, Storage) |
| **Icons** | Lucide React |
| **Deployment** | Vercel-ready (Next.js App Router) |

---

## 🗂️ Project Structure

```
shoku/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── matching/       # Gemini-powered candidate scoring
│   │   │   ├── interview/      # AI-guided master interview sessions
│   │   │   ├── manuals/        # Craft manual generation
│   │   │   ├── transcribe/     # WisperFlow audio transcription
│   │   │   ├── culture/        # Tatemae/Honne email decoder
│   │   │   ├── masters/        # Master registration & retrieval
│   │   │   ├── roster/         # Full platform roster
│   │   │   ├── dashboard/      # Heritage impact stats
│   │   │   └── health/         # Runtime status
│   │   ├── page.tsx            # Root page (preloader + session routing)
│   │   ├── layout.tsx          # App shell & metadata
│   │   └── globals.css         # Design system & global styles
│   ├── components/
│   │   ├── BusinessApp.tsx          # Master console (workshops, candidates, profile)
│   │   ├── UserApp.tsx              # Apprentice console (browse, apply, profile)
│   │   ├── EditorialGalleryShowcase.tsx  # Masters discovery gallery
│   │   ├── IronhillHero.tsx         # Landing hero
│   │   ├── LoginPage.tsx            # Dual-portal authentication
│   │   ├── InterviewModal.tsx       # AI interview flow
│   │   ├── CraftManualModal.tsx     # Manual viewer
│   │   ├── CraftMessagingModal.tsx  # Culture decoder & messaging
│   │   ├── KinshipAssessmentModal.tsx   # Compatibility deep-dive
│   │   └── InsanePreloader.tsx      # Cinematic loading experience
│   └── lib/
│       ├── engines/
│       │   └── matchingEngine.ts    # Scoring algorithms
│       └── repository/
│           └── masterRepository.ts  # In-memory + Supabase data layer
└── data/
    └── generated/
        └── manuals.json             # Seeded craft knowledge base
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Google Gemini API key
- A WisperFlow API key
- A Supabase project

### 1. Clone the repository
```bash
git clone https://github.com/harmansaini1207-droid/Shoku.git
cd Shoku
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy `.env.example` to `.env.local` and fill in your keys:
```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
GEMINI_API_KEY=your_gemini_api_key
WISPERFLOW_API_KEY=your_wisperflow_key
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in as a **Master** or **Apprentice**.

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/roster` | All masters & candidates |
| `GET/POST` | `/api/masters` | List or register masters |
| `GET/POST` | `/api/manuals` | Retrieve or generate craft manuals |
| `POST` | `/api/interview` | AI-guided master interview (start / answer / finalize) |
| `GET` | `/api/matching` | Ranked candidate list with Gemini scoring & explanation |
| `POST` | `/api/transcribe` | Audio → transcript via WisperFlow |
| `POST` | `/api/culture` | Tatemae vs Honne email decoder + Keigo reply generator |
| `GET` | `/api/dashboard` | Heritage impact stats |
| `GET` | `/api/health` | Runtime health check |

---

## 🎨 Design Philosophy

SHOKU is built with an **editorial dark aesthetic** — evoking the precision, restraint, and depth of Japanese craft culture:

- Deep charcoal backgrounds with warm amber and indigo accents
- Cinematic preloader with Three.js particle systems
- GSAP-powered smooth scroll and micro-animations throughout
- Monospace type for technical precision; editorial serif for cultural warmth
- Every interaction feels considered — like the work it is built to preserve

---

## 🌏 Impact

| Metric | Value |
|---|---|
| Traditional crafts at risk of extinction | 200+ in Japan alone |
| Average age of a recognized Japanese artisan | 70+ years |
| Indian skilled workers potentially eligible for placement | Millions |
| Heritage enterprise value at risk | ¥ Billions |
| Time to first AI-generated candidate match | < 5 seconds |

---

## 👥 Team

Built by **Team Sonty** — crafted with care, urgency, and a deep respect for what gets lost when knowledge dies with its keeper.

---

## 📄 License

MIT © 2025 Team Sonty

---

*"The best time to preserve a craft was 30 years ago. The second best time is now."*
