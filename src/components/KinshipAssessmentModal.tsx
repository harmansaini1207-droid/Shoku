'use client';

import React, { useState, useEffect } from 'react';
import { Master } from '@/lib/types';
import { Language } from '@/lib/i18n';

interface KinshipAssessmentModalProps {
  master: Master | null;
  candidateProfile?: {
    name?: string;
    skills?: string | string[];
    japaneseLevel?: string;
    bio?: string;
    city?: string;
  };
  onClose: () => void;
  onOpenMessaging: (master: Master) => void;
  lang: Language;
}

export function KinshipAssessmentModal({
  master,
  candidateProfile,
  onClose,
  onOpenMessaging,
  lang,
}: KinshipAssessmentModalProps) {
  const [loading, setLoading] = useState(true);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!master) return;
    let cancelled = false;

    async function evaluate() {
      setLoading(true);
      setError(null);

      // Default candidate data if profile is empty
      const candidateData = {
        name: candidateProfile?.name || 'Aarav Sharma',
        skills: candidateProfile?.skills
          ? (Array.isArray(candidateProfile.skills) ? candidateProfile.skills : candidateProfile.skills.split(',').map(s => s.trim()))
          : ['forge welding', 'TIG welding', 'heat treatment', 'steel shaping'],
        japaneseLevel: candidateProfile?.japaneseLevel || 'N3',
        bio: candidateProfile?.bio || '5 years practical forge welding and steel shaping experience. Dedicated to traditional hand-forged cutlery lineage.',
        city: candidateProfile?.city || 'Mumbai, India',
      };

      try {
        const res = await fetch('/api/matching/evaluate-candidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            masterId: master?.id,
            candidate: candidateData,
          }),
        });

        if (!res.ok) throw new Error('Evaluation request failed');
        const data = await res.json();
        if (!cancelled) {
          setEvaluation(data.evaluation);
          setLoading(false);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || 'Kinship assessment failed');
          setLoading(false);
        }
      }
    }

    evaluate();
    return () => {
      cancelled = true;
    };
  }, [master, candidateProfile]);

  if (!master) return null;

  const craftExplanation =
    master.craftExplanation ||
    `Our atelier specializes in ${master.craft} in ${master.region}. We practice ${(master.techniques || []).join(
      ', '
    )}. Apprentices must possess steady tactile discipline, patience for repetitive refinement, and respect for generational tools.`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: '"GT America Trial", "Plus Jakarta Sans", sans-serif',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '90vh',
          backgroundColor: '#faf8f4',
          border: '1px solid #dcd7cc',
          borderRadius: '3px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          color: '#1a1a1a',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 28px',
            borderBottom: '1px solid #e2ddd4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f3efe8',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '2px',
                border: '1.5px solid #b82d23',
                background: 'rgba(184,45,35,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#b82d23',
                fontSize: '14px',
                fontWeight: 700,
              }}
            >
              ✦
            </div>
            <div>
              <div
                style={{
                  fontSize: '9px',
                  fontWeight: 800,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#b82d23',
                }}
              >
                BILATERAL KINSHIP FIT EVALUATION · 徒弟適性診断
              </div>
              <h2
                style={{
                  fontFamily: '"Cinzel", serif',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#121212',
                  margin: '2px 0 0',
                }}
              >
                {master.name} ({master.nameJa})
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#666',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '28px' }}>
          {/* Master's Spoken Craft Dossier */}
          <div
            style={{
              padding: '16px 20px',
              background: '#ffffff',
              border: '1px solid #e2ddd4',
              borderRadius: '2px',
              marginBottom: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <div
                style={{
                  fontSize: '9px',
                  fontWeight: 800,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#b82d23',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>🎙</span> MASTER'S SPOKEN CRAFT CRITERIA (WISPR FLOW TRANSCRIBED)
              </div>
              <span
                style={{
                  fontSize: '9px',
                  color: '#777',
                  letterSpacing: '1px',
                }}
              >
                {master.region} · {master.craft}
              </span>
            </div>
            <p
              style={{
                fontSize: '12px',
                color: '#333',
                lineHeight: 1.7,
                margin: 0,
                fontStyle: 'italic',
              }}
            >
              "{craftExplanation}"
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div
                style={{
                  display: 'inline-block',
                  width: '36px',
                  height: '36px',
                  border: '2px solid rgba(184,45,35,0.2)',
                  borderTopColor: '#b82d23',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  marginBottom: '16px',
                }}
              />
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#b82d23',
                  marginBottom: '6px',
                }}
              >
                Gemini 2.5 Flash Kinship Synthesis...
              </div>
              <div style={{ fontSize: '11px', color: '#666' }}>
                Comparing candidate resume with master's spoken tacit craft requirements
              </div>
            </div>
          ) : error ? (
            <div
              style={{
                padding: '16px',
                background: 'rgba(184,45,35,0.08)',
                border: '1px solid #b82d23',
                color: '#b82d23',
                fontSize: '12px',
              }}
            >
              Evaluation error: {error}
            </div>
          ) : evaluation ? (
            <div>
              {/* Score & Verdict Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  marginBottom: '24px',
                  padding: '20px',
                  background: '#ffffff',
                  border: '1px solid #e2ddd4',
                  borderRadius: '2px',
                }}
              >
                <div
                  style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '50%',
                    border: '2px solid #b82d23',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(184,45,35,0.06)',
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: '22px',
                      fontWeight: 800,
                      color: '#b82d23',
                      fontFamily: '"Cinzel", serif',
                      lineHeight: 1,
                    }}
                  >
                    {evaluation.score}
                  </span>
                  <span
                    style={{
                      fontSize: '8px',
                      letterSpacing: '1px',
                      color: '#666',
                      textTransform: 'uppercase',
                      marginTop: '3px',
                    }}
                  >
                    FIT INDEX
                  </span>
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '6px',
                    }}
                  >
                    <span
                      style={{
                        padding: '3px 8px',
                        background: '#2a6344',
                        color: '#ffffff',
                        fontSize: '9px',
                        fontWeight: 800,
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        borderRadius: '2px',
                      }}
                    >
                      HIGH ATELIER COMPATIBILITY
                    </span>
                    <span
                      style={{
                        fontSize: '10px',
                        color: '#666',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                      }}
                    >
                      Mode: {evaluation.recommendedMode}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#121212',
                      lineHeight: 1.4,
                    }}
                  >
                    Applicant {candidateProfile?.name || 'Aarav Sharma'} demonstrates kinematic
                    aptitude for Master {master.name}'s lineage.
                  </div>
                </div>
              </div>

              {/* Fit Explanation Highlight */}
              <div
                style={{
                  padding: '20px',
                  background: '#fffdfa',
                  border: '1.5px solid #d4af37',
                  borderRadius: '2px',
                  marginBottom: '24px',
                  boxShadow: '0 4px 14px rgba(212,175,55,0.08)',
                }}
              >
                <div
                  style={{
                    fontSize: '9px',
                    fontWeight: 800,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: '#8a6d1a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '8px',
                  }}
                >
                  <span>✦</span> WHY YOUR RESUME FITS THIS MASTER'S ATELIER (GEMINI EVALUATION)
                </div>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#121212',
                    lineHeight: 1.75,
                    margin: 0,
                  }}
                >
                  {evaluation.fitExplanation}
                </p>
              </div>

              {/* Matching Skills */}
              {evaluation.keyMatches && evaluation.keyMatches.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <div
                    style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      color: '#666',
                      marginBottom: '10px',
                    }}
                  >
                    Direct Craft Skill Resonances · 技能照合
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {evaluation.keyMatches.map((skill: string) => (
                      <span
                        key={skill}
                        style={{
                          padding: '5px 12px',
                          background: '#f3efe8',
                          border: '1px solid #dcd7cc',
                          color: '#121212',
                          fontSize: '11px',
                          fontWeight: 600,
                          borderRadius: '2px',
                        }}
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tactile Strengths */}
              {evaluation.tactileStrengths && (
                <div
                  style={{
                    fontSize: '12px',
                    color: '#444',
                    lineHeight: 1.6,
                    padding: '12px 16px',
                    background: '#ffffff',
                    border: '1px solid #e2ddd4',
                    borderRadius: '2px',
                    marginBottom: '28px',
                  }}
                >
                  <strong style={{ color: '#b82d23' }}>Tactile Aptitude: </strong>
                  {evaluation.tactileStrengths}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <button
                  onClick={() => {
                    onClose();
                    onOpenMessaging(master);
                  }}
                  style={{
                    flex: 1,
                    padding: '14px 24px',
                    background: '#b82d23',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    borderRadius: '2px',
                  }}
                >
                  Direct Message Master {master.name} →
                </button>
                <button
                  onClick={onClose}
                  style={{
                    padding: '14px 22px',
                    background: '#ffffff',
                    border: '1px solid #dcd7cc',
                    color: '#333',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    borderRadius: '2px',
                  }}
                >
                  Close Dossier
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

