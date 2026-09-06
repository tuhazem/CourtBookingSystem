'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import styles from './DateStrip.module.css';

interface DateStripProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (dateString: string) => void;
}

export default function DateStrip({ selectedDate, onSelectDate }: DateStripProps) {
  const days = useMemo(() => {
    const list = [];
    const today = new Date();

    const arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const arabicMonths = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      let dayLabel = arabicDays[d.getDay()];
      if (i === 0) dayLabel = 'النهاردة';
      else if (i === 1) dayLabel = 'بكرة';

      const dateNumber = `${d.getDate()} ${arabicMonths[d.getMonth()]}`;

      list.push({
        dateStr,
        dayLabel,
        dateNumber,
        isToday: i === 0,
      });
    }

    return list;
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.headerRow}>
        <div className={styles.titleGroup}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.35rem', color: 'var(--color-primary)' }}>
            calendar_today
          </span>
          <h2 className={styles.sectionTitle}>اختر يوم الماتش</h2>
        </div>
        <span className={styles.monthBadge}>7 أيام متاحة للحجز</span>
      </div>

      <div className={`${styles.carousel} hide-scrollbar`}>
        {days.map((item) => {
          const isSelected = item.dateStr === selectedDate;

          return (
            <motion.button
              key={item.dateStr}
              type="button"
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 450, damping: 20 }}
              className={`${styles.dateItem} ${isSelected ? styles.dateItemActive : ''}`}
              onClick={() => onSelectDate(item.dateStr)}
            >
              {isSelected && (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={styles.activeBadge}
                >
                  محدد
                </motion.span>
              )}
              <span className={styles.dayLabel}>{item.dayLabel}</span>
              <span className={`${styles.dateNumber} num-font`}>{item.dateNumber}</span>
              <span className={styles.slotsIndicator}>
                {isSelected ? 'المتاح الآن' : 'مواعيد متاحة'}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
