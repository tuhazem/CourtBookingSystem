'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated } from '@/lib/auth';
import { fetchDashboardStats } from '@/lib/api';
import { DashboardPeriod, DashboardStatsDto } from '@/lib/types';
import AdminNavbar from '@/components/Admin/AdminNavbar';
import ErrorState from '@/components/ErrorState/ErrorState';
import styles from './page.module.css';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStatsDto | null>(null);
  const [period, setPeriod] = useState<DashboardPeriod>(DashboardPeriod.Today);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }

    const loadStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchDashboardStats(period);
        setStats(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('تعذر تحميل إحصائيات لوحة التحكم.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [router, period]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AdminNavbar />

      <main className={styles.main}>
        {/* Top Header Row */}
        <div className={styles.topRow}>
          <div className={styles.titleBlock}>
            <h1>نظرة عامة على أداء الملاعب</h1>
            <p>متابعة لحظية للإيرادات، وحجم الحجوزات، وأفضل العملاء</p>
          </div>

          {/* Period Selector Tabs */}
          <div className={styles.periodPills}>
            <button
              type="button"
              className={`${styles.periodBtn} ${period === DashboardPeriod.Today ? styles.periodBtnActive : ''}`}
              onClick={() => setPeriod(DashboardPeriod.Today)}
            >
              اليوم
            </button>
            <button
              type="button"
              className={`${styles.periodBtn} ${period === DashboardPeriod.ThisWeek ? styles.periodBtnActive : ''}`}
              onClick={() => setPeriod(DashboardPeriod.ThisWeek)}
            >
              هذا الأسبوع
            </button>
            <button
              type="button"
              className={`${styles.periodBtn} ${period === DashboardPeriod.ThisMonth ? styles.periodBtnActive : ''}`}
              onClick={() => setPeriod(DashboardPeriod.ThisMonth)}
            >
              هذا الشهر
            </button>
          </div>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={() => setPeriod(period)} />
        ) : loading ? (
          <div className={styles.statsGrid}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: '9rem',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-2xl)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            ))}
          </div>
        ) : (
          <div className={styles.statsGrid}>
            {/* Card 1: Revenue */}
            <div className={styles.statCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardLabel}>إجمالي الإيرادات المؤكدة</span>
                <div className={styles.iconCircle} style={{ backgroundColor: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>payments</span>
                </div>
              </div>
              <div className={styles.cardValueRow}>
                <span className={`${styles.cardValue} num-font`}>
                  {stats?.totalRevenue ?? 0}
                </span>
                <span className={styles.cardUnit}>ج.م</span>
              </div>
              <span className={styles.cardSub}>من الحجوزات المؤكدة فقط</span>
            </div>

            {/* Card 2: Confirmed Bookings */}
            <div className={styles.statCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardLabel}>الحجوزات المؤكدة</span>
                <div className={styles.iconCircle} style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>check_circle</span>
                </div>
              </div>
              <div className={styles.cardValueRow}>
                <span className={`${styles.cardValue} num-font`}>
                  {stats?.confirmedBookingsCount ?? 0}
                </span>
                <span className={styles.cardUnit}>حجز</span>
              </div>
              <span className={styles.cardSub}>حجوزات اعتمدتها الإدارة</span>
            </div>

            {/* Card 3: Cancelled Bookings */}
            <div className={styles.statCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardLabel}>الحجوزات الملغاة</span>
                <div className={styles.iconCircle} style={{ backgroundColor: 'var(--color-error-soft)', color: 'var(--color-error)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>cancel</span>
                </div>
              </div>
              <div className={styles.cardValueRow}>
                <span className={`${styles.cardValue} num-font`}>
                  {stats?.cancelledBookingsCount ?? 0}
                </span>
                <span className={styles.cardUnit}>حجز</span>
              </div>
              <span className={styles.cardSub}>تم إعادتها للجدول كمتاحة</span>
            </div>

            {/* Card 4: Top Customer */}
            <div className={styles.statCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardLabel}>الكابتن الأكثر حجزاً</span>
                <div className={styles.iconCircle} style={{ backgroundColor: 'var(--color-amber-soft)', color: 'var(--color-amber-dark)' }}>
                  ⭐
                </div>
              </div>
              <div className={styles.cardValueRow}>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-text-primary)' }}>
                  {stats?.topCustomerName || 'لا يوجد'}
                </span>
              </div>
              <span className={styles.cardSub}>
                بإجمالي {stats?.topCustomerBookingsCount ?? 0} حجوزات
              </span>
            </div>
          </div>
        )}

        {/* Quick Management Shortcuts */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
          الإجراءات السريعة
        </h2>

        <div className={styles.quickActions}>
          <Link href="/admin/bookings" className={styles.actionBanner}>
            <div>
              <h3 className={styles.actionTitle}>إدارة الحجوزات المعلقة</h3>
              <p className={styles.actionDesc}>
                مراجعة طلبات الحجز القادمة وتأكيدها أو إلغائها بنقرة واحدة
              </p>
            </div>
            <div className={styles.actionArrow}>←</div>
          </Link>

          <Link href="/admin/courts" className={styles.actionBanner}>
            <div>
              <h3 className={styles.actionTitle}>الملاعب والأسعار</h3>
              <p className={styles.actionDesc}>
                تعديل سعر الساعة، أو تعطيل الملاعب مؤقتاً لأعمال الصيانة
              </p>
            </div>
            <div className={styles.actionArrow}>←</div>
          </Link>
        </div>
      </main>
    </div>
  );
}
