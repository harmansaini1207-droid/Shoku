'use client';

/**
 * global-error.tsx — Next.js App Router global error boundary.
 *
 * This is the last resort catch for errors that bubble past all nested
 * error boundaries. Extension-originated React errors (like #299) that
 * somehow escape ExtensionErrorGuard's window listener are silently
 * swallowed here — the page resets automatically.
 */

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isExtensionError =
    (error?.stack ?? '').includes('chrome-extension://') ||
    (error?.stack ?? '').includes('moz-extension://') ||
    (error?.stack ?? '').includes('safari-web-extension://');

  useEffect(() => {
    // Silently reset for extension errors — no user-visible disruption
    if (isExtensionError) {
      reset();
    }
  }, [isExtensionError, reset]);

  // For real app errors, show a minimal recovery UI
  if (!isExtensionError) {
    return (
      <html>
        <body
          style={{
            margin: 0,
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '20px',
            fontFamily: 'sans-serif',
            backgroundColor: '#0f0f0f',
            color: '#ffffff',
          }}
        >
          <div style={{ fontSize: '48px' }}>匠</div>
          <h2 style={{ fontWeight: 400, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '14px' }}>
            Something went wrong
          </h2>
          <button
            onClick={reset}
            style={{
              padding: '10px 24px',
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'transparent',
              color: '#fff',
              fontSize: '12px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </body>
      </html>
    );
  }

  // Extension errors: return null so the page stays blank for one frame,
  // then reset() re-renders the real app
  return null;
}
