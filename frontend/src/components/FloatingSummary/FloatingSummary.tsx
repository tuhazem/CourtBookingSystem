'use client';

import { motion } from 'framer-motion';
import { SlotDto } from '@/lib/types';
import { floatingBarVariants } from '@/lib/animations';
import styles from './FloatingSummary.module.css';

interface FloatingSummaryProps {
  courtName: string;
  pricePerHour: number;
  selectedDate: string;
  selectedSlot: SlotDto;
  onProceed: () => void;
}

export default function FloatingSummary({
  courtName,
  pricePerHour,
  selectedDate,
  selectedSlot,
  onProceed,
}: FloatingSummaryProps) {
  const deposit = pricePerHour * 0.5;

  return (
    <motion.div
      variants={floatingBarVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={styles.wrapper}
    >
      <div className={styles.bar}>
        <div className={styles.leftInfo}>
          <div className={styles.ballIcon}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>
              sports_soccer
            </span>
          </div>
          <div className={styles.details}>
            <div className={styles.slotTitle}>
              الميعاد المختار:{' '}
              <span className={styles.slotHighlight}>
                {selectedDate} ({selectedSlot.timeLabel})
              </span>
            </div>
            <div className={styles.priceBreakdown}>
              <span>{courtName}</span>
              <span>•</span>
              <span>
                الإجمالي:{' '}
                <strong className={`${styles.totalPrice} num-font`}>
                  {pricePerHour} ج.م
                </strong>
              </span>
              <span>•</span>
              <span className={styles.depositBadge}>
                العربون {deposit} ج.م فقط (50%)
              </span>
            </div>
          </div>
        </div>

        <motion.button
          type="button"
          onClick={onProceed}
          className={styles.ctaBtn}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        >
          <span>تأكيد ومتابعة الحجز</span>
          <span className="material-symbols-outlined" style={{ fontSize: '1.15rem' }}>
            arrow_back
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}
