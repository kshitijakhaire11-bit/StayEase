export type AdminRole = 'super_admin' | 'hotel_owner' | 'operations' | 'support_agent';

export type AdminTab = 
  | 'overview'
  | 'bookings'
  | 'inventory'
  | 'customers'
  | 'payments'
  | 'refunds'
  | 'reviews'
  | 'offers'
  | 'system';

export type BookingStatus = 'Confirmed' | 'Checked In' | 'Checked Out' | 'Cancelled' | 'No Show';
export type PaymentStatus = 'Paid' | 'Refunded' | 'Pending' | 'Partially Refunded' | 'Failed';
export type GuestTier = 'Silver' | 'Gold' | 'StayEase Elite Black';
export type RoomStatus = 'Clean & Available' | 'Dirty' | 'Occupied' | 'Inspected' | 'Maintenance' | 'Blocked';

export interface AdminBooking {
  id: string; // e.g. 'STE-849204'
  pnr: string;
  hotelId: string;
  hotelName: string;
  city: string;
  roomNumber: string;
  roomType: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestTier: GuestTier;
  idProofType: 'Aadhaar Card' | 'Passport' | 'Voter ID' | 'Driving License';
  idProofNumberMasked: string;
  idVerified: boolean;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  amount: number;
  taxes: number;
  discount: number;
  netPayable: number;
  paymentMethod: 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Corporate Account' | 'Direct PMS BillDesk' | string;
  paymentGateway: 'Razorpay' | 'Juspay' | 'PayU' | 'BillDesk' | 'Razorpay Route' | string;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  specialRequests: string;
  bookedAt: string;
  notes?: string;
}

export interface AdminRoom {
  id: string;
  roomNumber: string;
  floor: number;
  type: string;
  tier: 'Standard' | 'Deluxe' | 'Ocean Suite' | 'Presidential Villa';
  basePrice: number;
  status: RoomStatus;
  assignedGuest?: string;
  assignedBookingId?: string;
  lastCleaned?: string;
  housekeeper?: string;
  features: string[];
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  tier: GuestTier;
  totalBookings: number;
  totalSpend: number;
  loyaltyPoints: number;
  kycStatus: 'Verified (Aadhaar)' | 'Verified (Passport)' | 'Pending Verification' | string;
  joinedDate: string;
  lastStay: string;
  favoriteHotel: string;
  dietaryPreference: string;
  specialPreferences: string[];
  tags: string[];
}

export interface AdminTransaction {
  txnId: string;
  bookingId: string;
  guestName: string;
  gateway: 'Razorpay' | 'Juspay' | 'PayU' | 'BillDesk' | 'Stripe India' | string;
  method: string;
  amount: number;
  gstAmount: number;
  platformFee: number;
  hotelPayout: number;
  status: 'Captured & Settled' | 'Processing' | 'Failed' | 'Refund Reversal';
  utrOrRrn: string;
  timestamp: string;
}

export interface AdminRefund {
  refundId: string;
  bookingId: string;
  guestName: string;
  guestEmail: string;
  hotelName: string;
  totalBookingAmount: number;
  refundAmount: number;
  cancellationPenalty: number;
  reason: string;
  requestedAt: string;
  slaHoursLeft: number;
  status: 'Pending Approval' | 'Approved & Processing' | 'Completed' | 'Rejected';
  refundMethod: 'Instant UPI Reversal' | 'Source Card Reversal' | 'NEFT Bank Transfer';
  gatewayRefundRef?: string;
  processedBy?: string;
  processedAt?: string;
}

export interface AdminReview {
  id: string;
  hotelId: string;
  hotelName: string;
  city: string;
  guestName: string;
  guestTier: GuestTier;
  rating: number; // 1-5
  subRatings: {
    cleanliness: number;
    service: number;
    location: number;
    value: number;
    amenities?: number;
  };
  stayDate: string;
  roomType: string;
  comment: string;
  tags: string[];
  createdAt: string;
  response?: {
    respondedAt: string;
    responderName: string;
    message: string;
  };
}

export interface AdminOffer {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'Percentage' | 'Flat' | string;
  discountValue: number;
  minSpend: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageCount: number;
  usageLimit: number;
  isActive: boolean;
  applicableTier?: GuestTier | string;
}

export interface SystemServiceItem {
  name: string;
  category: string;
  status: 'Operational' | 'Degraded' | 'Incident' | string;
  latencyMs: number;
  uptime: string;
  lastChecked: string;
}

export interface AdminSystemStatus {
  overallHealth: string;
  uptimePct: number;
  services: SystemServiceItem[];
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  entity: string;
  entityId: string;
  ipAddress: string;
  severity: 'info' | 'warning' | 'error';
}
