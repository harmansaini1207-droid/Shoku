'use client';

import React, { useState, useRef } from 'react';
import { Language } from '@/lib/i18n';
import { Master, MatchResult } from '@/lib/types';
import { SEED_MASTERS } from '@/lib/data/seed';
import { IronhillHero } from '@/components/IronhillHero';
import { EditorialGalleryShowcase } from '@/components/EditorialGalleryShowcase';
import { CraftManualModal } from '@/components/CraftManualModal';
import { InterviewModal } from '@/components/InterviewModal';
import { CraftMessagingModal } from '@/components/CraftMessagingModal';

type BusinessTab = 'home' | 'matching' | 'profile';

/* ─── Business Navbar ─────────────────────────────────────── */
interface BusinessNavbarProps {
  currentTab: BusinessTab;
  onSelectTab: (tab: BusinessTab) => void;
  lang: Language;
  onToggleLang: () => void;
  onLogout: () => void;
  email: string;
}

function BusinessNavbar({ currentTab, onSelectTab, lang, onToggleLang, onLogout, email }: BusinessNavbarProps) {
  const TABS: { id: BusinessTab; label: string; ja: string }[] = [
    { id: 'home', label: 'Guild Archive', ja: '伝承総覧' },
    { id: 'matching', label: 'Matching Engine', ja: '技能照合' },
    { id: 'profile', label: 'Workshop Dossier', ja: '工房調書' },
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
              Guild Console
            </div>
          </div>
        </div>

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
              <span>{tab.label}</span>
              <span style={{
                fontFamily: '"Shippori Mincho", serif',
                fontSize: '10px',
                opacity: currentTab === tab.id ? 0.65 : 0.45,
              }}>
                {tab.ja}
              </span>
            </button>
          ))}
        </div>

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

/* ─── Matching Engine Page ───────────────────────────────── */
function MatchingEnginePage({
  masters,
  lang,
  onOpenDialogue,
}: {
  masters: Master[];
  lang: Language;
  onOpenDialogue?: (master: Master) => void;
}) {
  const [selectedMasterId, setSelectedMasterId] = useState(masters[0]?.id ?? '');
  const [results, setResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [ran, setRan] = useState(false);

  const selectedMaster = masters.find((m) => m.id === selectedMasterId) ?? masters[0];

  const runMatch = async () => {
    setLoading(true);
    setRan(false);
    try {
      const res = await fetch(`/api/matching?masterId=${selectedMasterId}`);
      const data = await res.json();
      if (data.results) {
        setResults(data.results);
      } else {
        throw new Error('No results');
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
      setRan(true);
    }
  };

  return (
    <div style={{
      backgroundColor: '#ece7dc',
      minHeight: 'calc(100vh - 62px)',
      padding: '56px 32px 100px',
      fontFamily: '"GT America Trial", "Plus Jakarta Sans", sans-serif',
      backgroundImage: `
        linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px)
      `,
      backgroundSize: '48px 48px',
    }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>

        <div style={{ marginBottom: '44px', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '24px' }}>
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
            BILATERAL TACIT SKILL COMPATIBILITY MATRIX · 技能親和性照合
          </div>
          <h1 style={{ fontFamily: '"Cinzel", serif', fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 400, color: '#121212', margin: '0 0 10px' }}>
            Artisan Kinship Evaluation Engine
          </h1>
          <p style={{ fontSize: '13px', color: '#55555e', lineHeight: 1.6, maxWidth: '680px' }}>
            Powered by <strong>Gemini 2.5 Flash</strong> to autonomously extract applicant resumes, identify tactile skill synergies, and evaluate succession compatibility.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* Master Selector */}
          <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '2px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
            <label style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#55555e', display: 'block', marginBottom: '12px' }}>
              Select Living Master Lineage / 伝承師範
            </label>
            <select
              value={selectedMasterId}
              onChange={(e) => setSelectedMasterId(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                background: '#faf8f4',
                border: '1px solid rgba(0,0,0,0.14)',
                borderRadius: '2px',
                color: '#121212',
                fontSize: '13px',
                fontFamily: 'inherit',
                outline: 'none',
                cursor: 'pointer',
                marginBottom: '16px',
              }}
            >
              {masters.map((m) => (
                <option key={m.id} value={m.id}>{m.name} ({m.nameJa}) — {m.craft.split('(')[0].trim()}</option>
              ))}
            </select>

            {selectedMaster && (
              <div style={{ background: '#faf8f4', borderRadius: '2px', padding: '16px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#121212' }}>{selectedMaster.name}</span>
                  <span style={{ fontFamily: '"Shippori Mincho", serif', fontSize: '13px', color: '#b82d23' }}>{selectedMaster.nameJa}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#666', lineHeight: 1.5, marginBottom: '10px' }}>
                  {selectedMaster.region} · {selectedMaster.craft} · {selectedMaster.yearsExperience} Year Lineage
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedMaster.techniques.map((t) => (
                    <span key={t} style={{
                      background: 'rgba(184,45,35,0.08)',
                      border: '1px solid rgba(184,45,35,0.2)',
                      color: '#b82d23',
                      fontSize: '9px',
                      fontWeight: 700,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      padding: '2px 8px',
                      borderRadius: '1px',
                    }}>
                      {t.replace(/-/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Registered Candidate Pool & Autonomous Extraction Overview */}
          <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '2px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <label style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#121212', margin: 0 }}>
                APPRENTICE CANDIDATE POOL · 応募徒弟名簿
              </label>
              <span style={{
                background: 'rgba(184,45,35,0.08)',
                border: '1px solid rgba(184,45,35,0.25)',
                color: '#b82d23',
                fontSize: '8px',
                fontWeight: 800,
                letterSpacing: '1px',
                padding: '2px 8px',
                borderRadius: '1px',
                textTransform: 'uppercase',
              }}>
                ✦ Gemini 2.5 Flash Resume Extraction
              </span>
            </div>

            <p style={{ fontSize: '12px', color: '#666', lineHeight: 1.6, marginBottom: '14px' }}>
              Gemini reads applicants&apos; resumes, extracts relevant skill keywords, and evaluates how their tactile foundations align with Master {selectedMaster.name}&apos;s workshop.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { name: 'Aarav Sharma', loc: 'Pune, India', spec: 'Metallurgy, Custom Forge, JLPT N3' },
                { name: 'Priya Nair', loc: 'Kochi, India', spec: 'Natural Indigo Vat Fermentation, JLPT N2' },
                { name: 'Rohan Deshmukh', loc: 'Nashik, India', spec: 'Ceramics, Kiln Thermodynamics, JLPT N4' },
                { name: 'Vikramaditya Rao', loc: 'Bengaluru, India', spec: 'Joinery & Micro Sashimono, JLPT N3' },
              ].map((c) => (
                <div key={c.name} style={{
                  padding: '9px 12px',
                  background: '#faf8f4',
                  border: '1px solid rgba(0,0,0,0.06)',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#121212' }}>{c.name}</span>
                    <span style={{ fontSize: '10px', color: '#777', marginLeft: '8px' }}>{c.loc}</span>
                  </div>
                  <span style={{ fontSize: '10px', color: '#856404', letterSpacing: '0.5px' }}>{c.spec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={runMatch}
          disabled={loading}
          style={{
            padding: '14px 44px',
            background: loading ? '#888' : '#121212',
            border: 'none',
            borderRadius: '2px',
            color: '#f5f2eb',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            marginBottom: '44px',
            transition: 'background 0.2s',
          }}
        >
          {loading ? 'Gemini 2.5 Flash Extracting Resumes & Kinship Matrix...' : 'Run Gemini Bilateral Kinship Analysis →'}
        </button>

        {/* Results */}
        {ran && results.length > 0 && (
          <div>
            <div style={{
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              color: '#7a756f',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <span>EVALUATION DOSSIERS — {selectedMaster.name} ({selectedMaster.craft})</span>
              <span style={{ color: '#b82d23' }}>✦ Evaluated by Gemini 2.5 Flash</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {results.map((r, i) => (
                <div
                  key={r.candidateId}
                  style={{
                    background: '#ffffff',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: '2px',
                    padding: '24px 28px',
                    display: 'grid',
                    gridTemplateColumns: '50px 1fr 140px',
                    gap: '28px',
                    alignItems: 'flex-start',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  }}
                >
                  {/* Rank */}
                  <div style={{ fontFamily: '"Cinzel", serif', fontSize: '28px', fontWeight: 400, color: i === 0 ? '#b82d23' : '#a09a8e', textAlign: 'center', paddingTop: '8px' }}>
                    0{i + 1}
                  </div>

                  {/* Info */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '18px', fontWeight: 700, color: '#121212' }}>
                        {r.candidate.name}
                      </span>
                      <span style={{ fontSize: '11px', color: '#b82d23', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700 }}>
                        {r.mode.replace(/-/g, ' ')}
                      </span>
                    </div>

                    <div style={{ fontSize: '11px', color: '#666', marginBottom: '12px' }}>
                      {r.candidate.region} · {r.candidate.yearsExperience}yr Experience · Japanese: <strong>{r.candidate.japaneseLevel}</strong> · SSW Visa: {r.candidate.sswEligible ? 'Eligible' : 'Standard'}
                    </div>

                    {/* Extracted Key Synergies */}
                    <div style={{ marginBottom: '14px' }}>
                      <div style={{ fontSize: '8px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#7a756f', marginBottom: '6px' }}>
                        Gemini Extracted Key Skill Synergies:
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {(r.reasons && r.reasons.length > 0 ? r.reasons : r.candidate.skills).map((s) => (
                          <span key={s} style={{
                            background: 'rgba(184,45,35,0.08)',
                            border: '1px solid rgba(184,45,35,0.2)',
                            color: '#b82d23',
                            fontSize: '9px',
                            fontWeight: 700,
                            letterSpacing: '0.8px',
                            padding: '3px 8px',
                            borderRadius: '1px',
                          }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Gemini Fit Explanation (Why they fit the job) */}
                    {r.fitExplanation && (
                      <div style={{
                        marginBottom: '16px',
                        background: 'rgba(212,175,55,0.08)',
                        borderLeft: '3px solid #856404',
                        padding: '12px 16px',
                        borderRadius: '1px',
                      }}>
                        <div style={{
                          fontSize: '9px',
                          fontWeight: 800,
                          letterSpacing: '1.5px',
                          textTransform: 'uppercase',
                          color: '#856404',
                          marginBottom: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}>
                          <span>✦</span> WHY THIS CANDIDATE FITS THE ATELIER (GEMINI EVALUATION)
                        </div>
                        <p style={{ fontSize: '12px', color: '#2a2723', lineHeight: 1.65, margin: 0 }}>
                          {r.fitExplanation}
                        </p>
                      </div>
                    )}

                    {/* Breakdown metrics */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                      {[
                        { label: 'Craft Aptitude', score: r.breakdown.skill },
                        { label: 'Language Ready', score: r.breakdown.language },
                        { label: 'Visa Clearance', score: r.breakdown.visa },
                        { label: 'Discipline Index', score: r.breakdown.temperament },
                      ].map((item) => (
                        <div key={item.label} style={{ background: '#faf8f4', border: '1px solid rgba(0,0,0,0.05)', padding: '8px 10px', borderRadius: '1px' }}>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: item.score >= 85 ? '#b82d23' : '#121212' }}>
                            {item.score}%
                          </div>
                          <div style={{ fontSize: '8px', color: '#7a756f', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '2px' }}>
                            {item.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total Kinship Index & Dialogue Action */}
                  <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(0,0,0,0.08)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontFamily: '"Cinzel", serif', fontSize: '38px', fontWeight: 400, color: '#b82d23', lineHeight: 1 }}>
                      {r.score}
                    </div>
                    <div style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '1.5px', color: '#7a756f', textTransform: 'uppercase', marginTop: '6px', marginBottom: '14px' }}>
                      Kinship Index
                    </div>
                    {onOpenDialogue && (
                      <button
                        type="button"
                        onClick={() => onOpenDialogue(selectedMaster)}
                        style={{
                          padding: '6px 12px',
                          background: 'transparent',
                          border: '1px solid #121212',
                          color: '#121212',
                          fontSize: '9px',
                          fontWeight: 700,
                          letterSpacing: '1px',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          borderRadius: '1px',
                        }}
                      >
                        Message Candidate →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Business Profile Page ──────────────────────────────── */
interface BusinessProfilePageProps {
  email: string;
  lang: Language;
  master?: Master;
  onUpdateMaster?: (master: Master) => void;
}

function BusinessProfilePage({ email, lang, master, onUpdateMaster }: BusinessProfilePageProps) {
  const currentMaster = master || SEED_MASTERS[0];

  const [companyName, setCompanyName] = useState(
    currentMaster.name ? `${currentMaster.name} Bladesmith Guild (工房)` : 'Yamato Bladesmith Guild'
  );
  const [contactName, setContactName] = useState(currentMaster.name || 'Keisuke Sakai');
  const [city, setCity] = useState(currentMaster.region || 'Sakai, Osaka, Japan');
  const [craftFocus, setCraftFocus] = useState(currentMaster.craft || 'Sakai Forged Cutlery & Bladesmithing');
  const [description, setDescription] = useState(
    currentMaster.bio ||
      '500-year cutlery forging lineage specializing in forge-welding (hizukuri) and water-quenching (yakiire). We require foreign apprentices dedicated to raw tacit metal craft.'
  );
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [audioURL, setAudioURL] = useState(currentMaster.audioDossierUrl || '');
  const [transcript, setTranscript] = useState(
    currentMaster.craftExplanation ||
      '「当工房では500年にわたり伝統鍛造刃物の身体知と火色判断の技法を継承しています。日々の鍛錬に情熱を持ち、金工の基礎と規律を備えた国際的な弟子を受け入れ、代々の技を継承します。」\n\n(English: "In our workshop, we have preserved the tacit techniques of hand-hammered cutlery forging and radiant temperature judgment for over 500 years. We seek an international apprentice possessing foundational metalwork discipline, hand-eye coordination, and enduring dedication to master our generational lineage.")'
  );
  const [providerBadge, setProviderBadge] = useState<string>('Wispr Flow API');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const localUrl = URL.createObjectURL(blob);
        setAudioURL(localUrl);

        // Auto transcribe with Wispr Flow API endpoint
        setTranscribing(true);
        try {
          const formData = new FormData();
          formData.append('audio', blob, 'craft_explanation.webm');
          formData.append('craftHint', craftFocus || 'Japanese traditional craft');

          const res = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
          });

          if (res.ok) {
            const data = await res.json();
            if (data.text) {
              setTranscript(data.text);
              setProviderBadge(data.provider || 'Wispr Flow API');
            }
          }
        } catch (err) {
          console.error('Transcription failed:', err);
        } finally {
          setTranscribing(false);
        }
      };
      mr.start();
      mediaRef.current = mr;
      setRecording(true);
    } catch {
      setTranscript(
        'Microphone access denied. Please allow microphone permissions or load sample dictation.'
      );
    }
  };

  const stopRecording = () => {
    if (mediaRef.current && mediaRef.current.state !== 'inactive') {
      mediaRef.current.stop();
      mediaRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    setRecording(false);
  };

  const loadSampleDictation = () => {
    setAudioURL('https://www.w3schools.com/html/horse.mp3');
    setTranscript(
      lang === 'en'
        ? '"We are Sakai Forged Cutlery Guild located in Sakai, Osaka. We preserve 500-year forge-welding (hizukuri) and water-quenching techniques. We seek dedicated international apprentices who possess tactile sensitivity, discipline, and endurance to master Japanese bladesmithing."'
        : '「私たちは大阪・堺の打刃物工房です。500年の鍛造・火造り・焼き入れ技術を守り、熱意ある国際的な弟子を受け入れ、代々の技法を身体知として正統に継承します。」'
    );
    setProviderBadge('Wispr Flow API');
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const updatedMaster: Master = {
        ...currentMaster,
        name: contactName || currentMaster.name,
        craft: craftFocus || currentMaster.craft,
        region: city || currentMaster.region,
        bio: description || currentMaster.bio,
        craftExplanation: transcript,
        audioDossierUrl: audioURL || currentMaster.audioDossierUrl,
      };

      const res = await fetch('/api/masters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMaster),
      });

      if (res.ok) {
        if (onUpdateMaster) onUpdateMaster(updatedMaster);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save master profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    background: '#ffffff',
    border: '1px solid rgba(0,0,0,0.14)',
    borderRadius: '2px',
    color: '#121212',
    fontSize: '13px',
    fontFamily: '"GT America Trial", sans-serif',
    outline: 'none',
    marginBottom: '20px',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#55555e',
    display: 'block',
    marginBottom: '8px',
  };

  return (
    <div
      style={{
        backgroundColor: '#ece7dc',
        minHeight: 'calc(100vh - 62px)',
        padding: '56px 32px 100px',
        fontFamily: '"GT America Trial", "Plus Jakarta Sans", sans-serif',
      }}
    >
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        <div
          style={{
            marginBottom: '40px',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            paddingBottom: '24px',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              color: '#b82d23',
              marginBottom: '10px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#b82d23',
                borderRadius: '1px',
              }}
            />
            WORKSHOP & GUILD REGISTRATION · 工房登録調書
          </div>
          <h1
            style={{
              fontFamily: '"Cinzel", serif',
              fontSize: '30px',
              fontWeight: 400,
              color: '#121212',
              margin: 0,
            }}
          >
            Master Studio Dossier
          </h1>
          <p
            style={{
              fontSize: '13px',
              color: '#666',
              marginTop: '8px',
              lineHeight: 1.6,
            }}
          >
            Accreditation credentials, craft specializations, and Wispr Flow voice dictation for
            bilateral apprentice matching via Gemini AI.
          </p>
        </div>

        {/* Guild Crest Emblem */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            marginBottom: '36px',
            padding: '24px 28px',
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '2px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
          }}
        >
          <div
            style={{
              width: '74px',
              height: '74px',
              borderRadius: '2px',
              border: '1.5px solid #b82d23',
              background: 'rgba(184,45,35,0.06)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#b82d23',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: '"Shippori Mincho", serif',
                fontSize: '26px',
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              閣
            </span>
            <span
              style={{
                fontSize: '7px',
                fontWeight: 800,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginTop: '4px',
              }}
            >
              GUILD
            </span>
          </div>
          <div>
            <div
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#121212',
                marginBottom: '4px',
                letterSpacing: '0.3px',
              }}
            >
              {companyName || 'Registered Craft Workshop'}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {city || 'Location Pending'} · Master: {contactName} · Registry: {email}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
          <div>
            <label style={labelStyle}>Company / Workshop Name · 工房名</label>
            <input
              style={inputStyle}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Yamato Bladesmith Guild"
            />
          </div>
          <div>
            <label style={labelStyle}>Guild Representative · 責任者</label>
            <input
              style={inputStyle}
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Hiroshi Sakai"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
          <div>
            <label style={labelStyle}>Prefecture & City · 所在地</label>
            <input
              style={inputStyle}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Sakai, Osaka, Japan"
            />
          </div>
          <div>
            <label style={labelStyle}>Primary Craft Taxonomy · 専門分野</label>
            <input
              style={inputStyle}
              value={craftFocus}
              onChange={(e) => setCraftFocus(e.target.value)}
              placeholder="Traditional Forging, Chisel Smithing"
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Workshop Statement & Philosophy · 工房理念</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe your studio's heritage lineage and philosophy..."
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        {/* Wispr Flow Audio Dictation Console */}
        <div
          style={{
            marginBottom: '36px',
            padding: '28px',
            background: '#ffffff',
            border: '1px solid #e2ddd4',
            borderRadius: '2px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                fontSize: '9px',
                fontWeight: 800,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#121212',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  backgroundColor: recording ? '#b82d23' : '#856404',
                  borderRadius: '50%',
                  boxShadow: recording ? '0 0 8px #b82d23' : 'none',
                }}
              />
              MASTER ORAL STATEMENT DICTATION · 口伝音声記録 (WISPR FLOW API)
            </div>
            <span
              style={{
                fontSize: '9px',
                color: '#856404',
                letterSpacing: '1px',
                padding: '2px 8px',
                border: '1px solid rgba(133,100,4,0.3)',
                borderRadius: '2px',
                textTransform: 'uppercase',
                background: 'rgba(212,175,55,0.08)',
              }}
            >
              Engine: {providerBadge}
            </span>
          </div>

          <p
            style={{
              fontSize: '12px',
              color: '#555',
              lineHeight: 1.6,
              marginBottom: '20px',
            }}
          >
            Speak freely about your atelier&apos;s daily craft practice, tacit techniques, and what
            tactile aptitude you expect from apprentices. Wispr Flow transcribes your voice into
            editable text, which Gemini AI directly uses to compare candidate resumes for the best
            fit.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              marginBottom: '20px',
              flexWrap: 'wrap',
            }}
          >
            {!recording ? (
              <button
                type="button"
                onClick={startRecording}
                style={{
                  padding: '11px 24px',
                  background: '#b82d23',
                  border: 'none',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  borderRadius: '2px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>●</span> Start Audio Recording
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                style={{
                  padding: '11px 24px',
                  background: 'rgba(184,45,35,0.25)',
                  border: '1px solid #b82d23',
                  color: '#ff6b6b',
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  borderRadius: '2px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>■</span> Stop Dictation & Transcribe
              </button>
            )}

            <button
              type="button"
              onClick={loadSampleDictation}
              style={{
                padding: '11px 18px',
                background: 'rgba(0,0,0,0.04)',
                border: '1px solid rgba(0,0,0,0.14)',
                color: '#333',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: 'inherit',
                borderRadius: '2px',
              }}
            >
              + Load Studio Sample Voice Dictation
            </button>

            {audioURL && !recording && (
              <audio src={audioURL} controls style={{ height: '36px', maxWidth: '280px' }} />
            )}
          </div>

          {transcribing && (
            <div
              style={{
                padding: '14px 18px',
                background: 'rgba(212,175,55,0.08)',
                border: '1px solid rgba(133,100,4,0.3)',
                borderRadius: '2px',
                color: '#856404',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  border: '2px solid #856404',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              Transcribing Master Voice via Wispr Flow API...
            </div>
          )}

          {/* Fully Editable Transcribed Craft Textarea */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <label
                style={{
                  ...labelStyle,
                  marginBottom: 0,
                  color: '#856404',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>✦</span> Transcribed Craft Lineage & Tacit Practice · 口伝・技法伝承詳細 (Owner Editable)
              </label>
              <span style={{ fontSize: '9px', color: '#7a756f', letterSpacing: '1px' }}>
                Used for Gemini Best Fit Analysis
              </span>
            </div>

            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={5}
              placeholder="Your transcribed craft words appear here. You can freely edit, polish, or add specific apprentice requirements..."
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#faf8f4',
                border: '1px solid rgba(0,0,0,0.18)',
                borderRadius: '2px',
                color: '#121212',
                fontSize: '13px',
                lineHeight: 1.75,
                fontFamily: '"GT America Trial", sans-serif',
                outline: 'none',
                resize: 'vertical',
                boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.04)',
              }}
            />
            <div
              style={{
                fontSize: '10px',
                color: '#7a756f',
                marginTop: '6px',
                lineHeight: 1.5,
              }}
            >
              💡 This text is saved directly to your master profile. When candidate apprentices apply,
              Gemini AI compares their resumes against these exact words to determine the kinship fit score and explanation.
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={saving}
          style={{
            padding: '14px 38px',
            background: saved ? '#2a6344' : '#121212',
            border: 'none',
            color: '#f5f2eb',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            cursor: saving ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            borderRadius: '2px',
            transition: 'background 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {saving
            ? 'Committing Dossier to Registry...'
            : saved
            ? '● Studio Dossier Certified & Saved · Kinship Profile Updated'
            : 'Save Workshop Dossier →'}
        </button>
      </div>
    </div>
  );
}

/* ─── Business App Shell ─────────────────────────────────── */
interface BusinessAppProps {
  email: string;
  onLogout: () => void;
}

export function BusinessApp({ email, onLogout }: BusinessAppProps) {
  const [tab, setTab] = useState<BusinessTab>('home');
  const [lang, setLang] = useState<Language>('en');
  const [masters, setMasters] = useState<Master[]>(SEED_MASTERS);
  const [activeMaster, setActiveMaster] = useState<Master>(SEED_MASTERS[0]);
  const [viewingManual, setViewingManual] = useState<Master | null>(null);
  const [interviewingMaster, setInterviewingMaster] = useState<Master | null>(null);
  const [messagingMaster, setMessagingMaster] = useState<Master | null>(null);

  const handleUpdateMaster = (updatedMaster: Master) => {
    setMasters((prev) =>
      prev.map((m) => (m.id === updatedMaster.id ? updatedMaster : m))
    );
    if (activeMaster.id === updatedMaster.id) {
      setActiveMaster(updatedMaster);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--gallery-bg)' }}>
      <BusinessNavbar
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
            hideOtherMasters={true}
          />
        </>
      )}
      {tab === 'matching' && <MatchingEnginePage masters={masters} lang={lang} />}
      {tab === 'profile' && (
        <BusinessProfilePage
          email={email}
          lang={lang}
          master={activeMaster}
          onUpdateMaster={handleUpdateMaster}
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
    </div>
  );
}

