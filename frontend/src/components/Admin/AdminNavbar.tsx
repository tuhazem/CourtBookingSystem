'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearAuth, getAuthUser } from '@/lib/auth';
import styles from './AdminNavbar.module.css';

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  // Initialize user state directly from getAuthUser (no setState in effect)
  const [user, setUser] = useState<{ username: string; role: string } | null>(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      return getAuthUser();
    }
    return null;
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    // Sync user state if needed after mount
    const currentUser = getAuthUser();
    if (JSON.stringify(currentUser) !== JSON.stringify(user)) {
      setUser(currentUser);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = () => {
    clearAuth();
    router.push('/admin/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brandSide}>
          <Link href="/admin" className={styles.brand}>
            <div className={styles.logoIcon}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>
                sports_soccer
              </span>
            </div>
            <div className={styles.brandText}>
              <span className={styles.brandName}>ملعبنا الإداري</span>
              <span className={styles.adminTag}>لوحة التحكم</span>
            </div>
          </Link>

          <nav className={styles.navLinks} aria-label="التنقل الإداري">
            <Link
              href="/admin"
              className={`${styles.navLink} ${pathname === '/admin' ? styles.navLinkActive : ''}`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>
                monitoring
              </span>
              <span>الإحصائيات</span>
            </Link>

            <Link
              href="/admin/bookings"
              className={`${styles.navLink} ${pathname === '/admin/bookings' ? styles.navLinkActive : ''}`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>
                pending_actions
              </span>
              <span>الحجوزات المعلقة</span>
            </Link>

            <Link
              href="/admin/courts"
              className={`${styles.navLink} ${pathname === '/admin/courts' ? styles.navLinkActive : ''}`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>
                stadium
              </span>
              <span>الملاعب والأسعار</span>
            </Link>
          </nav>
        </div>

        <div className={styles.actionsSide}>
          {mounted && user && (
            <div className={styles.userBadge}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.125rem', color: 'var(--color-primary)' }}>
                account_circle
              </span>
              <span className={styles.userName}>{user.username}</span>
              <span className={styles.userRole}>({user.role})</span>
            </div>
          )}

          <Link href="/" target="_blank" className={styles.clientLink} title="فتح واجهة العميل">
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
              open_in_new
            </span>
            <span>واجهة العميل</span>
          </Link>

          <button type="button" onClick={handleLogout} className={styles.logoutBtn} title="تسجيل الخروج">
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
              logout
            </span>
            <span>خروج</span>
          </button>
        </div>
      </div>
    </header>
  );
}
