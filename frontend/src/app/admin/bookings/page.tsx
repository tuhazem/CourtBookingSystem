'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { fetchPendingBookings, confirmBooking, cancelBooking } from '@/lib/api';
import { PendingBookingDto } from '@/lib/types';
import AdminNavbar from '@/components/Admin/AdminNavbar';
import ErrorState from '@/components/ErrorState/ErrorState';
import styles from './page.module.css';

/**
 * Format TimeSpan e.g. "16:00:00" -> "04:00 م"
 */
function formatTime(time: string): string {
  if (!time) return '';
  const parts = time.split(':');
  let hour = parseInt(parts[0], 10);
  const minute = parts[1] || '00';
  const isPm = hour >= 12;
  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;
  const hourStr = hour.toString().padStart(2, '0');
  return `${hourStr}:${minute} ${isPm ? 'م' : 'ص'}`;
}

/**
 * Format ISO Date e.g. "2026-09-06T00:00:00" -> "الأحد، 6 سبتمبر 2026"
 */
function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-EG', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr.split('T')[0];
  }
}

export default function PendingBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<PendingBookingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const loadBookings = useCallback(async (isSilent: boolean = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const data = await fetchPendingBookings();
      setBookings(data || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('تعذر تحميل الحجوزات المعلقة.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    loadBookings();
  }, [router, loadBookings]);

  // Auto-dismiss notification after 4 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleConfirm = async (booking: PendingBookingDto) => {
    setActionLoadingId(booking.id);
    try {
      await confirmBooking(booking.id);
      setNotification({
        type: 'success',
        message: `تم اعتماد وتأكيد حجز الكابتن ${booking.customerName} بنجاح!`,
      });
      await loadBookings(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر تأكيد الحجز';
      setNotification({ type: 'error', message: msg });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancel = async (booking: PendingBookingDto) => {
    setActionLoadingId(booking.id);
    try {
      await cancelBooking(booking.id);
      setNotification({
        type: 'success',
        message: `تم إلغاء حجز ${booking.customerName} بنجاح وإعادة الموعد للجدول.`,
      });
      await loadBookings(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر إلغاء الحجز';
      setNotification({ type: 'error', message: msg });
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AdminNavbar />

      <main className={styles.main}>
        {/* Top Bar */}
        <div className={styles.topBar}>
          <div className={styles.titleBlock}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1>الحجوزات المعلقة</h1>
              <span
                style={{
                  backgroundColor: 'var(--color-amber-soft)',
                  color: 'var(--color-amber-dark)',
                  fontSize: '0.8125rem',
                  fontWeight: 800,
                  padding: '0.25rem 0.625rem',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                {bookings.length} في الانتظار ⏳
              </span>
            </div>
            <p>مراجعة طلبات الحجز القادمة من العملاء واعتمادها أو إلغائها فوراً</p>
          </div>

          <button
            type="button"
            className={styles.refreshBtn}
            onClick={() => loadBookings(true)}
            disabled={refreshing || loading}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: '1.125rem',
                transform: refreshing ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.4s ease',
              }}
            >
              refresh
            </span>
            <span>{refreshing ? 'جاري التحديث...' : 'تحديث القائمة'}</span>
          </button>
        </div>

        {/* Action Notifications */}
        {notification && (
          <div
            style={{
              padding: '0.875rem 1.25rem',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '1.5rem',
              fontWeight: 700,
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor:
                notification.type === 'success' ? 'var(--color-primary-soft)' : 'var(--color-error-soft)',
              color:
                notification.type === 'success' ? 'var(--color-primary-dark)' : 'var(--color-error)',
              border: `1px solid ${
                notification.type === 'success' ? 'rgba(0, 109, 55, 0.2)' : 'rgba(239, 68, 68, 0.2)'
              }`,
            }}
          >
            <span>{notification.message}</span>
            <button
              type="button"
              onClick={() => setNotification(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'inherit' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Content Body */}
        {error ? (
          <ErrorState message={error} onRetry={() => loadBookings()} />
        ) : loading ? (
          <div className={styles.tableCard} style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
              جاري جلب قائمة الحجوزات المعلقة من الخادم...
            </div>
          </div>
        ) : bookings.length === 0 ? (
          <div className={`${styles.tableCard} ${styles.emptyState}`}>
            <span className="material-symbols-outlined" style={{ fontSize: '3.5rem', color: 'var(--color-primary)', marginBottom: '1rem', display: 'inline-block' }}>
              event_available
            </span>
            <h3 className={styles.emptyTitle}>لا توجد حجوزات معلقة في الوقت الحالي</h3>
            <p className={styles.emptyDesc}>
              كل طلبات الحجز تم البت فيها، أو لم يتم إرسال طلبات جديدة بعد.
            </p>
          </div>
        ) : (
          <div className={styles.tableCard}>
            <div className={styles.tableResponsive}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>العميل</th>
                    <th className={styles.th}>الملعب</th>
                    <th className={styles.th}>التاريخ والموعد</th>
                    <th className={styles.th}>الإجراءات السريعة</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const isProcessing = actionLoadingId === booking.id;
                    const cleanPhone = booking.customerPhone.replace(/[^0-9]/g, '');

                    return (
                      <tr key={booking.id} className={styles.tr}>
                        {/* Customer */}
                        <td className={styles.td}>
                          <span className={styles.customerName}>{booking.customerName}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                            <a
                              href={`tel:${booking.customerPhone}`}
                              className={styles.phoneLink}
                              title="اتصال هاتفي"
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>
                                call
                              </span>
                              <span>{booking.customerPhone}</span>
                            </a>

                            <a
                              href={`https://wa.me/20${cleanPhone.replace(/^0+/, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: '#16a34a',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                textDecoration: 'none',
                              }}
                              title="محادثة واتساب"
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>
                                chat
                              </span>
                              <span>واتساب</span>
                            </a>
                          </div>
                        </td>

                        {/* Court */}
                        <td className={styles.td}>
                          <span className={styles.courtBadge}>{booking.courtName}</span>
                        </td>

                        {/* Date & Time */}
                        <td className={styles.td}>
                          <div style={{ fontWeight: 800, color: 'var(--color-text-primary)' }}>
                            {formatDate(booking.bookingDate)}
                          </div>
                          <div className={styles.timeText} style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                            <span className="num-font">{formatTime(booking.startTime)}</span>
                            <span style={{ margin: '0 0.375rem' }}>إلى</span>
                            <span className="num-font">{formatTime(booking.endTime)}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className={styles.td}>
                          <div className={styles.actionsGroup}>
                            <button
                              type="button"
                              className={styles.confirmBtn}
                              onClick={() => handleConfirm(booking)}
                              disabled={isProcessing}
                              title="تأكيد واعتماد الحجز"
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
                                check_circle
                              </span>
                              <span>{isProcessing ? 'جاري...' : 'تأكيد الحجز'}</span>
                            </button>

                            <button
                              type="button"
                              className={styles.cancelBtn}
                              onClick={() => handleCancel(booking)}
                              disabled={isProcessing}
                              title="إلغاء الحجز وإتاحة الموعد"
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
                                cancel
                              </span>
                              <span>إلغاء</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
