'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import { CourtDto, SlotDto } from '@/lib/types';
import { fetchAvailableSlots } from '@/lib/api';
import DateStrip from '@/components/DateStrip/DateStrip';
import SlotGrid from '@/components/SlotGrid/SlotGrid';
import FloatingSummary from '@/components/FloatingSummary/FloatingSummary';
import { SlotsSkeleton } from '@/components/Skeleton/Skeleton';

const BookingModal = dynamic(
  () => import('@/components/BookingModal/BookingModal'),
  { loading: () => null, ssr: false }
);

interface CourtDetailClientProps {
  court: CourtDto;
  courtId: number;
  initialSlots: SlotDto[];
}

export default function CourtDetailClient({ court, courtId, initialSlots }: CourtDetailClientProps) {
  const getTodayString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [slots, setSlots] = useState<SlotDto[]>(initialSlots);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadSlots = useCallback(async () => {
    setSlotsLoading(true);
    try {
      const data = await fetchAvailableSlots(courtId, selectedDate);
      setSlots(data);
      setSelectedSlot(null);
    } catch (err) {
      console.error('Failed to load slots:', err);
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, [courtId, selectedDate]);

  useEffect(() => {
    // Always reload slots when date changes (including returning to today)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadSlots();
  }, [loadSlots]);

  const handleSelectSlot = (slot: SlotDto) => {
    if (selectedSlot?.startTime === slot.startTime) {
      setSelectedSlot(null);
    } else {
      setSelectedSlot(slot);
    }
  };

  return (
    <>
      <DateStrip
        selectedDate={selectedDate}
        onSelectDate={(date) => setSelectedDate(date)}
      />

      {slotsLoading ? (
        <SlotsSkeleton />
      ) : (
        <SlotGrid
          slots={slots}
          selectedSlot={selectedSlot}
          onSelectSlot={handleSelectSlot}
        />
      )}

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

      <AnimatePresence>
        {isModalOpen && selectedSlot && (
          <BookingModal
            court={court}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            onClose={() => setIsModalOpen(false)}
            onBookingSuccess={() => loadSlots()}
          />
        )}
      </AnimatePresence>
    </>
  );
}
