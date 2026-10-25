'use client';

import { useEffect } from 'react';

/**
 * ExtensionErrorGuard
 *
 * Silently drops runtime errors thrown by browser extensions (e.g. the
 * Antigravity IDE extension calling React.createRoot on a container that
 * Next.js already owns — React invariant #299).
 *
 * This component mounts as early as possible in the tree (layout.tsx) so the
 * listeners are registered before extensions have a chance to throw.
 */
export function ExtensionErrorGuard() {
  useEffect(() => {
    const isExtensionSource = (src?: string | null, err?: Error | null, msg?: string | null): boolean => {
      const combined = [
        src ?? '',
        msg ?? '',
        err?.stack ?? '',
        err?.message ?? ''
      ].join(' ');

      return (
        combined.includes('chrome-extension://') ||
        combined.includes('moz-extension://') ||
        combined.includes('safari-web-extension://') ||
        combined.includes('ms-browser-extension://') ||
        combined.includes('oihbmmeelledioenpfcfehdjhdnlfibj') ||
        combined.includes('embed_script.js') ||
        combined.includes('Minified React error #299')
      );
    };

    // Suppress synchronous errors from extensions
    const onError = (event: ErrorEvent): boolean => {
      if (isExtensionSource(event.filename, event.error, event.message)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return false;
      }
      return true;
    };

    // Suppress async / Promise rejections from extensions
    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      if (isExtensionSource(reason?.fileName, reason, reason?.message)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    window.addEventListener('error', onError, true);
    window.addEventListener('unhandledrejection', onUnhandledRejection, true);

    return () => {
      window.removeEventListener('error', onError, true);
      window.removeEventListener('unhandledrejection', onUnhandledRejection, true);
    };
  }, []);

  return null;
}
