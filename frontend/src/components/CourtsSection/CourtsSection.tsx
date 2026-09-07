'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CourtDto, CourtType } from '@/lib/types';
import CourtCard from '@/components/CourtCard/CourtCard';
import { staggerContainerVariants } from '@/lib/animations';
import styles from '@/app/page.module.css';

interface CourtsSectionProps {
  initialCourts: CourtDto[];
}

/**
 * Client Component: handles filter interactivity.
 * Receives pre-fetched courts from the Server Component — no useEffect fetch needed.
 */
export default function CourtsSection({ initialCourts }: CourtsSectionProps) {
  const [selectedType, setSelectedType] = useState<CourtType | 'ALL'>('ALL');

  const filteredCourts = initialCourts.filter((court) => {
    if (selectedType === 'ALL') return true;
    return court.type === selectedType;
  });

  const khomasyCount = initialCourts.filter((c) => c.type === CourtType.Khomasy).length;
  const sobaeyCount = initialCourts.filter((c) => c.type === CourtType.Sobaey).length;

  return (
    <>
      {/* Filter Tabs Bar */}
      <section className={styles.filterSection}>
        <div className={styles.filterPills}>
          <button
            type="button"
            className={`${styles.filterBtn} ${selectedType === 'ALL' ? styles.filterBtnActive : ''}`}
            onClick={() => setSelectedType('ALL')}
          >
            <span>الكل ({initialCourts.length})</span>
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

      {/* Courts Grid — Animated with Framer Motion */}
      {filteredCourts.length === 0 ? (
        <div className={styles.emptyState}>
          <p>لا توجد ملاعب مطابقة للتصنيف المختار حالياً.</p>
        </div>
      ) : (
        <motion.section
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
    </>
  );
}
