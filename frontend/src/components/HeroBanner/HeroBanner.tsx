'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { transitions } from '@/lib/animations';
import styles from './HeroBanner.module.css';

export default function HeroBanner() {
  return (
    <section className={styles.heroSection}>
      {/* Ambient Floating Glow Lights — opacity-only animation (compositor-safe, no repaint) */}
      <motion.div
        className={styles.glowBall1}
        animate={{
          opacity: [0.35, 0.55, 0.35],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className={styles.glowBall2}
        animate={{
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Branded Pitch Watermark — decorative, no priority needed */}
      <div className={styles.heroWatermark}>
        <Image
          src="/images/logo.png"
          alt=""
          aria-hidden="true"
          className={styles.watermarkImg}
          width={120}
          height={120}
        />
      </div>

      <div className={styles.content}>
        {/* Verified Badge */}
        <motion.div
          className={styles.verifiedPill}
          initial={{ opacity: 0, y: -15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={transitions.springSmooth}
        >
          <span className={`${styles.liveDot} animate-pulse`}></span>
          <span>حجز فوري ومؤكد 100% بدون وسيط</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitions.springBouncy, delay: 0.1 }}
        >
          جاهز للماتش القادم؟
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          ابحث عن أفضل ملاعب كرة القدم المعتمدة في منطقتك، واحجز موعدك فوراً بتأكيد مباشر وعربون مؤمن.
        </motion.p>

        {/* Quick Highlights */}
        <motion.div
          className={styles.quickPills}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <motion.div
            className={styles.quickPill}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem', color: '#6bfe9c' }}>
              verified
            </span>
            <span>ملاعب مفحوصة ومضمونة</span>
          </motion.div>

          <motion.div
            className={styles.quickPill}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem', color: '#6bfe9c' }}>
              schedule
            </span>
            <span>تأكيد الحجز فوراً</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
