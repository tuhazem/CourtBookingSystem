/**
 * Types strictly derived from the .NET CourtBookingSystem API (Swagger & C# DTOs)
 */

export enum CourtType {
  Khomasy = 1,
  Sobaey = 2,
}

export interface CourtDto {
  id: number;
  name: string;
  type: CourtType;
  pricePerHour: number;
  isActive: boolean;
}

export interface SlotDto {
  timeLabel: string;
  startTime: string; // e.g. "12:00:00" (TimeSpan)
  endTime: string;   // e.g. "13:00:00" (TimeSpan)
  isAvailable: boolean;
  reservedBy: string | null;
}

export interface CreateBookingCommand {
  courtId: number;
  customerName: string;
  customerPhone: string;
  bookingDate: string; // ISO 8601 string: YYYY-MM-DDTHH:mm:ss
  startTime: string;   // TimeSpan string "HH:mm:ss"
  endTime: string;     // TimeSpan string "HH:mm:ss"
}

export interface CreateBookingResponse {
  message: string;
  bookingId: string; // UUID returned by .NET backend
}

/* =========================================================================
 * Admin & Management Types
 * ========================================================================= */

export interface AdminLoginCommand {
  username: string;
  password: string;
}

export interface AuthLoginDto {
  token: string;
  username: string;
  role: string;
}

export interface PendingBookingDto {
  id: string; // Guid
  customerName: string;
  customerPhone: string;
  bookingDate: string; // ISO DateTime
  startTime: string;   // TimeSpan "HH:mm:ss"
  endTime: string;     // TimeSpan "HH:mm:ss"
  courtName: string;
}

export enum DashboardPeriod {
  Today = 1,
  ThisWeek = 2,
  ThisMonth = 3,
}

export interface DashboardStatsDto {
  totalRevenue: number;
  confirmedBookingsCount: number;
  cancelledBookingsCount: number;
  topCustomerName: string;
  topCustomerBookingsCount: number;
}

export interface UpdateCourtPriceCommand {
  courtId: number;
  newPrice: number;
}

export interface ToggleCourtStatusCommand {
  courtId: number;
  isActive: boolean;
}

export interface CreateCourtCommand {
  name: string;
  type: CourtType;
  pricePerHour: number;
}

export interface ApiError {
  message: string;
  status?: number;
}
