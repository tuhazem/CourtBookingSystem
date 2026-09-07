import { Suspense } from 'react';
import { CourtDto } from '@/lib/types';
import HeroBanner from '@/components/HeroBanner/HeroBanner';
import CourtsSection from '@/components/CourtsSection/CourtsSection';
import { CourtSkeleton } from '@/components/Skeleton/Skeleton';
import styles from './page.module.css';

// ISR: revalidate every 60 seconds — courts list doesn't change that often
export const revalidate = 60;

/**
 * Server Component — fetches courts data at request time (server-side).
 * No 'use client', no useEffect, no client-side waterfall.
 * Courts arrive pre-rendered in the HTML — dramatically improves FCP and LCP.
 */
async function getCourts(): Promise<CourtDto[]> {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
  const url = `${apiBase}/Courts?isActiveOnly=true`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 60 }, // ISR — cache for 60s, revalidate in background
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      console.error(`Courts fetch failed: ${response.status}`);
      return [];
    }

    return response.json();
  } catch (error) {
    console.error('Courts fetch error:', error);
    return []; // Graceful fallback — page still renders, just empty courts list
  }
}

// Skeleton fallback shown while Suspense streams the courts section
function CourtsSkeletonFallback() {
  return (
    <div className={styles.grid}>
      {Array.from({ length: 3 }).map((_, i) => (
        <CourtSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Separate async component for courts data fetching
 * Allows Hero to render immediately while courts stream in
 */
async function CourtsData() {
  const courts = await getCourts();
  return <CourtsSection initialCourts={courts} />;
}

export default function HomePage() {
  return (
    <main className={styles.main}>
      {/* Hero Showcase Banner — renders immediately, no data dependency */}
      <HeroBanner />

      {/* Courts Section — streamed independently with Suspense boundary */}
      <Suspense fallback={<CourtsSkeletonFallback />}>
        <CourtsData />
      </Suspense>
    </main>
  );
}
