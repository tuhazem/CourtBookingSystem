'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CourtDto, CourtType } from '@/lib/types';
import { fetchCourts } from '@/lib/api';
import HeroBanner from '@/components/HeroBanner/HeroBanner';
import CourtCard from '@/components/CourtCard/CourtCard';
import { CourtSkeleton } from '@/components/Skeleton/Skeleton';
import ErrorState from '@/components/ErrorState/ErrorState';
import { staggerContainerVariants } from '@/lib/animations';
import styles from './page.module.css';

export default function HomePage() {
  const [courts, setCourts] = useState<CourtDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<CourtType | 'ALL'>('ALL');

  const loadCourts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCourts(true);
      setCourts(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('تعذر تحميل الملاعب. يرجى التحقق من تشغيل السيرفر.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourts();
  }, []);

  const filteredCourts = courts.filter((court) => {
    if (selectedType === 'ALL') return true;
    return court.type === selectedType;
  });

  const khomasyCount = courts.filter((c) => c.type === CourtType.Khomasy).length;
  const sobaeyCount = courts.filter((c) => c.type === CourtType.Sobaey).length;

  return (
    <main className={styles.main}>
      {/* Hero Showcase Banner */}
      <HeroBanner />

      {/* Filter Tabs Bar */}
      <section className={styles.filterSection}>
        <div className={styles.filterPills}>
          <button
            type="button"
            className={`${styles.filterBtn} ${selectedType === 'ALL' ? styles.filterBtnActive : ''}`}
            onClick={() => setSelectedType('ALL')}
          >
            <span>الكل ({courts.length})</span>
          </button>

          <button
            type="button"
            className={`${styles.filterBtn} ${selectedType === CourtType.Khomasy ? styles.filterBtnActive : ''}`}
            onClick={() => setSelectedType(CourtType.Khomasy)}
          >
            <span>ملاعب خماسية ({khomasyCount})</span>
          </button>

          <button
            type="button"
            className={`${styles.filterBtn} ${selectedType === CourtType.Sobaey ? styles.filterBtnActive : ''}`}
            onClick={() => setSelectedType(CourtType.Sobaey)}
          >
            <span>ملاعب سباعية ({sobaeyCount})</span>
          </button>
        </div>

        <div className={styles.sortNote}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.125rem', color: 'var(--color-primary)' }}>
            tune
          </span>
          <span>عرض حسب: المتاح والأحدث</span>
        </div>
      </section>

      {/* Content Area: Loading, Error, or Animated Courts Grid */}
      {loading ? (
        <div className={styles.grid}>
          {Array.from({ length: 3 }).map((_, i) => (
            <CourtSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={loadCourts} />
      ) : filteredCourts.length === 0 ? (
        <div className={styles.emptyState}>
          <p>لا توجد ملاعب مطابقة للتصنيف المختار حالياً.</p>
        </div>
      ) : (
        <motion.section
          layout
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
          className={styles.grid}
        >
          <AnimatePresence mode="popLayout">
            {filteredCourts.map((court) => (
              <CourtCard key={court.id} court={court} />
            ))}
          </AnimatePresence>
        </motion.section>
      )}


      {/* Pitch Owner Onboarding CTA */}
      <section className={styles.ownerBanner}>
        <div className={styles.ownerText}>
          <h3>صاحب أو مدير ملعب رياضي؟</h3>
          <p>
            انضم لأكبر شبكة ملاعب في مصر؛ تحكم في مواعيدك، احصل على عربون مؤمن، وزوّد نسبة إشغال ملعبك حتى 40% بدون أي رسوم تسجيل.
          </p>
        </div>
        <Link href="/partner" className={styles.ownerBtn}>
          <span className="material-symbols-outlined">add_business</span>
          <span>سجل ملعبك الرياضي مجاناً</span>
        </Link>
      </section>
    </main>
  );
}
