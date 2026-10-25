'use client';

import React, { useState, useEffect } from 'react';
import { Master, CraftManual } from '@/lib/types';
import { Language } from '@/lib/i18n';

interface CraftManualModalProps {
  master: Master | null;
  onClose: () => void;
  lang: Language;
}

export const CraftManualModal: React.FC<CraftManualModalProps> = ({ master, onClose, lang }) => {
  const [manual, setManual] = useState<CraftManual | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!master) {
      setManual(null);
      return;
    }

    setLoading(true);
    fetch(`/api/manuals?masterId=${master.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.manual) {
          setManual(data.manual);
        }
      })
      .catch(() => {
        // Fallback synthetic manual
      })
      .finally(() => {
        setLoading(false);
      });
  }, [master]);

  if (!master) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(12, 13, 16, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '920px',
          maxHeight: '90vh',
          backgroundColor: '#faf8f4',
          border: '1px solid #dcd7cc',
          boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: '"GT America Trial", "Plus Jakarta Sans", sans-serif',
          color: '#1a1a1a',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div
          style={{
            padding: '20px 32px',
            borderBottom: '1px solid #e2ddd4',
            backgroundColor: '#f3efe8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                border: '1.5px solid #1a1a1a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontFamily: '"Shippori Mincho", serif',
                fontWeight: 700,
                color: '#b82d23',
              }}
            >
              印
            </div>
            <div>
              <div
                style={{
                  fontSize: '9px',
                  fontWeight: 800,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#7a756f',
                }}
              >
                SHOKU OFFICIAL CRAFT SUCCESSION ARCHIVE · 伝承規範
              </div>
              <div
                style={{
                  fontFamily: '"Cinzel", "Times New Roman", serif',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#121212',
                  letterSpacing: '0.5px',
                }}
              >
                {master.name} — {master.craft}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={() => window.print()}
              style={{
                padding: '6px 14px',
                border: '1px solid #1a1a1a',
                background: 'transparent',
                fontFamily: 'inherit',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Print Dossier
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '6px 14px',
                border: 'none',
                background: '#121212',
                color: '#fff',
                fontFamily: 'inherit',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Close ✕
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div style={{ overflowY: 'auto', padding: '36px 40px', flex: 1 }}>
          {loading ? (
            <div style={{ padding: '60px 0', textAlign: 'center', color: '#888' }}>
              <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Accessing Tacit Knowledge Archive...
              </div>
            </div>
          ) : (
            <div>
              {/* Top Overview Section */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 220px',
                  gap: '32px',
                  paddingBottom: '28px',
                  borderBottom: '1px solid #e8e3d8',
                  marginBottom: '28px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      color: '#b82d23',
                      marginBottom: '8px',
                    }}
                  >
                    TACIT CONTEXT & CODIFICATION PHILOSOPHY
                  </div>
                  <p style={{ fontSize: '14px', lineHeight: 1.75, color: '#2c2b29', margin: 0 }}>
                    {manual?.overview ||
                      `This structured manual formalizes the tacit, sensory-driven master method of ${master.name} (${master.nameJa}), representing ${master.yearsExperience} years of dedicated practice in ${master.craft} within ${master.region}. It captures the unwritten tactile cues, acoustic markers, and micro-decisions necessary to train apprentice talent without loss of heritage fidelity.`}
                  </p>
                  {manual?.overviewJa && (
                    <p
                      style={{
                        fontFamily: '"Shippori Mincho", serif',
                        fontSize: '13px',
                        lineHeight: 1.8,
                        color: '#666',
                        marginTop: '12px',
                        marginBottom: 0,
                      }}
                    >
                      {manual.overviewJa}
                    </p>
                  )}
                </div>

                <div
                  style={{
                    backgroundColor: '#f3efe8',
                    padding: '16px',
                    border: '1px solid #e0dbce',
                    fontSize: '11px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div>
                    <span style={{ color: '#888', display: 'block', textTransform: 'uppercase', fontSize: '8px', letterSpacing: '1px' }}>
                      Region Lineage
                    </span>
                    <strong>{master.regionJa} — {master.region}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#888', display: 'block', textTransform: 'uppercase', fontSize: '8px', letterSpacing: '1px' }}>
                      Experience Lineage
                    </span>
                    <strong>{master.yearsExperience} Years Mastery</strong>
                  </div>
                  <div>
                    <span style={{ color: '#888', display: 'block', textTransform: 'uppercase', fontSize: '8px', letterSpacing: '1px' }}>
                      Succession Status
                    </span>
                    <strong style={{ color: master.noSuccessor ? '#b82d23' : '#2b5e30' }}>
                      {master.noSuccessor ? 'Urgent / No Successor' : 'Successor Enrolled'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Master Tools Section */}
              <div style={{ marginBottom: '32px' }}>
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: '#121212',
                    marginBottom: '14px',
                  }}
                >
                  REQUIRED MASTER INSTRUMENTS & RAW MATERIALS · 使用道具
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px' }}>
                  {(manual?.tools || [
                    'Master grade workshop hand tools',
                    'Traditional raw materials & natural binders',
                    'Micro-climate calibration indicators',
                    'High-precision inspection benchmark gauges',
                  ]).map((t, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '10px 14px',
                        backgroundColor: '#fff',
                        border: '1px solid #e8e3d8',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span style={{ color: '#b82d23', fontWeight: 800, fontSize: '10px' }}>0{i + 1}.</span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Techniques & Tacit Sensory Cues */}
              <div style={{ marginBottom: '32px' }}>
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: '#121212',
                    marginBottom: '16px',
                  }}
                >
                  CORE TACIT TECHNIQUES & SENSORY CALIBRATIONS · 暗黙知伝承手順
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {(manual?.techniques || [
                    {
                      id: 'technique-1',
                      name: 'Thermal & Tactile Rhythm Discipline',
                      nameJa: '温度と触感の同期鍛錬',
                      steps: [
                        'Observe material color transition under natural indirect daylight.',
                        'Position body weight above the center of strike without wrist flexion.',
                        'Perform continuous fluid stroke sequence maintaining constant surface contact.',
                      ],
                      tacitCues: [
                        'Feel subtle resistance relaxation when critical temperature reached.',
                        'Listen for high-frequency clear ping denoting uniform crystalline density.',
                      ],
                      commonMistakes: [
                        'Applying excessive localized pressure rather than uniform sweep.',
                        'Interpreting surface luster under artificial LED rather than daylight.',
                      ],
                      qualityCheck: 'Fingertip grain inspection: must exhibit zero micro-ridges across edge boundary.',
                    },
                  ]).map((tech, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: '#fff',
                        border: '1px solid #ded9cd',
                        padding: '24px 28px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#b82d23' }}>STEP {i + 1}</span>
                          <h4 style={{ fontFamily: '"Cinzel", serif', fontSize: '16px', margin: 0, fontWeight: 700 }}>
                            {tech.name}
                          </h4>
                        </div>
                        {tech.nameJa && (
                          <span style={{ fontFamily: '"Shippori Mincho", serif', fontSize: '13px', color: '#888' }}>
                            {tech.nameJa}
                          </span>
                        )}
                      </div>

                      {/* Execution Steps */}
                      <div style={{ marginBottom: '14px' }}>
                        <div style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#666', marginBottom: '6px' }}>
                          Physical Execution Steps
                        </div>
                        <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', lineHeight: 1.6, color: '#333' }}>
                          {tech.steps.map((st, idx) => (
                            <li key={idx} style={{ marginBottom: '4px' }}>{st}</li>
                          ))}
                        </ol>
                      </div>

                      {/* Tacit Sensory Cues (The secret sauce of Japanese craftsmanship) */}
                      <div
                        style={{
                          backgroundColor: '#faf6ee',
                          borderLeft: '3px solid #b82d23',
                          padding: '12px 16px',
                          marginBottom: '14px',
                        }}
                      >
                        <div style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#b82d23', marginBottom: '6px' }}>
                          ★ Tacit Sensory Cues (Never Written in Conventional Textbooks)
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', lineHeight: 1.6, color: '#2c2b29' }}>
                          {tech.tacitCues.map((cue, idx) => (
                            <li key={idx} style={{ marginBottom: '4px' }}>{cue}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Common Traps & Quality Benchmark */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '11px' }}>
                        <div style={{ background: '#fdf5f5', padding: '10px 12px', border: '1px solid #f4dcd9' }}>
                          <strong style={{ color: '#b82d23', display: 'block', marginBottom: '4px' }}>
                            ⚠ Common Apprentice Traps:
                          </strong>
                          {tech.commonMistakes.join(', ')}
                        </div>
                        <div style={{ background: '#f5f9f6', padding: '10px 12px', border: '1px solid #dcece0' }}>
                          <strong style={{ color: '#2b5e30', display: 'block', marginBottom: '4px' }}>
                            ✓ Master Quality Inspection:
                          </strong>
                          {tech.qualityCheck}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Heritage Trust & Lineage Notes */}
              <div
                style={{
                  backgroundColor: '#f3efe8',
                  border: '1px solid #e0dbce',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '20px',
                }}
              >
                <div>
                  <div style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#555', marginBottom: '4px' }}>
                    INTELLECTUAL HERITAGE TRUST SEAL
                  </div>
                  <div style={{ fontSize: '12px', color: '#444' }}>
                    {manual?.heritageNotes ||
                      'Preserved under bilateral Japanese-Indian craft succession accords. Lineage rights retained by master studio.'}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: '"Shippori Mincho", serif',
                    border: '1.5px solid #b82d23',
                    color: '#b82d23',
                    padding: '8px 12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '2px',
                    textAlign: 'center',
                    flexShrink: 0,
                  }}
                >
                  文化庁公認準拠
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
