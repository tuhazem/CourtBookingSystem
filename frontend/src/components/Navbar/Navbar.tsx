'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only apply active class after hydration to avoid SSR/client mismatch
  const isActive = (href: string) =>
    mounted && (href === '/' ? pathname === '/' : pathname === href);

  return (
    <header className={`${styles.header} hidden md:flex`}>
      <div className={styles.container}>
        {/* Brand Logo & Name */}
        <Link href="/" className={styles.brand}>
          <div className={styles.logoContainer}>
            {/* priority: above-fold LCP candidate — next/image auto-preloads */}
            <Image
              src="/images/logo.png"
              alt="شعار منصة ملعبنا"
              className={styles.logoImg}
              width={40}
              height={40}
              priority
            />
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
            className={`${styles.navLink} ${isActive('/') ? styles.navLinkActive : ''}`}
          >
            الملاعب
          </Link>
          <Link
            href="/about"
            className={`${styles.navLink} ${isActive('/about') ? styles.navLinkActive : ''}`}
          >
            عن ملعبنا
          </Link>
          <Link
            href="/support"
            className={`${styles.navLink} ${isActive('/support') ? styles.navLinkActive : ''}`}
          >
            الدعم
          </Link>
          <Link
            href="/partner"
            className={`${styles.navLink} ${isActive('/partner') ? styles.navLinkActive : ''}`}
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
