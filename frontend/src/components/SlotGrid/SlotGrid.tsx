'use client';

import { motion } from 'framer-motion';
import { SlotDto } from '@/lib/types';
import styles from './SlotGrid.module.css';

interface SlotGridProps {
  slots: SlotDto[];
  selectedSlot: SlotDto | null;
  onSelectSlot: (slot: SlotDto) => void;
}

export default function SlotGrid({ slots, selectedSlot, onSelectSlot }: SlotGridProps) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <div className={styles.titleRow}>
            <h2 className={styles.title}>اختر ميعاد الماتش ⏱️</h2>
            <span className={styles.hourBadge}>(الحجز ساعة كاملة)</span>
          </div>
          <p className={styles.subtitle}>
            المواعيد المخططة بالرمادي محجوزة مسبقاً، المتاح بالأخضر مستنيك!
          </p>
        </div>

        {/* Legend */}
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={styles.legendDotAvailable} />
            <span>متاح</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDotSelected}>✓</span>
            <span>مختار</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDotBooked} diagonal-stripes`} />
            <span>محجوز</span>
          </div>
        </div>
      </div>

      {/* 12-Slots Grid */}
      <motion.div
        className={styles.grid}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.03 },
          },
        }}
      >
        {slots.map((slot) => {
          const isSelected = selectedSlot?.startTime === slot.startTime;

          if (!slot.isAvailable) {
            return (
              <div
                key={slot.timeLabel}
                className={`${styles.slotBooked} diagonal-stripes`}
                title="هذا الموعد محجوز مسبقاً"
              >
                <div className={styles.slotInfo}>
                  <span className={`${styles.bookedTime} num-font`}>{slot.timeLabel}</span>
                  <span className={styles.bookedText}>
                    محجوز مسبقاً {slot.reservedBy ? `(${slot.reservedBy})` : ''}
                  </span>
                </div>
                <span className={styles.bookedBadge}>محجوز</span>
              </div>
            );
          }

          if (isSelected) {
            return (
              <motion.button
                key={slot.timeLabel}
                type="button"
                className={styles.slotSelected}
                onClick={() => onSelectSlot(slot)}
                layout
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              >
                <div className={styles.slotInfo}>
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={styles.selectedBadge}
                  >
                    اختيارك الحالي
                  </motion.span>
                  <span className={`${styles.slotTime} num-font`}>{slot.timeLabel}</span>
                </div>
                <div className={styles.checkIcon}>✓</div>
              </motion.button>
            );
          }

          return (
            <motion.button
              key={slot.timeLabel}
              type="button"
              className={styles.slotAvailable}
              onClick={() => onSelectSlot(slot)}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 450, damping: 20 }}
            >
              <div className={styles.slotInfo}>
                <span className={`${styles.slotTime} num-font`}>{slot.timeLabel}</span>
                <span className={styles.slotStatusText}>متاح للحجز</span>
              </div>
              <span className={styles.plusIcon}>+</span>
            </motion.button>
          );
        })}
      </motion.div>
    </section>
  );
}
