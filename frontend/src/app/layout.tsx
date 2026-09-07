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
        
        {/* DNS Prefetch for better performance */}
        <link rel="dns-prefetch" href="https://malaabna-app.vercel.app" />
        
        {/* Suppress preload warnings (Next.js internal optimization) */}
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  const originalWarn = console.warn;
                  console.warn = function(...args) {
                    if (args[0] && typeof args[0] === 'string' && args[0].includes('was preloaded using link preload but not used')) {
                      return;
                    }
                    originalWarn.apply(console, args);
                  };
                })();
              `,
            }}
          />
        )}
        
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
      </head>
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <WebVitals />
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
