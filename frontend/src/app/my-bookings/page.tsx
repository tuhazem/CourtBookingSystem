'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getCustomerBookings,
  removeCustomerBooking,
  SavedCustomerBooking,
} from '@/lib/customerBookings';
import PageBadge from '@/components/PageBadge/PageBadge';
import styles from './my-bookings.module.css';


export default function MyBookingsPage() {
  const [hasMounted, setHasMounted] = useState(false);
  // Initialize bookings directly from localStorage (no setState in effect)
  const [bookings, setBookings] = useState<SavedCustomerBooking[]>(() => {
    if (typeof window !== 'undefined') {
      return getCustomerBookings();
    }
    return [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasMounted(true);
  }, []);

  const handleCopyCode = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRemove = (id: string) => {
    removeCustomerBooking(id);
    setBookings(getCustomerBookings());
  };

  const filteredBookings = bookings.filter((b) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    return (
      b.customerPhone.includes(term) ||
      b.id.toLowerCase().includes(term) ||
      b.courtName.toLowerCase().includes(term) ||
      b.customerName.toLowerCase().includes(term)
    );
  });

  const generateWhatsAppShare = (b: SavedCustomerBooking) => {
    const text = `⚽ دعوة ماتش كورة عبر منصة ملعبنا!
🏟️ الملعب: ${b.courtName}
📅 الموعد: ${b.bookingDate}
⏰ الساعة: ${b.timeLabel}
كابتن الحجز: ${b.customerName}
كود الحجز: #${b.id.slice(0, 8).toUpperCase()}
يلا يا رجالة الحضور قبل الميعاد بربع ساعة! 🏃‍♂️🔥`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  return (
    <main className={styles.pageContainer}>
      <header className={styles.header}>
        <PageBadge icon="confirmation_number" text="بوابة استعلام الحجوزات" />
        <h1 className={styles.title}>حجوزاتي ومبارياتي</h1>
        <p className={styles.subtitle}>
          تابع حالة حجوزاتك، تفاصيل الماتش القادم، وشارك الدعوة مع فريقك عبر الواتساب بضغطة واحدة.
        </p>
      </header>

      {/* Search & Filter Card */}
      <div className={styles.searchCard}>
        <div className={styles.searchInputs}>
          <div className={styles.inputWrapper}>
            <span className={`material-symbols-outlined ${styles.inputIcon}`}>search</span>
            <input
              type="text"
              placeholder="ابحث برقم التليفون، اسم الملعب أو كود الحجز..."
              className={styles.input}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className={styles.clearBtn}
            >
              مسح
            </button>
          )}
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>
          {hasMounted && `عدد الحجوزات المسجلة: ${bookings.length}`}
        </div>
      </div>

      {/* Bookings List */}
      {!hasMounted ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text-muted)' }}>
          جارٍ تحميل الحجوزات...
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className={styles.bookingsList}>
          <AnimatePresence>
            {filteredBookings.map((b) => {
              const deposit = b.depositAmount || b.pricePerHour * 0.5;
              const remaining = b.pricePerHour - deposit;

              return (
                <motion.article
                  key={b.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={styles.bookingCard}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.courtInfo}>
                      <div className={styles.courtBadge}>
                        <Image 
                          src="/images/logo.png" 
                          alt="شعار ملعبنا" 
                          className={styles.courtBadgeLogo}
                          width={40}
                          height={40}
                        />
                      </div>
                      <div>
                        <h2 className={styles.courtName}>{b.courtName}</h2>
                        <div className={styles.bookingCode}>
                          <span>كود الحجز:</span>
                          <strong>#{b.id.slice(0, 8).toUpperCase()}</strong>
                        </div>
                      </div>
                    </div>

                    <div className={styles.statusRow}>
                      {b.status === 'Confirmed' ? (
                        <span className={styles.statusConfirmed}>
                          <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>
                            check_circle
                          </span>
                          <span>مؤكد</span>
                        </span>
                      ) : b.status === 'Cancelled' ? (
                        <span className={styles.statusCancelled}>
                          <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>
                            cancel
                          </span>
                          <span>ملغي</span>
                        </span>
                      ) : (
                        <span className={styles.statusPending}>
                          <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>
                            hourglass_top
                          </span>
                          <span>قيد الانتظار</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.cardDetails}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>
                        <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>
                          calendar_month
                        </span>
                        <span>التاريخ</span>
                      </span>
                      <span className={styles.detailValue}>{b.bookingDate}</span>
                    </div>

                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>
                        <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>
                          schedule
                        </span>
                        <span>الوقت</span>
                      </span>
                      <span className={styles.detailValue}>{b.timeLabel}</span>
                    </div>

                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>
                        <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>
                          person
                        </span>
                        <span>الكابتن</span>
                      </span>
                      <span className={styles.detailValue}>{b.customerName}</span>
                    </div>

                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>
                        <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>
                          phone_iphone
                        </span>
                        <span>الهاتف</span>
                      </span>
                      <span className={styles.detailValue} dir="ltr">{b.customerPhone}</span>
                    </div>

                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>
                        <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>
                          payments
                        </span>
                        <span>العربون</span>
                      </span>
                      <span className={styles.detailValue} style={{ color: 'var(--color-primary)' }}>
                        {deposit} ج.م
                      </span>
                    </div>

                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>
                        <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>
                          account_balance_wallet
                        </span>
                        <span>المتبقي</span>
                      </span>
                      <span className={styles.detailValue}>{remaining} ج.م</span>
                    </div>
                  </div>

                  <div className={styles.cardActions}>
                    <div className={styles.actionBtnGroup}>
                      <a
                        href={generateWhatsAppShare(b)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.whatsappShareBtn}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
                          share
                        </span>
                        <span>مشاركة</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => handleCopyCode(b.id)}
                        className={styles.actionBtn}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>
                          content_copy
                        </span>
                        <span>{copiedId === b.id ? 'تم ✓' : 'نسخ'}</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(b.id)}
                      className={`${styles.actionBtn} ${styles.removeBtn}`}
                      title="إزالة هذا الحجز"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>
                        delete
                      </span>
                      <span>إزالة</span>
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIllustration}>
            <Image 
              src="/images/logo.png" 
              alt="ملعبنا" 
              className={styles.emptyLogo}
              width={120}
              height={120}
              priority
            />
          </div>
          <h2 className={styles.emptyTitle}>
            {searchTerm ? 'لم يتم العثور على حجوزات مطابقة' : 'لسه معندكش أي حجوزات مسجلة'}
          </h2>
          <p className={styles.emptyDesc}>
            {searchTerm
              ? 'تأكد من كتابة رقم الهاتف أو كود الحجز بشكل صحيح.'
              : 'احجز كورتك في أفضل الملاعب المعتمدة بنجيل تركي وإضاءة ليلية ممتازة، وسجل ماتشاتك هنا لمتابعتها.'}
          </p>
          <Link href="/" className={styles.ctaBtn}>
            <span className="material-symbols-outlined">sports_soccer</span>
            <span>تصفح الملاعب واحجز الآن</span>
          </Link>
        </div>
      )}
    </main>
  );
}
