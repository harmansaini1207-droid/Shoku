'use client';

import React, { useState, useEffect } from 'react';
import { Master, InterviewSession } from '@/lib/types';
import { Language } from '@/lib/i18n';

interface InterviewModalProps {
  master: Master | null;
  onClose: () => void;
  lang: Language;
}

export const InterviewModal: React.FC<InterviewModalProps> = ({ master, onClose, lang }) => {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [turns, setTurns] = useState<{ role: 'interviewer' | 'master'; text: string; timestamp?: string }[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [finalized, setFinalized] = useState(false);

  useEffect(() => {
    if (!master) {
      setSession(null);
      setTurns([]);
      setFinalized(false);
      return;
    }

    setLoading(true);
    fetch('/api/interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'start',
        masterId: master.id,
        role: 'master',
        craftCategory: master.category,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.session) {
          setSession(data.session);
          setTurns(data.session.turns || []);
        }
      })
      .catch(() => {
        // Fallback default conversation
        setTurns([
          {
            role: 'interviewer',
            text: `Welcome Master ${master.name}. We are codifying your 50+ year lineage in ${master.craft}. Let us capture what no blueprint can show: What tactile or acoustic cue tells you the material is ready for critical forming?`,
            timestamp: new Date().toISOString(),
          },
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [master]);

  const handleSendAnswer = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newTurns = [
      ...turns,
      { role: 'master' as const, text: text, timestamp: new Date().toISOString() },
    ];
    setTurns(newTurns);
    setInputText('');
    setLoading(true);

    try {
      if (session?.sessionId) {
        const res = await fetch('/api/interview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'answer',
            sessionId: session.sessionId,
            answerText: text,
          }),
        });
        const data = await res.json();
        if (data.session) {
          setSession(data.session);
          setTurns(data.session.turns || newTurns);
          if (data.isDone) {
            setFinalized(true);
          }
        }
      } else {
        // Fallback next probe
        setTimeout(() => {
          setTurns([
            ...newTurns,
            {
              role: 'interviewer',
              text:
                'Deeply noted. When heating or blending, what is the disastrous mistake young apprentices make when they rush this step?',
              timestamp: new Date().toISOString(),
            },
          ]);
          setLoading(false);
        }, 800);
        return;
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = async () => {
    if (!session?.sessionId) {
      setFinalized(true);
      return;
    }
    setLoading(true);
    try {
      await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'finalize',
          sessionId: session.sessionId,
        }),
      });
      setFinalized(true);
    } catch {
      setFinalized(true);
    } finally {
      setLoading(false);
    }
  };

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
          maxWidth: '820px',
          height: '85vh',
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
            padding: '18px 28px',
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
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                border: '1.5px solid #b82d23',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#b82d23',
                fontSize: '15px',
                fontFamily: '"Shippori Mincho", serif',
                fontWeight: 700,
              }}
            >
              問
            </div>
            <div>
              <div style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: '#7a756f' }}>
                TACIT CODIFICATION PROTOCOL · 身体知口述対話
              </div>
              <div style={{ fontFamily: '"Cinzel", serif', fontSize: '17px', fontWeight: 700, color: '#121212' }}>
                Oral Interview with Master {master.name}
              </div>
            </div>
          </div>

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
            Exit ✕
          </button>
        </div>

        {/* Dialogue Stream */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '28px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            backgroundColor: '#f7f4ed',
          }}
        >
          {turns.map((turn, i) => {
            const isInterviewer = turn.role === 'interviewer';
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isInterviewer ? 'flex-start' : 'flex-end',
                  maxWidth: '85%',
                  alignSelf: isInterviewer ? 'flex-start' : 'flex-end',
                }}
              >
                <div
                  style={{
                    fontSize: '9px',
                    fontWeight: 800,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    color: isInterviewer ? '#6b5e90' : '#b82d23',
                    marginBottom: '4px',
                  }}
                >
                  {isInterviewer ? 'SHOKU Tacit Synthesizer' : `Master ${master.name}`}
                </div>
                <div
                  style={{
                    padding: '14px 18px',
                    backgroundColor: isInterviewer ? '#fff' : '#121212',
                    color: isInterviewer ? '#1f1e1c' : '#f5f2eb',
                    border: isInterviewer ? '1px solid #ded9cd' : 'none',
                    fontSize: '13px',
                    lineHeight: 1.65,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  {turn.text}
                </div>
              </div>
            );
          })}

          {loading && (
            <div style={{ alignSelf: 'flex-start', color: '#888', fontSize: '11px', letterSpacing: '1px' }}>
              Transcribing tacit frequency markers...
            </div>
          )}

          {finalized && (
            <div
              style={{
                backgroundColor: '#edf4ee',
                border: '1.5px solid #2b5e30',
                padding: '20px 24px',
                marginTop: '10px',
                textAlign: 'center',
              }}
            >
              <div style={{ color: '#2b5e30', fontSize: '11px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
                ✓ Oral Tacit Synthesis Complete
              </div>
              <p style={{ fontSize: '13px', color: '#1a381d', margin: 0, lineHeight: 1.6 }}>
                Master {master.name}&apos;s unwritten cues have been captured into the SHOKU Succession Registry and codified into an official structured manual.
              </p>
            </div>
          )}
        </div>

        {/* Action Controls & Input */}
        {!finalized ? (
          <div
            style={{
              padding: '20px 28px',
              borderTop: '1px solid #e2ddd4',
              backgroundColor: '#fff',
            }}
          >
            {/* Quick response chips */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', alignSelf: 'center' }}>
                Sample responses:
              </span>
              {[
                'The metal sings with a high pitch ring when the temper is right.',
                'The resistance through the hammer softens suddenly at 900°C.',
                'Apprentices strike too fast before the heat reaches the inner core.',
              ].map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendAnswer(sample)}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    backgroundColor: '#f3efe8',
                    border: '1px solid #ded9cd',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    color: '#444',
                  }}
                >
                  &quot;{sample.slice(0, 32)}...&quot;
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendAnswer();
                }}
                placeholder="Answer oral probe or dictate master's sensory cue..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '1px solid #d4cebe',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />
              <button
                onClick={() => handleSendAnswer()}
                disabled={loading || !inputText.trim()}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#121212',
                  color: '#fff',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  cursor: loading || !inputText.trim() ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Send Answer →
              </button>
              <button
                onClick={handleFinalize}
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#b82d23',
                  color: '#fff',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Finalize &amp; Codify
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: '18px 28px',
              borderTop: '1px solid #e2ddd4',
              backgroundColor: '#fff',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: '10px 24px',
                backgroundColor: '#121212',
                color: '#fff',
                border: 'none',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Return to Archive
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
