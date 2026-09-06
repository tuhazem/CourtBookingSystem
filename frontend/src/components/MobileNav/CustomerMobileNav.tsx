'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './CustomerMobileNav.module.css';

export default function CustomerMobileNav() {
  const pathname = usePathname();

  // Don't show on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className={styles.bar} aria-label="شريط التنقل السفلي للموبايل">
      <Link
        href="/"
        className={`${styles.tabItem} ${pathname === '/' ? styles.tabItemActive : ''}`}
      >
        <motion.span whileTap={{ scale: 0.85 }} className={styles.tabIcon}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.375rem' }}>
            sports_soccer
          </span>
        </motion.span>
        <span>الملاعب</span>
      </Link>

      <Link
        href="/my-bookings"
        className={`${styles.tabItem} ${pathname === '/my-bookings' ? styles.tabItemActive : ''}`}
      >
        <motion.span whileTap={{ scale: 0.85 }} className={styles.tabIcon}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.375rem' }}>
            confirmation_number
          </span>
        </motion.span>
        <span>حجوزاتي</span>
      </Link>

      <Link
        href="/about"
        className={`${styles.tabItem} ${pathname === '/about' ? styles.tabItemActive : ''}`}
      >
        <motion.span whileTap={{ scale: 0.85 }} className={styles.tabIcon}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.375rem' }}>
            info
          </span>
        </motion.span>
        <span>عن ملعبنا</span>
      </Link>

      <Link
        href="/support"
        className={`${styles.tabItem} ${pathname === '/support' ? styles.tabItemActive : ''}`}
      >
        <motion.span whileTap={{ scale: 0.85 }} className={styles.tabIcon}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.375rem' }}>
            support_agent
          </span>
        </motion.span>
        <span>الدعم</span>
      </Link>

      <Link
        href="/admin"
        className={`${styles.tabItem} ${pathname === '/admin' ? styles.tabItemActive : ''}`}
      >
        <motion.span whileTap={{ scale: 0.85 }} className={styles.tabIcon}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.375rem' }}>
            settings
          </span>
        </motion.span>
        <span>الإدارة</span>
      </Link>
    </nav>
  );
}
