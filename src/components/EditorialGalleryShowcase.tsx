'use client';

import React, { useState } from 'react';
import { Master } from '@/lib/types';
import { Language, I18N_DICTIONARY } from '@/lib/i18n';

interface EditorialGalleryShowcaseProps {
  masters: Master[];
  activeMaster: Master;
  onSelectMaster: (master: Master) => void;
  onViewManual: () => void;
  onStartInterview: () => void;
  onMessageMaster?: () => void;
  lang: Language;
  hideOtherMasters?: boolean;
}

/* ── per-master craft taxonomy ── */
const CRAFT_IMAGES: Record<string, { bg: string; label: string; jaLabel: string; kanji: string }> = {
  'm-sakai-keisuke': { bg: '#1a1209', label: 'Metalwork', jaLabel: '鍛冶', kanji: '鍛' },
  'm-mino-chiyo': { bg: '#e8ede8', label: 'Paper', jaLabel: '和紙', kanji: '紙' },
  'm-arimatsu-hiroshi': { bg: '#0d1a2e', label: 'Textiles', jaLabel: '染織', kanji: '染' },
  'm-bizen-kenji': { bg: '#1c0a03', label: 'Ceramics', jaLabel: '陶芸', kanji: '陶' },
  'm-edo-takashi': { bg: '#0a1020', label: 'Crystal', jaLabel: '切子', kanji: '硝' },
  'm-kyoto-nobuo': { bg: '#1a1205', label: 'Woodwork', jaLabel: '木工', kanji: '木' },
};

/* craft-specific local Japanese craft images */
const CARD_PHOTOS: Record<string, string> = {
  'm-sakai-keisuke': '/images/master-sakai.jpg',
  'm-mino-chiyo': '/images/master-mino.jpg',
  'm-arimatsu-hiroshi': '/images/master-arimatsu.jpg',
  'm-bizen-kenji': '/images/master-bizen.jpg',
  'm-edo-takashi': '/images/master-edo.jpg',
  'm-kyoto-nobuo': '/images/master-kyoto.jpg',
};

const FEATURED_PHOTO = '/images/master-sakai.jpg';

/* Traditional Japanese Hanko / Seal mark icon */
function HankoSealIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.4" />
      <path d="M7 8h10M12 8v8M8 16h8" strokeWidth="1.3" />
    </svg>
  );
}

/* Section-header label matching Red Collar's "NEWEST NOMINEES →" style */
function SectionTag({ pre, highlight, arrow = true }: { pre: string; highlight: string; arrow?: boolean }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontFamily: '"GT America Trial", "Plus Jakarta Sans", sans-serif',
      fontSize: '12px',
      fontWeight: 700,
      letterSpacing: '2.5px',
      textTransform: 'uppercase',
      color: '#121212',
      marginBottom: '48px',
    }}>
      <span>{pre}</span>
      <span style={{
        backgroundColor: '#d8d2ea',
        padding: '2px 10px',
        borderRadius: '2px',
        color: '#121212',
        fontWeight: 800,
      }}>
        {highlight}
      </span>
      {arrow && <span style={{ marginLeft: '2px' }}>→</span>}
    </div>
  );
}

/* Thin separator rule */
function Rule() {
  return <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', margin: '72px 0' }} />;
}

export const EditorialGalleryShowcase: React.FC<EditorialGalleryShowcaseProps> = ({
  masters,
  activeMaster,
  onSelectMaster,
  onViewManual,
  onStartInterview,
  onMessageMaster,
  lang,
  hideOtherMasters = false,
}) => {
  const t = I18N_DICTIONARY[lang];
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const featured = activeMaster;
  const nominees = masters.filter((m) => m.id !== featured.id);

  return (
    <div style={{
      backgroundColor: '#ece8df',
      minHeight: '100vh',
      fontFamily: '"GT America Trial", "Plus Jakarta Sans", sans-serif',
    }}>

      {/* ══════════════════════════════════════════
          FEATURED MASTER OF THE DAY  (Red Collar WoTD style)
          ══════════════════════════════════════════ */}
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '80px 40px 0' }}>

        {/* Top dossier row: stamp | name + meta | description */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          gap: '48px',
          alignItems: 'flex-start',
          marginBottom: '52px',
        }}>

          {/* CSSDA-style circular stamp */}
          <div style={{
            width: '110px',
            height: '110px',
            borderRadius: '50%',
            border: '1.5px solid #121212',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '8px',
            flexShrink: 0,
            background: 'rgba(255,255,255,0.4)',
          }}>
            <div style={{ fontSize: '7.5px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', lineHeight: 1.2 }}>
              CRAFT MASTER
            </div>
            <img
              src="/images/shoku-icon.png"
              alt="SHOKU"
              style={{ width: '38px', height: '38px', objectFit: 'contain', margin: '3px 0', display: 'block' }}
            />
            <div style={{ fontSize: '7.5px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', lineHeight: 1.2 }}>
              EST. 2026
            </div>
          </div>

          {/* Name + craft + region */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <h2 style={{
                fontFamily: '"Cinzel", "Times New Roman", serif',
                fontSize: 'clamp(26px, 3.5vw, 38px)',
                fontWeight: 400,
                color: '#121212',
                letterSpacing: '0.5px',
                margin: 0,
              }}>
                {featured.name}
              </h2>
              {lang === 'ja' && (
                <span style={{
                  fontFamily: '"Shippori Mincho", serif',
                  fontSize: '20px',
                  color: '#888',
                  fontWeight: 400,
                }}>
                  {featured.nameJa}
                </span>
              )}
            </div>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: '#5a5a5e',
              marginBottom: '4px',
            }}>
              {featured.craft}
            </div>
            <div style={{ fontSize: '11px', color: '#888', letterSpacing: '0.5px' }}>
              {lang === 'ja' ? `${featured.regionJa} — ${featured.region}` : featured.region}
            </div>
          </div>

          {/* Right: description (like Red Collar site) */}
          <div style={{ maxWidth: '320px' }}>
            <p style={{
              fontSize: '14px',
              color: '#444',
              lineHeight: 1.75,
              fontStyle: 'italic',
              margin: 0,
            }}>
              {lang === 'ja' ? featured.bioJa : featured.bio}
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
              <button
                onClick={onViewManual}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: '#121212',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                  fontFamily: 'inherit',
                }}
              >
                Read Manual →
              </button>
              <button
                onClick={onStartInterview}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: '#6b5e90',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Interview →
              </button>
              {onMessageMaster && (
                <button
                  onClick={onMessageMaster}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    color: '#b82d23',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                  }}
                >
                  Inquire / Message →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Large centered preview image (Red Collar WoTD centrepiece) ── */}
        <div style={{
          width: '100%',
          aspectRatio: '16/7',
          overflow: 'hidden',
          backgroundColor: '#1a1209',
          position: 'relative',
        }}>
          <img
            src={FEATURED_PHOTO}
            alt={`${featured.name} — ${featured.craft}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 30%',
              display: 'block',
              filter: 'sepia(0.12) contrast(1.05)',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          {/* Subtle date badge overlay */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '24px',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.65)',
          }}>
            AWARDED 2026 OCT 24
          </div>
        </div>

        {/* ── Living Heritage Craft Appraisal Dimensions ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          backgroundColor: '#e2ddd4',
          marginTop: 0,
          padding: '32px 40px',
          gap: '0',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}>
          {[
            { label: 'TACTILE SENSORY', kanji: '触知伝承', score: '9.8', sub: 'SCALE I' },
            { label: 'THERMAL INTUITION', kanji: '熱感知度', score: '9.4', sub: 'SCALE II' },
            { label: 'LINEAGE SUCCESSION', kanji: '継承緊急度', score: '9.6', sub: 'GRADE A' },
            { label: "OVERALL MASTERY", kanji: '総合格付', score: (featured.yearsExperience / 6).toFixed(2), sub: 'HERITAGE RATIO', big: true },
          ].map((item, i) => (
            <div key={i} style={{
              textAlign: 'center',
              borderLeft: i > 0 ? '1px solid rgba(0,0,0,0.1)' : 'none',
              padding: '0 24px',
            }}>
              {lang === 'ja' && (
                <div style={{
                  fontFamily: '"Shippori Mincho", serif',
                  fontSize: '11px',
                  color: '#8c827a',
                  letterSpacing: '2px',
                  marginBottom: '6px',
                }}>
                  {item.kanji}
                </div>
              )}
              <div style={{
                fontFamily: '"Cinzel", serif',
                fontSize: item.big ? '42px' : '11px',
                fontWeight: item.big ? 400 : 700,
                letterSpacing: item.big ? '0' : '2px',
                color: '#121212',
                textTransform: 'uppercase',
                lineHeight: 1,
                marginBottom: item.big ? '8px' : '6px',
              }}>
                {item.big ? item.score : item.label}
              </div>
              <div style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '1.5px',
                color: '#666',
                textTransform: 'uppercase',
              }}>
                {item.big ? item.label : (
                  <span>
                    <strong style={{ color: '#121212', fontSize: '18px', fontFamily: '"Cinzel", serif', fontWeight: 400 }}>
                      {item.score}
                    </strong>
                    {' '}
                    <span style={{ fontSize: '9px', color: '#888' }}>{item.sub}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Official Lineage & Guild Accreditation Strip ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '20px 32px',
          backgroundColor: '#dad4c7',
          fontSize: '10px',
          letterSpacing: '1.8px',
          textTransform: 'uppercase',
          color: '#555',
          fontFamily: '"GT America Trial", "Plus Jakarta Sans", sans-serif',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              width: '8px', height: '8px', backgroundColor: '#b82d23', borderRadius: '1px', display: 'inline-block'
            }} />
            <strong style={{ color: '#121212' }}>METI DESIGNATED LIVING CRAFT</strong>
            <span>·</span>
            <span>{lang === 'ja' ? '経済産業大臣指定伝統的工芸品' : 'Designated Traditional Craft Heritage'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span>GUILD ID: <strong>SHOKU-2026-JP</strong></span>
            <span>·</span>
            <span style={{ color: featured.noSuccessor ? '#b82d23' : '#121212', fontWeight: 700 }}>
              {featured.noSuccessor
                ? (lang === 'ja' ? '● 後継者急募' : '● PRIORITY SUCCESSION ACTIVE · SUCCESSOR NEEDED')
                : '● ACTIVE MENTORSHIP LINEAGE'}
            </span>
          </div>
        </div>
      </div>

      {!hideOtherMasters && (
        <>
          <Rule />

          {/* ══════════════════════════════════════════
              ACTIVE MASTERS grid  (Red Collar nominees)
              ══════════════════════════════════════════ */}
          <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 40px 80px' }}>
        <SectionTag pre="ACTIVE MASTERS" highlight="NOMINEES" />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '32px 28px',
        }}>
          {masters.map((master) => {
            const isActive = master.id === activeMaster.id;
            const isHovered = hoveredId === master.id;
            const photo = CARD_PHOTOS[master.id] || '/images/master-sakai.jpg';

            return (
              <div
                key={master.id}
                onClick={() => onSelectMaster(master)}
                onMouseEnter={() => setHoveredId(master.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  cursor: 'pointer',
                  outline: isActive ? '2px solid #121212' : 'none',
                  outlineOffset: '3px',
                  transition: 'outline 0.15s ease',
                }}
              >
                {/* Thumbnail image */}
                <div style={{
                  width: '100%',
                  aspectRatio: '4/3',
                  overflow: 'hidden',
                  backgroundColor: CRAFT_IMAGES[master.id]?.bg ?? '#111',
                  position: 'relative',
                }}>
                  {photo && (
                    <img
                      src={photo}
                      alt={master.craft}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        filter: 'sepia(0.08) contrast(1.04)',
                        transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                        transition: 'transform 0.5s ease',
                      }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                  {master.noSuccessor && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: '#b82d23',
                      color: '#fff',
                      fontSize: '8px',
                      fontWeight: 800,
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      padding: '3px 7px',
                    }}>
                      後継者不在
                    </div>
                  )}
                </div>

                {/* Card meta — minimal, Red Collar style */}
                <div style={{ paddingTop: '16px' }}>
                  <h3 style={{
                    fontFamily: '"GT America Trial", "Plus Jakarta Sans", sans-serif',
                    fontSize: '13px',
                    fontWeight: 700,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    color: '#121212',
                    margin: '0 0 6px',
                  }}>
                    {master.name}
                    {' '}
                    <span style={{ fontFamily: '"Shippori Mincho", serif', fontWeight: 400, letterSpacing: 0, textTransform: 'none', fontSize: '13px', color: '#888' }}>
                      {master.nameJa}
                    </span>
                  </h3>
                  <div style={{ fontSize: '11px', color: '#666', marginBottom: '10px', letterSpacing: '0.5px' }}>
                    {master.region}
                  </div>

                  {/* Trophy category badges — like UI/UX/INN on Red Collar */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {[
                      master.category.toUpperCase().slice(0, 4),
                      `${master.yearsExperience}YR`,
                      master.noSuccessor ? 'URGENT' : 'ACTIVE',
                    ].map((badge, bi) => (
                      <div key={bi} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '1px',
                        color: bi === 2 && master.noSuccessor ? '#b82d23' : '#5a5a5e',
                      }}>
                        <HankoSealIcon size={11} />
                        {badge}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
          </div>
        </>
      )}

      <Rule />

      {/* ══════════════════════════════════════════
          TACIT SENSORY ARCHIVE  (Previous WoTDs section)
          ══════════════════════════════════════════ */}
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 40px 80px' }}>
        <SectionTag pre="TACIT SENSORY" highlight="ARCHIVE" />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '32px 28px',
        }}>
          {[
            {
              tag: 'ACOUSTIC',
              title: 'The Singing Weld',
              sub: '1,050°C · Metalwork',
              desc: 'A high-frequency metallic ring at peak temperature confirms zero-flux bonding between Shirogami steel and soft iron. A dull thud means fatal seam failure.',
              img: '/images/master-sakai.jpg',
            },
            {
              tag: 'CERAMIC FIRE',
              title: 'Anagama Night Watch',
              sub: '14 Days · Bizen Ceramics',
              desc: "Draft sound, flame colour, and kiln-wall glow guide every stoking decision across 14 continuous days — no thermometers, only the master's senses.",
              img: '/images/master-bizen.jpg',
            },
            {
              tag: 'OLFACTORY',
              title: 'Indigo Vat Sheen',
              sub: 'Fermentation · Shibori',
              desc: 'Evaluating aerobic microbial balance by reading bronze-green iridescence of ai-no-hana surface bubbles and the precise earthy aroma of active vat chemistry.',
              img: '/images/master-arimatsu.jpg',
            },
          ].map((cue, i) => {
            const isH = hoveredId === `cue-${i}`;
            return (
              <div
                key={i}
                onMouseEnter={() => setHoveredId(`cue-${i}`)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ cursor: 'default' }}
              >
                <div style={{
                  width: '100%',
                  aspectRatio: '4/3',
                  overflow: 'hidden',
                  backgroundColor: '#222',
                }}>
                  <img
                    src={cue.img}
                    alt={cue.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      filter: 'sepia(0.15) contrast(1.06) grayscale(0.1)',
                      transform: isH ? 'scale(1.04)' : 'scale(1)',
                      transition: 'transform 0.5s ease',
                    }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <div style={{ paddingTop: '16px' }}>
                  <div style={{
                    fontSize: '9px',
                    fontWeight: 800,
                    letterSpacing: '2.5px',
                    textTransform: 'uppercase',
                    color: '#6b5e90',
                    marginBottom: '6px',
                  }}>
                    {cue.tag}
                  </div>
                  <h3 style={{
                    fontFamily: '"Cinzel", serif',
                    fontSize: '17px',
                    fontWeight: 400,
                    color: '#121212',
                    margin: '0 0 4px',
                    letterSpacing: '0.3px',
                  }}>
                    {cue.title}
                  </h3>
                  <div style={{ fontSize: '10px', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>
                    {cue.sub}
                  </div>
                  <p style={{ fontSize: '12px', color: '#555', lineHeight: 1.7, margin: 0 }}>
                    {cue.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══ Bottom page CTA strip ══ */}
      <div style={{
        borderTop: '1px solid rgba(0,0,0,0.08)',
        backgroundColor: '#e2ddd4',
        padding: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src="/images/shoku-icon.png"
            alt="SHOKU"
            style={{ width: '22px', height: '22px', objectFit: 'contain' }}
          />
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#666' }}>
            SHOKU · {lang === 'ja' ? '職人リンク · ' : ''}CRAFT ARCHIVE 2026
          </div>
        </div>
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          <button onClick={onViewManual} style={{ background: 'none', border: 'none', fontFamily: 'inherit', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', color: '#121212', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
            CRAFT MANUALS →
          </button>
          <button onClick={onStartInterview} style={{ background: '#121212', border: 'none', color: '#fff', fontFamily: 'inherit', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', padding: '10px 24px' }}>
            RECORD INTERVIEW
          </button>
        </div>
      </div>
    </div>
  );
};
