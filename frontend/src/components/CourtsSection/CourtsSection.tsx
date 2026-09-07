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
 * Client Component: handles filter and sort interactivity.
 * Receives pre-fetched courts from the Server Component — no useEffect fetch needed.
 */
export default function CourtsSection({ initialCourts }: CourtsSectionProps) {
  const [selectedType, setSelectedType] = useState<CourtType | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'newest' | 'price-low' | 'price-high'>('name');

  const filteredCourts = initialCourts.filter((court) => {
    if (selectedType === 'ALL') return true;
    return court.type === selectedType;
  });

  // Sort courts based on selected criteria
  const sortedCourts = [...filteredCourts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        // Alphabetical by name (Arabic)
        return a.name.localeCompare(b.name, 'ar');
      
      case 'newest':
        // Newest first (highest ID)
        return b.id - a.id;
      
      case 'price-low':
        // Lowest price first
        return a.pricePerHour - b.pricePerHour;
      
      case 'price-high':
        // Highest price first
        return b.pricePerHour - a.pricePerHour;
      
      default:
        return 0;
    }
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
          <button
            type="button"
            className={styles.sortToggle}
            onClick={() => {
              const options: Array<'name' | 'newest' | 'price-low' | 'price-high'> = 
                ['name', 'newest', 'price-low', 'price-high'];
              const currentIndex = options.indexOf(sortBy);
              const nextIndex = (currentIndex + 1) % options.length;
              setSortBy(options[nextIndex]);
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>
              tune
            </span>
            <span>
              عرض حسب: {
                sortBy === 'name' ? 'الاسم' :
                sortBy === 'newest' ? 'الأحدث' :
                sortBy === 'price-low' ? 'الأرخص' :
                'الأغلى'
              }
            </span>
          </button>
        </div>
      </section>

      {/* Courts Grid — Animated with Framer Motion */}
      {sortedCourts.length === 0 ? (
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
            {sortedCourts.map((court) => (
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
