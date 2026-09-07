'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { CourtDto, SlotDto } from '@/lib/types';
import { createBooking } from '@/lib/api';
import { modalBackdropVariants, modalContentVariants } from '@/lib/animations';
import styles from './BookingModal.module.css';

interface BookingModalProps {
  court: CourtDto;
  selectedDate: string; // YYYY-MM-DD
  selectedSlot: SlotDto;
  onClose: () => void;
  onBookingSuccess?: () => void;
}

export default function BookingModal({
  court,
  selectedDate,
  selectedSlot,
  onClose,
  onBookingSuccess,
}: BookingModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successBookingId, setSuccessBookingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const deposit = court.pricePerHour * 0.5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName.trim()) {
      setErrorMsg('يرجى كتابة اسم كابتن الحجز');
      return;
    }

    const cleanPhone = customerPhone.replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg('يرجى إدخال رقم تليفون صحيح');
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingDateIso = `${selectedDate}T00:00:00`;

      const response = await createBooking({
        courtId: court.id,
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        bookingDate: bookingDateIso,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
      });

      setSuccessBookingId(response.bookingId);

      // Save to customer's device for easy lookup in /my-bookings
      try {
        const { saveCustomerBooking } = await import('@/lib/customerBookings');
        saveCustomerBooking({
          id: response.bookingId,
          courtId: court.id,
          courtName: court.name,
          customerName: customerName.trim(),
          customerPhone: cleanPhone,
          bookingDate: selectedDate,
          timeLabel: selectedSlot.timeLabel,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          pricePerHour: court.pricePerHour,
          depositAmount: deposit,
          createdAt: new Date().toISOString(),
          status: 'Pending',
        });
      } catch (saveErr) {
        console.warn('Could not save booking locally', saveErr);
      }

      if (onBookingSuccess) {
        onBookingSuccess();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('تعذر تأكيد الحجز. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (!successBookingId) return;
    navigator.clipboard.writeText(successBookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      variants={modalBackdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        variants={modalContentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={styles.modal}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.grabHandle} />
        <AnimatePresence mode="wait">
          {/* Success View */}
          {successBookingId ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className={styles.successContainer}
            >
              <motion.div
                className={styles.ballBadge}
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: [0, 1.15, 1], rotate: 0 }}
                transition={{ type: 'spring', stiffness: 450, damping: 16 }}
              >
                <Image 
                  src="/images/logo.png" 
                  alt="شعار ملعبنا" 
                  className={styles.modalLogoImg}
                  width={80}
                  height={80}
                  priority
                />
              </motion.div>

              <h2 className={styles.successTitle}>تم استلام وتأكيد طلب الحجز</h2>
              <p className={styles.successDesc}>
                طلبك وصل لإدارة الملعب وتأكد حجزك في النظام. احتفظ بكود الحجز للاستلام في الملعب.
              </p>

              <div className={styles.ticketCard}>
                <div className={styles.ticketHeader}>
                  <div className={styles.bookingCodeGroup}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      كود الحجز:
                    </span>
                    <span className={styles.bookingCodeText}>
                      #{successBookingId.slice(0, 8).toUpperCase()}
                    </span>
                  </div>

                  <motion.button
                    type="button"
                    onClick={handleCopyCode}
                    whileTap={{ scale: 0.92 }}
                    className={styles.copyBtn}
                  >
                    {copied ? 'تم النسخ' : 'نسخ الكود'}
                  </motion.button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>الملعب:</span>
                    <strong style={{ color: 'var(--color-text-primary)' }}>{court.name}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>الميعاد:</span>
                    <span style={{ fontWeight: 700 }}>
                      {selectedDate} | {selectedSlot.timeLabel}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>العربون المطلوب:</span>
                    <strong style={{ color: 'var(--color-primary)' }}>{deposit} ج.م</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border-light)' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>حالة الحجز:</span>
                    <span className={styles.statusPill}>
                      <span>⏳ بانتظار اعتماد الإدارة</span>
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                <a
                  href="/my-bookings"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.375rem',
                    padding: '0.875rem',
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border-medium)',
                    color: 'var(--color-text-primary)',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>confirmation_number</span>
                  <span>حجوزاتي</span>
                </a>
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  className={styles.doneBtn}
                  style={{ flex: 1.5 }}
                >
                  حجز موعد جديد
                </motion.button>
              </div>
            </motion.div>
          ) : (
            /* Booking Form View */
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className={styles.modalHeader}>
                <h3 className={styles.headerTitle}>
                  <span>بيانات كابتن الحجز</span>
                </h3>
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileTap={{ scale: 0.85 }}
                  className={styles.closeBtn}
                  aria-label="إغلاق"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>
                    close
                  </span>
                </motion.button>
              </div>

              {/* Match Summary Bar */}
              <div className={styles.summaryBox}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>الملعب المختار:</span>
                  <span className={styles.summaryValue}>{court.name}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>الميعاد:</span>
                  <span className={styles.summaryValue}>
                    {selectedDate} ({selectedSlot.timeLabel})
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>إجمالي السعر / العربون:</span>
                  <span className={styles.summaryValue}>
                    {court.pricePerHour} ج.م / عربون {deposit} ج.م
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.errorBanner}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>
                      error
                    </span>
                    <span>{errorMsg}</span>
                  </motion.div>
                )}

                {/* Name Field */}
                <div className={styles.fieldGroup}>
                  <label htmlFor="customerName" className={styles.label}>
                    اسم كابتن الحجز بالكامل <span className={styles.requiredStar}>*</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <span className={`material-symbols-outlined ${styles.inputIcon}`}>person</span>
                    <input
                      id="customerName"
                      type="text"
                      required
                      placeholder="مثال: أحمد محمد طارق"
                      className={styles.input}
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div className={styles.fieldGroup}>
                  <label htmlFor="customerPhone" className={styles.label}>
                    رقم التليفون (لإرسال تفاصيل الحجز) <span className={styles.requiredStar}>*</span>
                  </label>
                  <div className={styles.phoneContainer}>
                    <div className={styles.phonePrefix}>
                      <span>🇪🇬</span>
                      <span>+20</span>
                    </div>
                    <input
                      id="customerPhone"
                      type="tel"
                      required
                      placeholder="010 1234 5678"
                      className={styles.phoneInput}
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <span className={styles.helperText}>
                    هنبعتلك رسالة نصية عليها كود الحجز وتأكيد الموعد.
                  </span>
                </div>

                {/* Submit CTA */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitBtn}
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.97 } : {}}
                >
                  {isSubmitting ? (
                    <span>جارٍ إرسال الحجز للسيستم...</span>
                  ) : (
                    <>
                      <span>تأكيد وإرسال طلب الحجز</span>
                      <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>
                        arrow_back
                      </span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
