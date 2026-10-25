'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/i18n';
import { IronhillHero } from '@/components/IronhillHero';
import { EditorialGalleryShowcase } from '@/components/EditorialGalleryShowcase';
import { Master } from '@/lib/types';
import { SEED_MASTERS } from '@/lib/data/seed';
import { CraftManualModal } from '@/components/CraftManualModal';
import { InterviewModal } from '@/components/InterviewModal';
import { CraftMessagingModal } from '@/components/CraftMessagingModal';
import { KinshipAssessmentModal } from '@/components/KinshipAssessmentModal';

type UserTab = 'home' | 'profile' | 'masters';

interface UserNavbarProps {
  currentTab: UserTab;
  onSelectTab: (tab: UserTab) => void;
  lang: Language;
  onToggleLang: () => void;
  onLogout: () => void;
  email: string;
}

function UserNavbar({ currentTab, onSelectTab, lang, onToggleLang, onLogout, email }: UserNavbarProps) {
  const TABS: { id: UserTab; label: string; ja: string }[] = [
    { id: 'home', label: 'Workshops', ja: '工房一覧' },
    { id: 'profile', label: 'My Profile', ja: 'プロフィール' },
    { id: 'masters', label: 'Browse Masters', ja: '師範検索' },
  ];

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      backgroundColor: 'rgba(236,231,220,0.96)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(0,0,0,0.08)',
      fontFamily: '"GT America Trial", "Plus Jakarta Sans", sans-serif',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', height: '62px', gap: '12px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginRight: '28px', flexShrink: 0 }}>
          <img
            src="/images/shoku-icon.png"
            alt="SHOKU Emblem"
            style={{ width: '32px', height: '32px', objectFit: 'contain', display: 'block' }}
          />
          <div>
            <img
              src="/images/shoku-logo.png"
              alt="SHOKU"
              style={{ height: '22px', width: 'auto', display: 'block' }}
            />
            <div style={{ fontSize: '8px', letterSpacing: '1.5px', color: '#7a756f', textTransform: 'uppercase', marginTop: '2px' }}>
              {lang === 'ja' ? '職人リンク' : 'Artisan Network'}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '6px', flex: 1 }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              style={{
                padding: '7px 16px',
                border: currentTab === tab.id ? '1px solid #121212' : '1px solid transparent',
                borderRadius: '2px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                transition: 'all 0.15s ease',
                background: currentTab === tab.id ? '#121212' : 'transparent',
                color: currentTab === tab.id ? '#f5f2eb' : '#666',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>{lang === 'ja' ? tab.ja : tab.label}</span>
            </button>
          ))}
        </div>

        {/* Right side controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          <button
            onClick={onToggleLang}
            style={{
              background: 'transparent',
              border: '1px solid rgba(0,0,0,0.18)',
              padding: '5px 12px',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '1px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              color: '#333',
              borderRadius: '2px',
            }}
          >
            {lang === 'en' ? '日本語' : 'ENGLISH'}
          </button>
          <div style={{
            fontSize: '11px',
            color: '#666',
            maxWidth: '140px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            letterSpacing: '0.5px',
          }}>
            {email.split('@')[0]}
          </div>
          <button
            onClick={onLogout}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '10px',
              color: '#b82d23',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 700,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ─── User Profile Page ─────────────────────────────────────── */
interface UserProfilePageProps {
  lang: Language;
  candidateProfile?: {
    name?: string;
    city?: string;
    bio?: string;
    skills?: string;
    jpLevel?: string;
    resumeName?: string;
  };
  onSaveProfile?: (profile: any) => void;
}

function UserProfilePage({ lang, candidateProfile, onSaveProfile }: UserProfilePageProps) {
  const [name, setName] = useState(candidateProfile?.name || 'Aarav Sharma');
  const [city, setCity] = useState(candidateProfile?.city || 'Mumbai, India');
  const [bio, setBio] = useState(
    candidateProfile?.bio ||
      '5 years practical forge welding and steel shaping in Pune workshop. Dedicated to traditional hand-forged cutlery lineage and tacit heat judgment.'
  );
  const [skills, setSkills] = useState(
    candidateProfile?.skills || 'forge welding, TIG welding, heat treatment, steel tempering'
  );
  const [jpLevel, setJpLevel] = useState(candidateProfile?.jpLevel || 'N3');
  const [resumeName, setResumeName] = useState(
    candidateProfile?.resumeName || 'aarav_sharma_craft_cv.pdf'
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (onSaveProfile) {
      onSaveProfile({ name, city, bio, skills, jpLevel, resumeName });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#444',
    display: 'block',
    marginBottom: '8px',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    background: '#ffffff',
    border: '1px solid rgba(0,0,0,0.14)',
    borderRadius: '2px',
    fontSize: '13px',
    color: '#121212',
    fontFamily: '"GT America Trial", sans-serif',
    outline: 'none',
    marginBottom: '20px',
    transition: 'border-color 0.15s ease',
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', padding: '64px 32px 96px' }}>
      <div style={{ marginBottom: '40px', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '24px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '9px',
          fontWeight: 700,
          letterSpacing: '2.5px',
          textTransform: 'uppercase',
          color: '#b82d23',
          marginBottom: '10px',
        }}>
          <span style={{ width: '6px', height: '6px', backgroundColor: '#b82d23', borderRadius: '1px' }} />
          {lang === 'ja' ? '徒弟個人調書' : 'APPRENTICE CANDIDATE PROFILE'}
        </div>
        <h1 style={{ fontFamily: '"Cinzel", serif', fontSize: '30px', fontWeight: 400, color: '#121212', margin: 0 }}>
          {lang === 'ja' ? '弟子登録情報' : 'My Candidate Profile'}
        </h1>
        <p style={{ fontSize: '13px', color: '#666', marginTop: '8px', lineHeight: 1.6 }}>
          {lang === 'ja'
            ? '技術基礎、日本語能力、および職人弟子入りの志望動機を記録します。工房の口伝要件と自動照合されます。'
            : 'Record your foundational craft skills, language ability, and apprentice motivation to match with Japanese craft workshops.'}
        </p>
      </div>

      {/* Artisan Monogram Seal */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        marginBottom: '36px',
        padding: '24px 28px',
        background: '#ffffff',
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: '2px',
      }}>
        <div style={{
          width: '74px',
          height: '74px',
          borderRadius: '2px',
          border: '1.5px solid #121212',
          background: '#f8f6f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#121212',
          flexShrink: 0,
          position: 'relative',
        }}>
          <span style={{ fontFamily: '"Cinzel", serif', fontSize: '26px', fontWeight: 600, lineHeight: 1 }}>
            {name ? name[0].toUpperCase() : (lang === 'ja' ? '匠' : 'A')}
          </span>
          <span style={{ fontSize: '7px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px', color: '#888' }}>
            PROFILE
          </span>
        </div>

        <div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#121212', marginBottom: '4px', letterSpacing: '0.3px' }}>
            {name || 'Unregistered Candidate'}
          </div>
          <div style={{ fontSize: '12px', color: '#666', letterSpacing: '0.5px' }}>
            {city || 'Location Pending'} · Japanese Level: <strong>{jpLevel}</strong> · Lineage Intent: Living Craft
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
        <div>
          <label style={labelStyle}>{lang === 'ja' ? '氏名（フルネーム）' : 'Full Name'}</label>
          <input
            style={inputStyle}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Aarav Sharma"
          />
        </div>
        <div>
          <label style={labelStyle}>{lang === 'ja' ? '居住地（国・都市）' : 'Location / Current City'}</label>
          <input
            style={inputStyle}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Mumbai, India / Tokyo, Japan"
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>{lang === 'ja' ? '専門技術（カンマ区切り）' : 'Technical Skills (comma-separated)'}</label>
        <input
          style={inputStyle}
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="forge hammering, TIG welding, ceramic wheel throwing, joinery"
        />
      </div>

      <div>
        <label style={labelStyle}>{lang === 'ja' ? '日本語能力' : 'Japanese Language Proficiency'}</label>
        <select
          value={jpLevel}
          onChange={(e) => setJpLevel(e.target.value)}
          style={{ ...inputStyle, cursor: 'pointer', marginBottom: '20px' }}
        >
          {['N1 (Fluent)', 'N2 (Advanced Working)', 'N3 (Daily Conversational)', 'N4 (Basic Communication)', 'N5 (Introductory)', 'None (Willing to study)'].map((l) => (
            <option key={l} value={l.split(' ')[0]}>{l}</option>
          ))}
        </select>
      </div>

      <div>
        <label style={labelStyle}>{lang === 'ja' ? '志望動機・職歴' : 'Motivation & Hands-on Experience'}</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          placeholder="Detail your practical hands-on experience, tactile aptitude, and why you wish to preserve this specific Japanese craft lineage..."
          style={{ ...inputStyle, resize: 'vertical', marginBottom: '24px' }}
        />
      </div>

      {/* Upload zone */}
      <div style={{ marginBottom: '36px' }}>
        <label style={labelStyle}>{lang === 'ja' ? '履歴書・ポートフォリオ (PDF)' : 'Portfolio / Resume Document (PDF)'}</label>
        <div
          style={{
            border: '1.5px dashed rgba(0,0,0,0.18)',
            borderRadius: '2px',
            padding: '32px 24px',
            textAlign: 'center',
            background: '#ffffff',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
          }}
          onClick={() => document.getElementById('resume-upload')?.click()}
        >
          <div style={{ color: '#121212', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="12" y2="12" />
              <line x1="15" y1="15" x2="12" y2="12" />
            </svg>
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#121212', marginBottom: '4px' }}>
            {resumeName || 'Select or drop craft portfolio dossier (PDF)'}
          </div>
          <div style={{ fontSize: '11px', color: '#888', letterSpacing: '0.5px' }}>
            Accepted: PDF up to 25MB with photos of previous works, workshop certificates, and language transcripts
          </div>
          <input
            id="resume-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
            onChange={(e) => setResumeName(e.target.files?.[0]?.name || '')}
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        style={{
          padding: '14px 36px',
          background: saved ? '#2a6344' : '#121212',
          border: 'none',
          color: '#f5f2eb',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          cursor: 'pointer',
          fontFamily: 'inherit',
          borderRadius: '2px',
          transition: 'all 0.2s ease',
        }}
      >
        {saved ? '● Dossier Stamped & Saved to Living Archive' : 'Commit Profile to Living Archive →'}
      </button>
    </div>
  );
}

/* ─── Find Masters Page ─────────────────────────────────────── */
const CARD_PHOTOS: Record<string, string> = {
  'm-sakai-keisuke': '/images/master-sakai.jpg',
  'm-mino-chiyo': '/images/master-mino.jpg',
  'm-arimatsu-hiroshi': '/images/master-arimatsu.jpg',
  'm-bizen-kenji': '/images/master-bizen.jpg',
  'm-edo-takashi': '/images/master-edo.jpg',
  'm-kyoto-nobuo': '/images/master-kyoto.jpg',
};

const CATEGORIES = [
  { id: 'all', label: 'All Crafts', ja: '全工芸' },
  { id: 'metalwork', label: 'Metalwork', ja: '鍛冶・金工' },
  { id: 'paper', label: 'Washi Paper', ja: '和紙' },
  { id: 'textiles', label: 'Textiles', ja: '染織' },
  { id: 'ceramics', label: 'Ceramics', ja: '陶芸' },
  { id: 'woodwork', label: 'Woodwork', ja: '木工' },
];

function FindMastersPage({
  masters,
  lang,
  onViewManual,
  onExpressInterest,
  onAssessKinship,
}: {
  masters: Master[];
  lang: Language;
  onViewManual: (m: Master) => void;
  onExpressInterest: (m: Master) => void;
  onAssessKinship: (m: Master) => void;
}) {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = masters.filter((m) => {
    const matchCat = filter === 'all' || m.category === filter;
    const matchSearch =
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.craft.toLowerCase().includes(search.toLowerCase()) ||
      m.region.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 32px 100px' }}>
      <div style={{ marginBottom: '44px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '9px',
          fontWeight: 700,
          letterSpacing: '2.5px',
          textTransform: 'uppercase',
          color: '#b82d23',
          marginBottom: '10px',
        }}>
          <span style={{ width: '6px', height: '6px', backgroundColor: '#b82d23', borderRadius: '1px' }} />
          {lang === 'ja' ? '師範名鑑' : 'LIVING MASTER DIRECTORY'}
        </div>
        <h1 style={{ fontFamily: '"Cinzel", serif', fontSize: '32px', fontWeight: 400, color: '#121212', margin: '0 0 10px' }}>
          {lang === 'ja' ? '伝統工芸師範一覧' : 'Browse Craft Masters'}
        </h1>
        <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.6, maxWidth: '640px', margin: '0 0 28px' }}>
          {lang === 'ja'
            ? '後継者を求める日本の伝統工芸工房と師範を検索し、弟子入り要件を確認できます。'
            : 'Explore Japanese master craftspeople seeking successors. View their craft techniques, requirements, and voice explanations.'}
        </p>

        {/* Search & Category Filter Tabs */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === 'ja' ? '師範名、工芸技法、所在地で検索...' : 'Search by master name, craft technique, or region...'}
            style={{
              flex: 1,
              minWidth: '260px',
              padding: '12px 16px',
              border: '1px solid rgba(0,0,0,0.14)',
              borderRadius: '2px',
              fontSize: '13px',
              outline: 'none',
              fontFamily: 'inherit',
              background: '#ffffff',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              style={{
                padding: '7px 16px',
                borderRadius: '2px',
                border: filter === cat.id ? '1px solid #121212' : '1px solid rgba(0,0,0,0.1)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                background: filter === cat.id ? '#121212' : '#ffffff',
                color: filter === cat.id ? '#f5f2eb' : '#555',
                transition: 'all 0.15s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>{lang === 'ja' ? cat.ja : cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Masters Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px' }}>
        {filtered.map((m) => {
          return (
            <div
              key={m.id}
              style={{
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '2px',
                overflow: 'hidden',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Photo */}
              <div style={{ aspectRatio: '16/10', overflow: 'hidden', background: '#1c1c1f', position: 'relative' }}>
                <img
                  src={CARD_PHOTOS[m.id] || '/images/master-sakai.jpg'}
                  alt={m.craft}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'sepia(0.08) contrast(1.04)' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                {m.noSuccessor && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: '#b82d23',
                    color: '#fff',
                    fontSize: '9px',
                    fontWeight: 800,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    padding: '3px 8px',
                    borderRadius: '1px',
                  }}>
                    {lang === 'ja' ? '後継者不在 · 緊急' : 'SUCCESSOR NEEDED · URGENT'}
                  </div>
                )}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(18,18,18,0.82)',
                  color: '#f5f2eb',
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  padding: '3px 8px',
                  borderRadius: '1px',
                }}>
                  {m.yearsExperience} YR LINEAGE
                </div>
              </div>

              {/* Meta */}
              <div style={{ padding: '20px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  fontSize: '9px',
                  fontWeight: 800,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#7a756f',
                  marginBottom: '8px',
                }}>
                  {m.category} · {lang === 'ja' ? m.regionJa : m.region}
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '4px' }}>
                  <h3 style={{ fontFamily: '"Cinzel", serif', fontSize: '18px', fontWeight: 400, color: '#121212', margin: 0 }}>
                    {m.name}
                  </h3>
                  {lang === 'ja' && (
                    <span style={{ fontFamily: '"Shippori Mincho", serif', fontSize: '14px', color: '#888' }}>
                      {m.nameJa}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '11px', color: '#555', marginBottom: '12px', letterSpacing: '0.5px' }}>
                  {m.region} · {m.craft}
                </div>

                <p style={{
                  fontSize: '12px',
                  color: '#666',
                  lineHeight: 1.65,
                  margin: '0 0 16px',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {lang === 'ja' && m.bioJa ? m.bioJa : m.bio}
                </p>

                {/* Spoken Atelier Criteria Preview if available */}
                {m.craftExplanation && (
                  <div style={{
                    marginBottom: '16px',
                    padding: '10px 12px',
                    background: 'rgba(212,175,55,0.06)',
                    border: '1px solid rgba(212,175,55,0.25)',
                    borderRadius: '2px',
                    fontSize: '11px',
                    color: '#444',
                    lineHeight: 1.5,
                  }}>
                    <div style={{
                      fontSize: '8px',
                      fontWeight: 800,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: '#9e7d1e',
                      marginBottom: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}>
                      <span>🎙</span> {lang === 'ja' ? '工房口伝記録 (音声認識)' : 'WORKSHOP VOICE EXPLANATION'}
                    </div>
                    <div style={{ fontStyle: 'italic', color: '#222' }}>
                      &ldquo;{m.craftExplanation.slice(0, 100)}...&rdquo;
                    </div>
                  </div>
                )}

                <div style={{ marginTop: 'auto' }}>
                  {/* Bilateral Gemini Kinship Fit Assessment Button */}
                  <button
                    onClick={() => onAssessKinship(m)}
                    style={{
                      width: '100%',
                      padding: '11px',
                      border: '1px solid #d4af37',
                      background: 'linear-gradient(180deg, #faf5eb 0%, #f4ebd9 100%)',
                      color: '#856404',
                      fontSize: '10px',
                      fontWeight: 800,
                      letterSpacing: '1.2px',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      borderRadius: '2px',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ color: '#d4af37', fontSize: '12px' }}>✦</span>
                    Assess My Resume Fit (Gemini AI) →
                  </button>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                      onClick={() => onViewManual(m)}
                      style={{
                        padding: '10px',
                        border: '1px solid #121212',
                        background: 'transparent',
                        color: '#121212',
                        fontSize: '10px',
                        fontWeight: 800,
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        borderRadius: '2px',
                      }}
                    >
                      Read Manual →
                    </button>
                    <button
                      onClick={() => onExpressInterest(m)}
                      style={{
                        padding: '10px',
                        border: '1px solid #b82d23',
                        background: '#b82d23',
                        color: '#f5f2eb',
                        fontSize: '10px',
                        fontWeight: 800,
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        borderRadius: '2px',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      Express Interest →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '96px 0', color: '#888', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase' }}>
          No masters found matching criteria.
        </div>
      )}
    </div>
  );
}

/* ─── User App Shell ─────────────────────────────────────────── */
interface UserAppProps {
  email: string;
  onLogout: () => void;
}

export function UserApp({ email, onLogout }: UserAppProps) {
  const [tab, setTab] = useState<UserTab>('home');
  const [lang, setLang] = useState<Language>('en');
  const [masters, setMasters] = useState<Master[]>(SEED_MASTERS);
  const [activeMaster, setActiveMaster] = useState<Master>(SEED_MASTERS[0]);
  const [viewingManual, setViewingManual] = useState<Master | null>(null);
  const [interviewingMaster, setInterviewingMaster] = useState<Master | null>(null);
  const [messagingMaster, setMessagingMaster] = useState<Master | null>(null);
  const [assessingMaster, setAssessingMaster] = useState<Master | null>(null);

  const [candidateProfile, setCandidateProfile] = useState<{
    name: string;
    city: string;
    bio: string;
    skills: string;
    jpLevel: string;
    resumeName: string;
  }>({
    name: 'Aarav Sharma',
    city: 'Mumbai, India',
    bio: '5 years practical forge welding and steel shaping in Pune workshop. Dedicated to traditional hand-forged cutlery lineage and tacit heat judgment.',
    skills: 'forge welding, TIG welding, heat treatment, steel tempering',
    jpLevel: 'N3',
    resumeName: 'aarav_sharma_craft_cv.pdf',
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--gallery-bg)' }}>
      <UserNavbar
        currentTab={tab}
        onSelectTab={setTab}
        lang={lang}
        onToggleLang={() => setLang((l) => (l === 'en' ? 'ja' : 'en'))}
        onLogout={onLogout}
        email={email}
      />

      {tab === 'home' && (
        <>
          <IronhillHero />
          <EditorialGalleryShowcase
            masters={masters}
            activeMaster={activeMaster}
            onSelectMaster={setActiveMaster}
            onViewManual={() => setViewingManual(activeMaster)}
            onStartInterview={() => setInterviewingMaster(activeMaster)}
            onMessageMaster={() => setMessagingMaster(activeMaster)}
            lang={lang}
          />
        </>
      )}

      {tab === 'profile' && (
        <UserProfilePage
          lang={lang}
          candidateProfile={candidateProfile}
          onSaveProfile={setCandidateProfile}
        />
      )}

      {tab === 'masters' && (
        <FindMastersPage
          masters={masters}
          lang={lang}
          onViewManual={(m) => setViewingManual(m)}
          onExpressInterest={(m) => setMessagingMaster(m)}
          onAssessKinship={(m) => setAssessingMaster(m)}
        />
      )}

      <CraftManualModal
        master={viewingManual}
        onClose={() => setViewingManual(null)}
        lang={lang}
      />

      <InterviewModal
        master={interviewingMaster}
        onClose={() => setInterviewingMaster(null)}
        lang={lang}
      />

      <CraftMessagingModal
        master={messagingMaster}
        candidateEmail={email}
        onClose={() => setMessagingMaster(null)}
        lang={lang}
      />

      <KinshipAssessmentModal
        master={assessingMaster}
        candidateProfile={candidateProfile}
        onClose={() => setAssessingMaster(null)}
        onOpenMessaging={(m) => {
          setAssessingMaster(null);
          setMessagingMaster(m);
        }}
        lang={lang}
      />
    </div>
  );
}

