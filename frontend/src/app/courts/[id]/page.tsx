'use client';

import { use, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import { CourtDto, CourtType, SlotDto } from '@/lib/types';
import { fetchCourts, fetchAvailableSlots } from '@/lib/api';
import DateStrip from '@/components/DateStrip/DateStrip';
import SlotGrid from '@/components/SlotGrid/SlotGrid';
import FloatingSummary from '@/components/FloatingSummary/FloatingSummary';
import BookingModal from '@/components/BookingModal/BookingModal';
import { SlotsSkeleton } from '@/components/Skeleton/Skeleton';
import ErrorState from '@/components/ErrorState/ErrorState';
import styles from './page.module.css';

export default function CourtDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const courtId = parseInt(resolvedParams.id, 10);

  // Initialize today's date in YYYY-MM-DD
  const getTodayString = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [court, setCourt] = useState<CourtDto | null>(null);
  const [courtLoading, setCourtLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [slots, setSlots] = useState<SlotDto[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<SlotDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load Court info
  const loadCourt = useCallback(async () => {
    setCourtLoading(true);
    try {
      const allCourts = await fetchCourts(false);
      const found = allCourts.find((c) => c.id === courtId);
      if (!found) {
        throw new Error(`الملعب رقم (${courtId}) غير موجود أو تم إيقافه.`);
      }
      setCourt(found);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('تعذر تحميل بيانات الملعب.');
      }
    } finally {
      setCourtLoading(false);
    }
  }, [courtId]);

  // Load Slots for selected date
  const loadSlots = useCallback(async () => {
    setSlotsLoading(true);
    try {
      const data = await fetchAvailableSlots(courtId, selectedDate);
      setSlots(data);
      // Reset selected slot if it becomes unavailable or date changed
      setSelectedSlot(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('تعذر تحميل مواعيد هذا اليوم.');
      }
    } finally {
      setSlotsLoading(false);
    }
  }, [courtId, selectedDate]);

  useEffect(() => {
    loadCourt();
  }, [loadCourt]);

  useEffect(() => {
    if (court) {
      loadSlots();
    }
  }, [court, loadSlots]);

  const handleSelectSlot = (slot: SlotDto) => {
    if (selectedSlot?.startTime === slot.startTime) {
      setSelectedSlot(null); // Toggle off
    } else {
      setSelectedSlot(slot);
    }
  };

  if (courtLoading) {
    return (
      <div className={styles.container}>
        <div style={{ height: '18rem', backgroundColor: '#e2e8f0', borderRadius: 'var(--radius-2xl)', marginBottom: '2rem' }} />
        <SlotsSkeleton />
      </div>
    );
  }

  if (error || !court) {
    return (
      <div className={styles.container}>
        <ErrorState
          title="تعذر تحميل الملعب"
          message={error || 'الملعب غير متوفر حالياً'}
          onRetry={() => {
            setError(null);
            loadCourt();
          }}
        />
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link href="/" className={styles.backBtn}>
            ← العودة لقائمة الملاعب
          </Link>
        </div>
      </div>
    );
  }

  const isKhomasy = court.type === CourtType.Khomasy;
  const typeText = isKhomasy ? 'ملعب خماسي' : 'ملعب سباعي';

  return (
    <div className={styles.container}>
      {/* Top Bar with Back Button */}
      <div className={styles.topBar}>
        <Link href="/" className={styles.backBtn}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>
            arrow_forward
          </span>
          <span>العودة للملاعب</span>
        </Link>
      </div>

      {/* Court Hero Card */}
      <section className={styles.courtHero}>
        <div className={styles.heroMedia}>
          {/* Pitch SVG Illustration */}
          <svg className={styles.heroSvg} viewBox="0 0 800 320" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="hero-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#047857" />
                <stop offset="100%" stopColor="#064e3b" />
              </linearGradient>
              <pattern id="hero-stripes" width="60" height="320" patternUnits="userSpaceOnUse">
                <rect width="30" height="320" fill="rgba(255,255,255,0.03)" />
              </pattern>
            </defs>
            <rect width="800" height="320" fill="url(#hero-grad)" />
            <rect width="800" height="320" fill="url(#hero-stripes)" />
            {/* Field lines */}
            <rect x="40" y="30" width="720" height="260" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" rx="6" />
            <line x1="400" y1="30" x2="400" y2="290" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
            <circle cx="400" cy="160" r="50" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
            <circle cx="400" cy="160" r="4" fill="rgba(255,255,255,0.8)" />
            <rect x="40" y="95" width="70" height="130" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
            <rect x="690" y="95" width="70" height="130" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
          </svg>

          {/* Price Overlay */}
          <div className={styles.priceTagOverlay}>
            <span className={styles.priceTagLabel}>سعر الساعة</span>
            <span className={`${styles.priceTagValue} num-font`}>{court.pricePerHour}</span>
            <span className={styles.priceTagUnit}> ج.م / ساعة</span>
          </div>

          {/* Title & Badges Overlay */}
          <div className={styles.heroContentOverlay}>
            <h1 className={styles.heroTitle}>{court.name}</h1>
            <div className={styles.heroTags}>
              <span className={styles.heroTag}>{typeText}</span>
              <span className={styles.heroTag}>متاح للحجز المباشر</span>
              <span className={styles.heroTag}>كرات تدريب متوفرة</span>
            </div>
          </div>
        </div>

        {/* Perks Bar */}
        <div className={styles.perksBar}>
          <div className={styles.perksList}>
            <span><span className={styles.perkCheck}>✓</span> إضاءة ليلية قوية</span>
            <span><span className={styles.perkCheck}>✓</span> غرف تبديل ملابس</span>
            <span><span className={styles.perkCheck}>✓</span> مياه ومشروبات</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            الحجز المباشر عبر المنصة بدون أي رسوم إضافية
          </span>
        </div>
      </section>

      {/* Date Carousel Strip */}
      <DateStrip
        selectedDate={selectedDate}
        onSelectDate={(date) => setSelectedDate(date)}
      />

      {/* 12-Slot Hourly Grid */}
      {slotsLoading ? (
        <SlotsSkeleton />
      ) : (
        <SlotGrid
          slots={slots}
          selectedSlot={selectedSlot}
          onSelectSlot={handleSelectSlot}
        />
      )}

      {/* Sticky Bottom Summary Bar with Smooth Spring Animation */}
      <AnimatePresence>
        {selectedSlot && (
          <FloatingSummary
            courtName={court.name}
            pricePerHour={court.pricePerHour}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            onProceed={() => setIsModalOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* Booking Modal with AnimatePresence */}
      <AnimatePresence>
        {isModalOpen && selectedSlot && (
          <BookingModal
            court={court}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            onClose={() => setIsModalOpen(false)}
            onBookingSuccess={() => {
              // Refresh slots so the newly reserved slot becomes disabled/booked
              loadSlots();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
