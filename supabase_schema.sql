-- ========================================================
-- SHOKU (職) — Supabase PostgreSQL Database Schema
-- Complete backend schema for Living Craft Lineage Platform
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/mtaduagclxirfhvjnrzo/sql
-- ========================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------
-- 1. MASTERS TABLE (Ateliers / Workshops / Living Masters)
-- Stores all workshop profiles, contact info, voice explanations,
-- techniques, and lineage details.
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.masters (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_ja TEXT DEFAULT '',
  craft TEXT NOT NULL,
  craft_ja TEXT DEFAULT '',
  category TEXT DEFAULT 'metalwork',
  region TEXT DEFAULT '',
  region_ja TEXT DEFAULT '',
  age INTEGER DEFAULT 60,
  years_experience INTEGER DEFAULT 30,
  no_successor BOOLEAN DEFAULT false,
  annual_revenue_jpy BIGINT DEFAULT 0,
  enterprise_value_jpy BIGINT DEFAULT 0,
  bio TEXT DEFAULT '',
  bio_ja TEXT DEFAULT '',
  techniques JSONB DEFAULT '[]'::jsonb,
  languages JSONB DEFAULT '[]'::jsonb,
  image_url TEXT DEFAULT '',
  craft_explanation TEXT DEFAULT '',
  audio_dossier_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- --------------------------------------------------------
-- 2. CANDIDATES TABLE (International Apprentices / Applicants)
-- Stores apprentice applications, portfolios, skills, and background.
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.candidates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT DEFAULT '',
  age INTEGER DEFAULT 25,
  skills JSONB DEFAULT '[]'::jsonb,
  interests JSONB DEFAULT '[]'::jsonb,
  japanese_level TEXT DEFAULT 'N4',
  preferred_medium TEXT DEFAULT '',
  background TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  portfolio_url TEXT DEFAULT '',
  email TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- --------------------------------------------------------
-- 3. MESSAGES TABLE (Cross-cultural Apprentice Inquiries)
-- Stores correspondence between candidates and masters,
-- including DeepL translations and cultural intent analysis.
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.messages (
  id TEXT PRIMARY KEY DEFAULT ('msg-' || substr(md5(random()::text), 1, 12)),
  master_id TEXT REFERENCES public.masters(id) ON DELETE CASCADE,
  sender_email TEXT NOT NULL,
  sender_role TEXT DEFAULT 'candidate', -- 'candidate' or 'master'
  text TEXT NOT NULL,
  literal_translation TEXT,
  cultural_intent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- --------------------------------------------------------
-- 4. MANUALS TABLE (Tacit Knowledge Codification Dossiers)
-- Stores AI-generated craft preservation manuals, steps,
-- safety protocols, and tacit sensory cues.
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.manuals (
  id TEXT PRIMARY KEY,
  master_id TEXT REFERENCES public.masters(id) ON DELETE CASCADE,
  craft TEXT DEFAULT '',
  overview TEXT DEFAULT '',
  overview_ja TEXT DEFAULT '',
  tools JSONB DEFAULT '[]'::jsonb,
  techniques JSONB DEFAULT '[]'::jsonb,
  heritage_notes TEXT DEFAULT '',
  heritage_notes_ja TEXT DEFAULT '',
  produced_by TEXT DEFAULT 'Gemini Tacit Knowledge Codifier',
  generated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- --------------------------------------------------------
-- 5. CANDIDATE EVALUATIONS TABLE (AI Matching Results)
-- Stores resume-to-workshop suitability scores and explanations.
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.candidate_evaluations (
  id TEXT PRIMARY KEY DEFAULT ('eval-' || substr(md5(random()::text), 1, 12)),
  master_id TEXT REFERENCES public.masters(id) ON DELETE CASCADE,
  candidate_id TEXT,
  overall_score NUMERIC DEFAULT 0,
  breakdown JSONB DEFAULT '{}'::jsonb,
  explanation TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- --------------------------------------------------------
-- Row Level Security (RLS) Setup
-- Allow read and write for public/anon clients (offline-first API)
-- --------------------------------------------------------
ALTER TABLE public.masters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manuals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_evaluations ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read masters" ON public.masters FOR SELECT USING (true);
CREATE POLICY "Public insert/update masters" ON public.masters FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read candidates" ON public.candidates FOR SELECT USING (true);
CREATE POLICY "Public insert/update candidates" ON public.candidates FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read messages" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Public insert messages" ON public.messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read manuals" ON public.manuals FOR SELECT USING (true);
CREATE POLICY "Public insert/update manuals" ON public.manuals FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read evaluations" ON public.candidate_evaluations FOR SELECT USING (true);
CREATE POLICY "Public insert evaluations" ON public.candidate_evaluations FOR ALL USING (true) WITH CHECK (true);

-- Indexes for optimal lookup performance
CREATE INDEX IF NOT EXISTS idx_messages_master_id ON public.messages(master_id);
CREATE INDEX IF NOT EXISTS idx_manuals_master_id ON public.manuals(master_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_master_id ON public.candidate_evaluations(master_id);
