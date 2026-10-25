'use client';

import React, { useState } from 'react';

export type AuthMode = 'user' | 'business';

interface LoginPageProps {
  onLogin: (mode: AuthMode, email: string) => void;
}

/* Bespoke SVG Japanese Crest (Mon 紋) for Artisan */
function ArtisanMonIcon({ size = 28, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="20" cy="20" r="18" strokeWidth="1.2" strokeOpacity="0.4" />
      <path d="M20 7v26M7 20h26" strokeWidth="1" strokeOpacity="0.3" />
      <path d="M14 13l12 14M26 13L14 27" strokeWidth="1.4" />
      <rect x="16" y="16" width="8" height="8" transform="rotate(45 20 20)" fill={color} fillOpacity="0.18" />
    </svg>
  );
}

/* Bespoke SVG Japanese Crest (Mon 紋) for Guild / Workshop Business */
function BusinessMonIcon({ size = 28, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="20" cy="20" r="18" strokeWidth="1.2" strokeOpacity="0.4" />
      <path d="M9 14h22M12 14v16M28 14v16" strokeWidth="1.4" />
      <path d="M7 11h26M15 11V8h10v3" strokeWidth="1.4" />
      <path d="M16 23h8M16 27h8" strokeWidth="1.2" strokeOpacity="0.6" />
    </svg>
  );
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hovered, setHovered] = useState<AuthMode | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(mode, email.trim() || (mode === 'user' ? 'artisan@shoku.jp' : 'studio@shoku.jp'));
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ece7dc',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"GT America Trial", "Plus Jakarta Sans", sans-serif',
      padding: '32px 24px',
      position: 'relative',
      backgroundImage: `
        linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
      `,
      backgroundSize: '48px 48px',
    }}>
      {/* Top Left Edge Brand Logo */}
      <div style={{
        position: 'absolute',
        top: '24px',
        left: '28px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 20,
      }}>
        <img
          src="/images/shoku-icon.png"
          alt="SHOKU Logo"
          style={{ width: '38px', height: '38px', objectFit: 'contain', display: 'block' }}
        />
        <div>
          <div style={{ fontFamily: '"Cinzel", serif', fontSize: '13px', fontWeight: 700, letterSpacing: '2px', color: '#121212', lineHeight: 1.1 }}>
            SHOKU
          </div>
          <div style={{ fontSize: '8px', letterSpacing: '1.5px', color: '#7a756f', textTransform: 'uppercase', marginTop: '2px' }}>
            職人伝承録
          </div>
        </div>
      </div>

      {/* Editorial Header Stamp */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid rgba(0,0,0,0.12)',
          padding: '5px 16px',
          borderRadius: '2px',
          marginBottom: '20px',
          background: 'rgba(255,255,255,0.6)',
        }}>
          <span style={{ width: '6px', height: '6px', backgroundColor: '#b82d23', borderRadius: '50%', display: 'inline-block' }} />
          <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#444' }}>
            LIVING CRAFT ARCHIVE · 職人伝承録
          </span>
        </div>

        <div style={{ marginBottom: '6px' }}>
          <img
            src="/images/shoku-logo.png"
            alt="SHOKU"
            style={{
              height: 'clamp(48px, 7vw, 72px)',
              width: 'auto',
              display: 'block',
              margin: '0 auto',
            }}
          />
        </div>

        <div style={{
          fontFamily: '"Shippori Mincho", serif',
          fontSize: '15px',
          color: '#666',
          marginTop: '10px',
          letterSpacing: '4px',
        }}>
          職 人 リ ン ク
        </div>

        <p style={{
          fontSize: '11px',
          color: '#777',
          marginTop: '12px',
          letterSpacing: '1.8px',
          textTransform: 'uppercase',
          maxWidth: '380px',
          lineHeight: 1.8,
        }}>
          Bilateral Heritage Registry · Direct Lineage Succession
        </p>
      </div>

      {/* Role Selection Dossiers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '14px',
        width: '100%',
        maxWidth: '480px',
        marginBottom: '26px',
      }}>
        {(['user', 'business'] as AuthMode[]).map((m) => {
          const isActive = mode === m;
          const isHov = hovered === m;
          const isUser = m === 'user';

          return (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              onMouseEnter={() => setHovered(m)}
              onMouseLeave={() => setHovered(null)}
              style={{
                border: isActive
                  ? '1.5px solid #121212'
                  : isHov
                    ? '1.5px solid rgba(0,0,0,0.3)'
                    : '1px solid rgba(0,0,0,0.1)',
                background: isActive
                  ? '#ffffff'
                  : isHov
                    ? '#fbf9f4'
                    : 'rgba(255,255,255,0.7)',
                borderRadius: '2px',
                padding: '20px 18px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                position: 'relative',
                boxShadow: isActive ? '0 4px 16px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <div style={{
                color: isActive ? '#b82d23' : '#666',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                {isUser ? <ArtisanMonIcon size={26} color={isActive ? '#b82d23' : '#666'} /> : <BusinessMonIcon size={26} color={isActive ? '#b82d23' : '#666'} />}
                <span style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  fontFamily: '"Shippori Mincho", serif',
                  color: isActive ? '#b82d23' : '#888',
                }}>
                  {isUser ? '工芸徒弟' : '工房主'}
                </span>
              </div>

              <div style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '5px',
                color: '#121212',
              }}>
                {isUser ? 'Artisan / Apprentice' : 'Workshop / Business'}
              </div>

              <div style={{
                fontSize: '11px',
                color: '#666',
                lineHeight: 1.5,
              }}>
                {isUser
                  ? 'Browse living masters, archive portfolio & express interest'
                  : 'Evaluate candidates, calibrate craft skills & audio profiling'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: '480px',
          background: '#ffffff',
          border: '1px solid rgba(0,0,0,0.09)',
          borderRadius: '2px',
          padding: '28px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '1.8px',
            textTransform: 'uppercase',
            color: '#555',
            display: 'block',
            marginBottom: '7px',
          }}>
            Registry Identifier / Email
          </label>
          <input
            type="email"
            placeholder={mode === 'user' ? 'artisan@shoku.jp' : 'studio@shoku.jp'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              background: '#faf8f4',
              border: '1px solid rgba(0,0,0,0.16)',
              borderRadius: '2px',
              color: '#121212',
              fontSize: '13px',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#121212')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.16)')}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '1.8px',
            textTransform: 'uppercase',
            color: '#555',
            display: 'block',
            marginBottom: '7px',
          }}>
            Access Key
          </label>
          <input
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              background: '#faf8f4',
              border: '1px solid rgba(0,0,0,0.16)',
              borderRadius: '2px',
              color: '#121212',
              fontSize: '13px',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#121212')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.16)')}
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '14px',
            background: mode === 'user' ? '#121212' : '#b82d23',
            border: 'none',
            borderRadius: '2px',
            color: '#f5f2eb',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1.0';
          }}
        >
          {mode === 'user' ? 'Access Artisan Archive →' : 'Enter Workshop Console →'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button
            type="button"
            onClick={() => onLogin(mode, mode === 'user' ? 'artisan@shoku.jp' : 'studio@shoku.jp')}
            style={{
              background: 'none',
              border: 'none',
              color: '#777',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '10px',
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}
          >
            Authenticate with guest credentials
          </button>
        </div>
      </form>

      {/* Footer Colophon */}
      <div style={{
        marginTop: '44px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        fontSize: '9px',
        fontWeight: 600,
        letterSpacing: '2px',
        textTransform: 'uppercase',
        color: '#888',
      }}>
        <span>職人文化保存機構</span>
        <span>·</span>
        <span>EST. 2026</span>
        <span>·</span>
        <span>TOKYO — KYOTO — SAKAI</span>
      </div>
    </div>
  );
};

