import type { Metadata } from 'next';
import { Cairo, Chivo } from 'next/font/google';
import './globals.css';
import LayoutShell from '@/components/LayoutShell/LayoutShell';

// Self-hosted via next/font — zero render-blocking, auto-preloaded, no FOUT
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-cairo',
});

const chivo = Chivo({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  display: 'swap',
  variable: '--font-chivo',
});

export const metadata: Metadata = {
  title: "ملعبنا | منصة حجز ملاعب كرة القدم المعتمدة",
  description: "المنصة الأولى لحجز ملاعب كرة القدم المعتمدة في مصر. احجز ماتشك في ثواني بدون وسيط وبأفضل الأسعار.",
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
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${chivo.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Material Symbols — loaded with display=block to prevent FOIT */}
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
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
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
