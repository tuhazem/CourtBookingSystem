import {
  CourtDto,
  SlotDto,
  CreateBookingCommand,
  CreateBookingResponse,
  AdminLoginCommand,
  AuthLoginDto,
  PendingBookingDto,
  DashboardPeriod,
  DashboardStatsDto,
  UpdateCourtPriceCommand,
  ToggleCourtStatusCommand,
  CreateCourtCommand,
} from './types';
import { getAuthToken } from './auth';

// TODO: Future enhancement - SignalR real-time updates

const API_BASE_URL = (() => {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!url) {
    throw new Error(
      '[CourtBookingSystem] NEXT_PUBLIC_API_BASE_URL is not set. ' +
      'Add it to your .env.local (local dev) or Vercel environment variables (production).'
    );
  }
  return url;
})();

/**
 * Helper to build auth headers with JWT Bearer token
 */
function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/* =========================================================================
 * Customer & Public Endpoints
 * ========================================================================= */

/**
 * Fetch all courts from the real backend API.
 */
export async function fetchCourts(isActiveOnly: boolean = true): Promise<CourtDto[]> {
  const url = `${API_BASE_URL}/Courts?isActiveOnly=${isActiveOnly}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`فشل تحميل الملاعب (${response.status}): ${errorText || 'تعذر الاتصال بالخادم'}`);
    }

    const data: CourtDto[] = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('تعذر الاتصال بخادم الملاعب. يرجى التأكد من تشغيل الـ API.');
  }
}

/**
 * Fetch 1-hour time slots for a given court and date.
 */
export async function fetchAvailableSlots(courtId: number, date: string): Promise<SlotDto[]> {
  const url = `${API_BASE_URL}/Bookings/available-slots?courtId=${courtId}&date=${encodeURIComponent(date)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`فشل تحميل المواعيد (${response.status}): ${errorText || 'تعذر تحميل الخانات'}`);
    }

    const data: SlotDto[] = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('تعذر تحميل مواعيد الملعب.');
  }
}

/**
 * Submit a new booking command to the backend.
 */
export async function createBooking(command: CreateBookingCommand): Promise<CreateBookingResponse> {
  const url = `${API_BASE_URL}/Bookings`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(command),
    });

    const responseData = await response.json().catch(() => null);

    if (!response.ok) {
      const message = responseData?.Error || responseData?.message || responseData?.title || 'تعذر إتمام الحجز. ربما الموعد محجوز بالفعل.';
      throw new Error(message);
    }

    return {
      message: responseData?.message || responseData?.Message || 'تم إنشاء الحجز بنجاح.',
      bookingId: responseData?.bookingId || responseData?.BookingId || '',
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('حدث خطأ غير متوقع أثناء إرسال الحجز.');
  }
}

/* =========================================================================
 * Admin Endpoints (JWT Protected)
 * ========================================================================= */

/**
 * Authenticate admin and receive JWT token
 */
export async function adminLogin(command: AdminLoginCommand): Promise<AuthLoginDto> {
  const url = `${API_BASE_URL}/Auth/Login`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(command),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const msg = data?.Error || data?.message || 'اسم المستخدم أو كلمة المرور غير صحيحة.';
      throw new Error(msg);
    }

    return {
      token: data.token || data.Token,
      username: data.username || data.Username,
      role: data.role || data.Role,
    };
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error('تعذر تسجيل الدخول.');
  }
}

/**
 * Fetch all pending bookings awaiting admin confirmation
 */
export async function fetchPendingBookings(): Promise<PendingBookingDto[]> {
  const url = `${API_BASE_URL}/Bookings/Pending-Bookings`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('تعذر جلب الحجوزات المعلقة. قد تكون الجلسة قد انتهت.');
    }

    return await response.json();
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error('فشل جلب الحجوزات المعلقة.');
  }
}

/**
 * Confirm a pending booking by ID
 */
export async function confirmBooking(bookingId: string): Promise<string> {
  const url = `${API_BASE_URL}/Bookings/confirm/${bookingId}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.Error || 'تعذر تأكيد الحجز.');
    }

    const text = await response.text();
    return text || 'تم تأكيد الحجز بنجاح.';
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error('فشل تأكيد الحجز.');
  }
}

/**
 * Cancel a booking by ID
 */
export async function cancelBooking(bookingId: string): Promise<string> {
  const url = `${API_BASE_URL}/Bookings/cancel/${bookingId}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.Error || 'تعذر إلغاء الحجز.');
    }

    const text = await response.text();
    return text || 'تم إلغاء الحجز بنجاح.';
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error('فشل إلغاء الحجز.');
  }
}

/**
 * Fetch dashboard statistics for a given period
 */
export async function fetchDashboardStats(period: DashboardPeriod = DashboardPeriod.Today): Promise<DashboardStatsDto> {
  const url = `${API_BASE_URL}/Bookings/admin/dashboard-stats?period=${period}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('تعذر تحميل إحصائيات لوحة التحكم.');
    }

    return await response.json();
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error('فشل تحميل الإحصائيات.');
  }
}

/**
 * Update court hourly rate
 */
export async function updateCourtPrice(command: UpdateCourtPriceCommand): Promise<string> {
  const url = `${API_BASE_URL}/Courts/Update-price`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(command),
    });

    if (!response.ok) {
      throw new Error('تعذر تحديث سعر الملعب.');
    }

    const data = await response.json().catch(() => null);
    return data?.message || data?.Message || 'تم تحديث السعر بنجاح.';
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error('فشل تحديث السعر.');
  }
}

/**
 * Toggle court active/maintenance status
 */
export async function toggleCourtStatus(command: ToggleCourtStatusCommand): Promise<string> {
  const url = `${API_BASE_URL}/Courts/Toggle-status`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(command),
    });

    if (!response.ok) {
      throw new Error('تعذر تغيير حالة الملعب.');
    }

    const data = await response.json().catch(() => null);
    return data?.message || data?.Message || 'تم تغيير حالة الملعب بنجاح.';
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error('فشل تغيير حالة الملعب.');
  }
}

/**
 * Register a new sports court
 */
export async function createCourt(command: CreateCourtCommand): Promise<string> {
  const url = `${API_BASE_URL}/Courts`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(command),
    });

    if (!response.ok) {
      throw new Error('تعذر إضافة الملعب الجديد.');
    }

    const data = await response.json().catch(() => null);
    return data?.message || data?.Message || 'تمت إضافة الملعب بنجاح.';
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error('فشل إضافة الملعب.');
  }
}
