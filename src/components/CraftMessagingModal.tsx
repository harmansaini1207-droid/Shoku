'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Master } from '@/lib/types';
import { Language } from '@/lib/i18n';

interface MessageItem {
  id: string;
  master_id: string;
  sender_email: string;
  sender_role: 'candidate' | 'master';
  text: string;
  created_at: string;
  literal_translation?: string | null;
  cultural_intent?: string | null;
}

interface CraftMessagingModalProps {
  master: Master | null;
  candidateEmail: string;
  onClose: () => void;
  lang: Language;
}

export const CraftMessagingModal: React.FC<CraftMessagingModalProps> = ({
  master,
  candidateEmail,
  onClose,
  lang,
}) => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const [expandedTranslations, setExpandedTranslations] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load message history
  const fetchMessages = () => {
    if (!master) return;
    fetch(`/api/messages?masterId=${master.id}&email=${encodeURIComponent(candidateEmail)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.messages) {
          setMessages(data.messages);
          // If first message has translation, expand it by default
          if (data.messages[0]?.literal_translation) {
            setExpandedTranslations((prev) => ({ ...prev, [data.messages[0].id]: true }));
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchMessages();
  }, [master]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!master) return null;

  // Send a message
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    setLoading(true);
    setInputText('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          masterId: master.id,
          email: candidateEmail,
          role: 'candidate',
          text: text,
        }),
      });

      if (res.ok) {
        fetchMessages();
        // Check again after 1.5s for master's response
        setTimeout(fetchMessages, 1500);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  // Toggle or fetch DeepL + Gemini translation
  const handleToggleTranslation = async (msg: MessageItem) => {
    const isCurrentlyExpanded = expandedTranslations[msg.id];

    if (isCurrentlyExpanded) {
      setExpandedTranslations((prev) => ({ ...prev, [msg.id]: false }));
      return;
    }

    // If already has both translations, just open
    if (msg.literal_translation && msg.cultural_intent) {
      setExpandedTranslations((prev) => ({ ...prev, [msg.id]: true }));
      return;
    }

    // Otherwise, call /api/translate
    setTranslatingId(msg.id);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: msg.text,
          context: `Apprenticeship inquiry with Japanese master ${master.name} for ${master.craft} in ${master.region}.`,
        }),
      });

      const data = await res.json();
      if (data.literal && data.intent) {
        // Update local message
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msg.id
              ? { ...m, literal_translation: data.literal, cultural_intent: data.intent }
              : m
          )
        );
        setExpandedTranslations((prev) => ({ ...prev, [msg.id]: true }));

        // Cache into Supabase/API
        fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            masterId: master.id,
            email: candidateEmail,
            updateId: msg.id,
            literal: data.literal,
            intent: data.intent,
          }),
        }).catch(() => {});
      }
    } catch {
      // ignore
    } finally {
      setTranslatingId(null);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1050,
        backgroundColor: 'rgba(12, 13, 16, 0.78)',
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
          maxWidth: '860px',
          height: '88vh',
          backgroundColor: '#faf8f4',
          border: '1px solid #dcd7cc',
          boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: '"GT America Trial", "Plus Jakarta Sans", sans-serif',
          color: '#1a1a1a',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          style={{
            padding: '16px 28px',
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
                width: '38px',
                height: '38px',
                border: '1.5px solid #b82d23',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#b82d23',
                fontSize: '18px',
                fontFamily: '"Shippori Mincho", serif',
                fontWeight: 700,
              }}
            >
              契
            </div>
            <div>
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
                <span>●</span> DIRECT ATELIER DIALOGUE · 師弟書信往来
              </div>
              <div
                style={{
                  fontFamily: '"Cinzel", "Times New Roman", serif',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#121212',
                }}
              >
                {master.name} ({master.nameJa}) — {master.craft}
              </div>
              <div style={{ fontSize: '11px', color: '#777' }}>
                {master.regionJa} · {master.yearsExperience} Year Lineage · Apprentice Inquiry Channel
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span
              style={{
                padding: '4px 10px',
                background: '#e8e2d5',
                border: '1px solid #d5cebf',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#444',
                borderRadius: '2px',
              }}
            >
              DeepL + Gemini 2.5 Active
            </span>
            <button
              onClick={onClose}
              style={{
                padding: '7px 16px',
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

        {/* Message Thread */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '28px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            backgroundColor: '#f7f4ed',
          }}
        >
          {messages.map((msg) => {
            const isMaster = msg.sender_role === 'master';
            const isExpanded = expandedTranslations[msg.id];
            const isTranslating = translatingId === msg.id;

            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMaster ? 'flex-start' : 'flex-end',
                  maxWidth: '85%',
                  alignSelf: isMaster ? 'flex-start' : 'flex-end',
                }}
              >
                {/* Sender badge & timestamp */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px',
                    fontSize: '9px',
                    fontWeight: 800,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    color: isMaster ? '#b82d23' : '#555',
                  }}
                >
                  <span>{isMaster ? `Master ${master.name}` : 'You (Apprentice Applicant)'}</span>
                  <span style={{ fontWeight: 400, color: '#999' }}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Message Bubble */}
                <div
                  style={{
                    padding: '16px 20px',
                    backgroundColor: isMaster ? '#ffffff' : '#1a1b20',
                    color: isMaster ? '#1f1e1c' : '#f5f2eb',
                    border: isMaster ? '1px solid #ded9cd' : 'none',
                    borderRadius: '2px',
                    fontSize: '13px',
                    lineHeight: 1.7,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.text}

                  {/* Translation Action Bar */}
                  <div
                    style={{
                      marginTop: '12px',
                      paddingTop: '10px',
                      borderTop: isMaster ? '1px solid #eee' : '1px solid rgba(255,255,255,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleTranslation(msg)}
                      disabled={isTranslating}
                      style={{
                        background: isExpanded ? 'rgba(184,45,35,0.1)' : 'transparent',
                        border: isExpanded ? '1px solid #b82d23' : isMaster ? '1px solid #ccc' : '1px solid rgba(255,255,255,0.25)',
                        color: isExpanded ? '#b82d23' : isMaster ? '#444' : '#e0dbce',
                        padding: '4px 10px',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        cursor: isTranslating ? 'not-allowed' : 'pointer',
                        fontFamily: 'inherit',
                        borderRadius: '2px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span style={{ fontSize: '11px' }}>文</span>
                      <span>
                        {isTranslating
                          ? 'Translating (DeepL + Gemini)...'
                          : isExpanded
                          ? 'Hide Translations ▲'
                          : 'Translate (Literal & Intent) ▼'}
                      </span>
                    </button>

                    <span style={{ fontSize: '9px', color: isMaster ? '#999' : 'rgba(255,255,255,0.4)', letterSpacing: '0.5px' }}>
                      DeepL Free · Gemini 2.5 Flash
                    </span>
                  </div>
                </div>

                {/* Dual-Translation Card (DeepL Literal + Gemini 2.5 Flash Cultural Intent) */}
                {isExpanded && (msg.literal_translation || msg.cultural_intent) && (
                  <div
                    style={{
                      marginTop: '10px',
                      width: '100%',
                      backgroundColor: '#fff',
                      border: '1px solid #d4cebe',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                      borderRadius: '2px',
                      overflow: 'hidden',
                      animation: 'fadeIn 0.2s ease',
                    }}
                  >
                    {/* 1. Literal Translation Header (DeepL) */}
                    <div
                      style={{
                        padding: '12px 16px',
                        backgroundColor: '#f3efe8',
                        borderBottom: '1px solid #e5dfd2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            background: '#0f2b48',
                            color: '#fff',
                            fontSize: '8px',
                            fontWeight: 800,
                            letterSpacing: '1.5px',
                            padding: '2px 6px',
                            borderRadius: '1px',
                            textTransform: 'uppercase',
                          }}
                        >
                          DeepL
                        </span>
                        <strong style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: '#1a1a1a' }}>
                          1. Literal Translation (直訳)
                        </strong>
                      </div>
                      <span style={{ fontSize: '9px', color: '#777' }}>Accurate linguistic mapping</span>
                    </div>

                    <div style={{ padding: '14px 18px', fontSize: '13px', lineHeight: 1.65, color: '#2c2b29' }}>
                      {msg.literal_translation}
                    </div>

                    {/* 2. Cultural Intent & Subtext (Gemini 2.5 Flash) */}
                    <div
                      style={{
                        padding: '12px 16px',
                        backgroundColor: '#faf6ee',
                        borderTop: '1px solid #e8e1cf',
                        borderBottom: '1px solid #e5dfd2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            background: '#b82d23',
                            color: '#fff',
                            fontSize: '8px',
                            fontWeight: 800,
                            letterSpacing: '1.5px',
                            padding: '2px 6px',
                            borderRadius: '1px',
                            textTransform: 'uppercase',
                          }}
                        >
                          Gemini 2.5
                        </span>
                        <strong style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: '#b82d23' }}>
                          2. Cultural Intent &amp; Unspoken Subtext (本音・建前・真意)
                        </strong>
                      </div>
                      <span style={{ fontSize: '9px', color: '#999' }}>Craft etiquette analysis</span>
                    </div>

                    <div
                      style={{
                        padding: '14px 18px',
                        backgroundColor: '#fffdf9',
                        fontSize: '12px',
                        lineHeight: 1.7,
                        color: '#38332c',
                        borderLeft: '3px solid #b82d23',
                      }}
                    >
                      <div style={{ whiteSpace: 'pre-line' }}>{msg.cultural_intent}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Footer: Quick Response Prompts & Text Input */}
        <div
          style={{
            padding: '20px 28px',
            borderTop: '1px solid #e2ddd4',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Quick Inquiry Chips */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '9px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '1px', alignSelf: 'center' }}>
              Inquiry templates:
            </span>
            {[
              'I have 4 years of precision metalworking and request an apprentice consultation.',
              'I am preparing for JLPT N3 and wish to dedicate myself to traditional craft succession.',
              'Could we arrange an online consultation to discuss workshop safety & apprentice visas?',
            ].map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(tmpl)}
                style={{
                  padding: '5px 12px',
                  fontSize: '11px',
                  backgroundColor: '#f3efe8',
                  border: '1px solid #ded9cd',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  color: '#444',
                  transition: 'background-color 0.15s',
                }}
              >
                &quot;{tmpl.slice(0, 36)}...&quot;
              </button>
            ))}
          </div>

          {/* Text input row */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder={`Write your inquiry to Master ${master.name} (English or Japanese)...`}
              style={{
                flex: 1,
                padding: '12px 18px',
                border: '1px solid #d4cebe',
                borderRadius: '2px',
                fontSize: '13px',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={loading || !inputText.trim()}
              style={{
                padding: '12px 28px',
                backgroundColor: loading || !inputText.trim() ? '#888' : '#b82d23',
                color: '#ffffff',
                border: 'none',
                borderRadius: '2px',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '1.8px',
                textTransform: 'uppercase',
                cursor: loading || !inputText.trim() ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                transition: 'background-color 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              {loading ? 'Sending...' : 'Send Inquiry →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
