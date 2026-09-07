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
        <motion.div 
          whileTap={{ scale: 0.9 }} 
          className={styles.tabIcon}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '1.75rem' }}>
            sports_soccer
          </span>
        </motion.div>
        <span>الملاعب</span>
      </Link>

      <Link
        href="/my-bookings"
        className={`${styles.tabItem} ${pathname === '/my-bookings' ? styles.tabItemActive : ''}`}
      >
        <motion.div 
          whileTap={{ scale: 0.9 }} 
          className={styles.tabIcon}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '1.75rem' }}>
            confirmation_number
          </span>
        </motion.div>
        <span>حجوزاتي</span>
      </Link>

      <Link
        href="/about"
        className={`${styles.tabItem} ${pathname === '/about' ? styles.tabItemActive : ''}`}
      >
        <motion.div 
          whileTap={{ scale: 0.9 }} 
          className={styles.tabIcon}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '1.75rem' }}>
            info
          </span>
        </motion.div>
        <span>عن ملعبنا</span>
      </Link>

      <Link
        href="/support"
        className={`${styles.tabItem} ${pathname === '/support' ? styles.tabItemActive : ''}`}
      >
        <motion.div 
          whileTap={{ scale: 0.9 }} 
          className={styles.tabIcon}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '1.75rem' }}>
            support_agent
          </span>
        </motion.div>
        <span>الدعم</span>
      </Link>
    </nav>
  );
}
