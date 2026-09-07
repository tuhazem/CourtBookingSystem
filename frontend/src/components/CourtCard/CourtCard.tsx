'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CourtDto, CourtType } from '@/lib/types';
import { fadeUpVariants } from '@/lib/animations';
import styles from './CourtCard.module.css';

interface CourtCardProps {
  court: CourtDto;
}

export default function CourtCard({ court }: CourtCardProps) {
  const isKhomasy = court.type === CourtType.Khomasy;
  const typeName = isKhomasy ? 'ملعب خماسي' : 'ملعب سباعي';
  const surfaceDescription = isKhomasy ? 'عشب صناعي تركي منور' : 'نجيل طبيعي بمواصفات دولية';

  return (
    <motion.article
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{
        y: -6,
        transition: { type: 'spring', stiffness: 350, damping: 20 },
      }}
      className={styles.card}
    >
      {/* Visual Pitch Header */}
      <div className={styles.mediaHeader}>
        {/* SVG Football Field Illustration */}
        <svg
          className={styles.pitchIllustration}
          viewBox="0 0 400 220"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`grass-${court.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isKhomasy ? '#065f46' : '#047857'} />
              <stop offset="50%" stopColor={isKhomasy ? '#047857' : '#059669'} />
              <stop offset="100%" stopColor={isKhomasy ? '#0f766e' : '#065f46'} />
            </linearGradient>
            <pattern id={`stripes-${court.id}`} width="40" height="220" patternUnits="userSpaceOnUse">
              <rect width="20" height="220" fill="rgba(255,255,255,0.04)" />
            </pattern>
          </defs>

          {/* Pitch grass base */}
          <rect width="400" height="220" fill={`url(#grass-${court.id})`} />
          <rect width="400" height="220" fill={`url(#stripes-${court.id})`} />

          {/* Stadium Pitch Lines */}
          <rect x="25" y="20" width="350" height="180" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" rx="4" />
          <line x1="200" y1="20" x2="200" y2="200" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
          <circle cx="200" cy="110" r="32" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
          <circle cx="200" cy="110" r="2.5" fill="rgba(255,255,255,0.8)" />

          {/* Goal boxes */}
          <rect x="25" y="65" width="45" height="90" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
          <rect x="330" y="65" width="45" height="90" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />

          {/* Subtle floodlight glow */}
          <circle cx="35" cy="30" r="80" fill="rgba(255,255,255,0.08)" />
          <circle cx="365" cy="30" r="80" fill="rgba(255,255,255,0.08)" />
        </svg>

        {/* Top Badges */}
        <div className={styles.topBadges}>
          <span className={styles.typeBadge}>{typeName}</span>
          <span className={styles.statusBadge}>
            <span style={{ color: '#4ae183' }}>●</span>
            <span>جاهز للحجز</span>
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className={styles.cardBody}>
        <div>
          <h2 className={styles.courtName}>{court.name}</h2>

          <div className={styles.specsList}>
            <span className={`${styles.specTag} ${styles.specTagHighlight}`}>
              {surfaceDescription}
            </span>
            <span className={styles.specTag}>كشافات إضاءة LED</span>
            <span className={styles.specTag}>كرات تدريب</span>
          </div>
        </div>

        {/* Footer with Real Price and CTA */}
        <div className={styles.cardFooter}>
          <div>
            <span className={styles.priceLabel}>سعر الساعة</span>
            <div className={styles.priceValueRow}>
              <span className={`${styles.priceNumber} num-font`}>
                {court.pricePerHour}
              </span>
              <span className={styles.priceUnit}>ج.م / ساعة</span>
            </div>
          </div>

          <motion.div whileTap={{ scale: 0.94 }}>
            <Link href={`/courts/${court.id}`} className={styles.bookBtn}>
              <span>عرض المواعيد</span>
              <span className={styles.arrowIcon}>→</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}
