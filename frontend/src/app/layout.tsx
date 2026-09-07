import type { Metadata } from 'next';
import './globals.css';
import LayoutShell from '@/components/LayoutShell/LayoutShell';
import { WebVitals } from './web-vitals';

// Self-hosted Google Fonts via Fontsource (optimized: only load used weights)
// Cairo: 700 (headings), 800 (extra bold for emphasis)
import '@fontsource/cairo/700.css';
import '@fontsource/cairo/800.css';
// Chivo: 900 (primary headings only)
import '@fontsource/chivo/900.css';

// Material Symbols: load subset asynchronously to avoid blocking render
// This eliminates 314 KB from critical path
import '@fontsource/material-symbols-outlined/400.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://malaabna-app.vercel.app'),
  title: "ملعبنا | منصة حجز ملاعب كرة القدم المعتمدة",
  description: "المنصة الأولى لحجز ملاعب كرة القدم المعتمدة في مصر. احجز ماتشك في ثواني بدون وسيط وبأفضل الأسعار.",
  keywords: ['حجز ملاعب', 'كرة قدم', 'ملاعب خماسية', 'ملاعب سباعية', 'مصر', 'رياضة'],
  authors: [{ name: 'Malaabna' }],
  creator: 'Malaabna',
  openGraph: {
    title: 'ملعبنا | منصة حجز ملاعب كرة القدم',
    description: 'احجز ماتشك في ثواني بدون وسيط وبأفضل الأسعار',
    url: 'https://malaabna-app.vercel.app',
    siteName: 'ملعبنا',
    locale: 'ar_EG',
    type: 'website',
  },
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* PWA manifest & theme */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#047857" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Apple PWA support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ملعبنا" />
        <link rel="apple-touch-icon" href="/images/icon-192.png" />

        {/* DNS Prefetch for better performance */}
        <link rel="dns-prefetch" href="https://malaabna-app.vercel.app" />
        
        {/* Speculation Rules — prerender court detail pages on moderate hover intent */}
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              prerender: [
                {
                  where: { href_matches: '/courts/*' },
                  eagerness: 'moderate',
                },
              ],
            }),
          }}
        />

        {/* Service Worker registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </head>
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <WebVitals />
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
