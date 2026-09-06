'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './AdminMobileNav.module.css';

export default function AdminMobileNav() {
  const pathname = usePathname();

  // Only show on authenticated admin routes (not login)
  if (!pathname?.startsWith('/admin') || pathname === '/admin/login') {
    return null;
  }

  return (
    <nav className={styles.bar} aria-label="شريط التنقل السفلي للوحة الإدارة">
      <Link
        href="/admin"
        className={`${styles.tabItem} ${pathname === '/admin' ? styles.tabItemActive : ''}`}
      >
        <motion.span whileTap={{ scale: 0.85 }} className={styles.tabIcon}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.375rem' }}>
            monitoring
          </span>
        </motion.span>
        <span>الإحصائيات</span>
      </Link>

      <Link
        href="/admin/bookings"
        className={`${styles.tabItem} ${pathname === '/admin/bookings' ? styles.tabItemActive : ''}`}
      >
        <motion.span whileTap={{ scale: 0.85 }} className={styles.tabIcon}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.375rem' }}>
            pending_actions
          </span>
        </motion.span>
        <span>الحجوزات</span>
      </Link>

      <Link
        href="/admin/courts"
        className={`${styles.tabItem} ${pathname === '/admin/courts' ? styles.tabItemActive : ''}`}
      >
        <motion.span whileTap={{ scale: 0.85 }} className={styles.tabIcon}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.375rem' }}>
            stadium
          </span>
        </motion.span>
        <span>الملاعب</span>
      </Link>

      <Link href="/" target="_blank" className={styles.tabItem}>
        <motion.span whileTap={{ scale: 0.85 }} className={styles.tabIcon}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.375rem' }}>
            open_in_new
          </span>
        </motion.span>
        <span>العميل</span>
      </Link>
    </nav>
  );
}
