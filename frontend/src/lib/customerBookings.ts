export interface SavedCustomerBooking {
  id: string;
  courtId: number;
  courtName: string;
  customerName: string;
  customerPhone: string;
  bookingDate: string;
  timeLabel: string;
  startTime: string;
  endTime: string;
  pricePerHour: number;
  depositAmount: number;
  createdAt: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
}

const STORAGE_KEY = 'malaabna_customer_bookings';

export function getCustomerBookings(): SavedCustomerBooking[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCustomerBooking(booking: SavedCustomerBooking): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getCustomerBookings();
    // Prepend new booking
    const updated = [booking, ...current.filter((b) => b.id !== booking.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to persist customer booking to localStorage', e);
  }
}

export function removeCustomerBooking(bookingId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getCustomerBookings();
    const updated = current.filter((b) => b.id !== bookingId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to remove booking from localStorage', e);
  }
}
