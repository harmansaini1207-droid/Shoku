'use client';

import React, { useState, useEffect } from 'react';
import { InsanePreloader } from '@/components/InsanePreloader';
import { LoginPage, AuthMode } from '@/components/LoginPage';
import { UserApp } from '@/components/UserApp';
import { BusinessApp } from '@/components/BusinessApp';

interface Session {
  mode: AuthMode;
  email: string;
}

export default function Home() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  // Restore session from sessionStorage so refreshes don't kick to login
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('shoku-session');
      if (stored) {
        const parsed = JSON.parse(stored) as Session;
        if (parsed.mode && parsed.email) setSession(parsed);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const handleLogin = (mode: AuthMode, email: string) => {
    const s: Session = { mode, email };
    setSession(s);
    try { sessionStorage.setItem('shoku-session', JSON.stringify(s)); } catch { /* ignore */ }
  };

  const handleLogout = () => {
    setSession(null);
    try { sessionStorage.removeItem('shoku-session'); } catch { /* ignore */ }
  };

  return (
    <main>
      {/* Preloader only on first visit */}
      {showPreloader && (
        <InsanePreloader onComplete={() => setShowPreloader(false)} />
      )}

      {!showPreloader && (
        <>
          {!session && (
            <LoginPage onLogin={handleLogin} />
          )}
          {session?.mode === 'user' && (
            <UserApp email={session.email} onLogout={handleLogout} />
          )}
          {session?.mode === 'business' && (
            <BusinessApp email={session.email} onLogout={handleLogout} />
          )}
        </>
      )}
    </main>
  );
}
