'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Brand Logo & Name */}
        <Link href="/" className={styles.brand}>
          <div className={styles.logoContainer}>
            <img src="/images/logo.png" alt="شعار منصة ملعبنا" className={styles.logoImg} />
          </div>
          <div className={styles.brandText}>
            <div className={styles.brandTitleRow}>
              <span className={styles.brandName}>ملعبنا</span>
              <span className={styles.officialBadge}>رسمي</span>
            </div>
            <p className={styles.tagline}>احجز كورتك وعيش الماتش</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className={styles.navLinks} aria-label="التنقل الرئيسي">
          <Link
            href="/"
            className={`${styles.navLink} ${pathname === '/' ? styles.navLinkActive : ''}`}
          >
            الملاعب
          </Link>
          <Link
            href="/about"
            className={`${styles.navLink} ${pathname === '/about' ? styles.navLinkActive : ''}`}
          >
            عن ملعبنا
          </Link>
          <Link
            href="/support"
            className={`${styles.navLink} ${pathname === '/support' ? styles.navLinkActive : ''}`}
          >
            الدعم
          </Link>
          <Link
            href="/partner"
            className={`${styles.navLink} ${pathname === '/partner' ? styles.navLinkActive : ''}`}
          >
            انضم كشريك
          </Link>
        </nav>

        {/* Quick Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link href="/my-bookings" className={styles.supportBtn}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>
              confirmation_number
            </span>
            <span>حجوزاتي</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
