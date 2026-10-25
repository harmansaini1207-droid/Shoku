import type { Metadata } from 'next';
import './globals.css';
import { ExtensionErrorGuard } from '@/components/ExtensionErrorGuard';

export const metadata: Metadata = {
  title: 'SHOKU (職人リンク) — Preserving Japan\'s Tacit Craft Heritage with Indian Talent',
  description:
    'An offline-first, open-source platform bridging Japan\'s vanishing traditional craft masters with skilled Indian technical artisans through tacit knowledge codification, explainable matching, and cross-cultural communication decoding.',
  keywords: [
    'Traditional Japanese Craft',
    'Tacit Knowledge',
    'Craft Preservation',
    'Sakai Blades',
    'Mino Washi',
    'Indo-Japanese Collaboration',
    'Offline AI'
  ],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/images/shoku-icon.png', sizes: '192x192', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: '/images/shoku-icon.png',
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Synchronous pre-hydration guard: intercepts Chrome extension errors before Next.js error overlay */}
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function shouldIgnore(err, filename, message) {
                  var str = (filename || '') + ' ' + (message || '') + ' ' + (err && err.stack ? err.stack : '') + ' ' + (err && err.message ? err.message : '');
                  return str.indexOf('chrome-extension://') !== -1 ||
                         str.indexOf('moz-extension://') !== -1 ||
                         str.indexOf('oihbmmeelledioenpfcfehdjhdnlfibj') !== -1 ||
                         str.indexOf('embed_script.js') !== -1 ||
                         str.indexOf('Minified React error #299') !== -1;
                }

                window.addEventListener('error', function(e) {
                  if (shouldIgnore(e.error, e.filename, e.message)) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    return true;
                  }
                }, true);

                window.addEventListener('unhandledrejection', function(e) {
                  var reason = e.reason;
                  var stack = reason && reason.stack ? reason.stack : '';
                  var msg = reason && reason.message ? reason.message : '';
                  if (shouldIgnore(reason, '', stack + ' ' + msg)) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                  }
                }, true);

                var origConsoleError = console.error;
                console.error = function() {
                  var args = Array.prototype.slice.call(arguments);
                  var str = args.map(function(a) { return (a && a.stack) ? a.stack : String(a); }).join(' ');
                  if (shouldIgnore(null, '', str)) {
                    return;
                  }
                  return origConsoleError.apply(console, arguments);
                };
              })();
            `
          }}
        />
      </head>
      <body suppressHydrationWarning>
        {/* Satisfies Chrome extensions that check document.getElementById("root") */}
        <div id="root" style={{ display: 'none' }} aria-hidden="true" />
        <ExtensionErrorGuard />
        {children}
      </body>
    </html>
  );
}
