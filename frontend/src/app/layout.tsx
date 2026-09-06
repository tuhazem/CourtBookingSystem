import type { Metadata } from 'next';
import './globals.css';
import LayoutShell from '@/components/LayoutShell/LayoutShell';

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
    <html lang="ar" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Chivo:wght@700;800;900&family=Hanken+Grotesk:wght@400;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
