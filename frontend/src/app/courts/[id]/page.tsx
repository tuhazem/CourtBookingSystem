import { Suspense } from 'react';
import Link from 'next/link';
import { CourtDto, CourtType, SlotDto } from '@/lib/types';
import CourtDetailClient from './CourtDetailClient';
import { SlotsSkeleton } from '@/components/Skeleton/Skeleton';
import ErrorState from '@/components/ErrorState/ErrorState';
import styles from './page.module.css';

// ISR: revalidate every 30 seconds for court details
export const revalidate = 30;

async function getCourt(courtId: number): Promise<CourtDto | null> {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
  try {
    const response = await fetch(`${apiBase}/Courts?isActiveOnly=false`, {
      next: { revalidate: 30 },
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) return null;
    const courts: CourtDto[] = await response.json();
    return courts.find((c) => c.id === courtId) || null;
  } catch {
    return null;
  }
}

async function getInitialSlots(courtId: number): Promise<SlotDto[]> {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
  const today = new Date().toISOString().split('T')[0];
  try {
    const response = await fetch(`${apiBase}/Bookings/available-slots?courtId=${courtId}&date=${today}`, {
      next: { revalidate: 10 }, // Slots change frequently
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}

export default async function CourtDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const courtId = parseInt(resolvedParams.id, 10);

  const [court, initialSlots] = await Promise.all([
    getCourt(courtId),
    getInitialSlots(courtId),
  ]);

  if (!court) {
    return (
      <div className={styles.container}>
        <ErrorState
          title="تعذر تحميل الملعب"
          message="الملعب غير متوفر حالياً"
          onRetry={undefined}
        />
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link href="/" className={styles.backBtn}>
            ← العودة لقائمة الملاعب
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <Link href="/" className={styles.backBtn}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>
            arrow_forward
          </span>
          <span>العودة للملاعب</span>
        </Link>
      </div>

      {/* Court Hero - Server-rendered for instant LCP */}
      <CourtHeroSection court={court} />

      {/* Client Component for Interactivity */}
      <Suspense fallback={<SlotsSkeleton />}>
        <CourtDetailClient 
          court={court} 
          courtId={courtId}
          initialSlots={initialSlots}
        />
      </Suspense>
    </div>
  );
}

// Server Component - renders immediately
function CourtHeroSection({ court }: { court: CourtDto }) {
  const isKhomasy = court.type === CourtType.Khomasy;
  const typeText = isKhomasy ? 'ملعب خماسي' : 'ملعب سباعي';

  return (
    <section className={styles.courtHero}>
      <div className={styles.heroMedia}>
        <svg className={styles.heroSvg} viewBox="0 0 800 320" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="hero-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>
            <pattern id="hero-stripes" width="60" height="320" patternUnits="userSpaceOnUse">
              <rect width="30" height="320" fill="rgba(255,255,255,0.03)" />
            </pattern>
          </defs>
          <rect width="800" height="320" fill="url(#hero-grad)" />
          <rect width="800" height="320" fill="url(#hero-stripes)" />
          <rect x="40" y="30" width="720" height="260" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" rx="6" />
          <line x1="400" y1="30" x2="400" y2="290" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
          <circle cx="400" cy="160" r="50" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
          <circle cx="400" cy="160" r="4" fill="rgba(255,255,255,0.8)" />
          <rect x="40" y="95" width="70" height="130" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
          <rect x="690" y="95" width="70" height="130" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
        </svg>

        <div className={styles.priceTagOverlay}>
          <span className={styles.priceTagLabel}>سعر الساعة</span>
          <span className={`${styles.priceTagValue} num-font`}>{court.pricePerHour}</span>
          <span className={styles.priceTagUnit}> ج.م / ساعة</span>
        </div>

        <div className={styles.heroContentOverlay}>
          <h1 className={styles.heroTitle}>{court.name}</h1>
          <div className={styles.heroTags}>
            <span className={styles.heroTag}>{typeText}</span>
            <span className={styles.heroTag}>متاح للحجز المباشر</span>
            <span className={styles.heroTag}>كرات تدريب متوفرة</span>
          </div>
        </div>
      </div>

      <div className={styles.perksBar}>
        <div className={styles.perksList}>
          <span><span className={styles.perkCheck}>✓</span> إضاءة ليلية قوية</span>
          <span><span className={styles.perkCheck}>✓</span> غرف تبديل ملابس</span>
          <span><span className={styles.perkCheck}>✓</span> مياه ومشروبات</span>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          الحجز المباشر عبر المنصة بدون أي رسوم إضافية
        </span>
      </div>
    </section>
  );
}
