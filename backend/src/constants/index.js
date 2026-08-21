// Roles
const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  HOTEL_OWNER: 'hotel_owner',
  OPERATIONS: 'operations',
  SUPPORT_AGENT: 'support_agent',
};

// Guest tiers
const GUEST_TIERS = {
  WELCOME: 'Welcome',
  SILVER: 'Silver',
  GOLD: 'Gold',
  ELITE_BLACK: 'StayEase Elite Black',
};

// Booking statuses
const BOOKING_STATUS = {
  CONFIRMED: 'Confirmed',
  CHECKED_IN: 'Checked In',
  CHECKED_OUT: 'Checked Out',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No Show',
};

// Payment statuses
const PAYMENT_STATUS = {
  PENDING: 'Pending',
  PAID: 'Paid',
  REFUNDED: 'Refunded',
  PARTIALLY_REFUNDED: 'Partially Refunded',
  FAILED: 'Failed',
};

// Room statuses
const ROOM_STATUS = {
  AVAILABLE: 'Clean & Available',
  DIRTY: 'Dirty',
  OCCUPIED: 'Occupied',
  INSPECTED: 'Inspected',
  MAINTENANCE: 'Maintenance',
  BLOCKED: 'Blocked',
};

// Refund statuses
const REFUND_STATUS = {
  PENDING: 'Pending Approval',
  PROCESSING: 'Approved & Processing',
  COMPLETED: 'Completed',
  REJECTED: 'Rejected',
};

// ID proof types
const ID_PROOF_TYPES = ['Aadhaar Card', 'Passport', 'Voter ID', 'Driving License'];

// Payment methods
const PAYMENT_METHODS = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Corporate Account'];

// Payment gateways
const PAYMENT_GATEWAYS = ['Razorpay', 'Juspay', 'PayU', 'BillDesk', 'Stripe India'];

module.exports = {
  ADMIN_ROLES,
  GUEST_TIERS,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  ROOM_STATUS,
  REFUND_STATUS,
  ID_PROOF_TYPES,
  PAYMENT_METHODS,
  PAYMENT_GATEWAYS,
};
