# StayEase — API Contract

Base URL: `http://localhost:5000/api/v1`

---

## Health

### GET /api/health
Auth: Public
Response: `{ success, message, environment, timestamp }`

---

## Customer Auth

### POST /api/v1/auth/register
Auth: Public
Request: `{ name, phone, email, password, dob?, language? }`
Response 201: `{ accessToken, refreshToken, user: { _id, name, email, phone, tier, loyaltyPoints } }`
Errors: 409 (email/phone exists), 422 (validation)

### POST /api/v1/auth/login
Auth: Public
Request: `{ email, password }`
Response 200: `{ accessToken, refreshToken, user }`
Errors: 401 (wrong credentials), 422 (validation)

### POST /api/v1/auth/send-otp
Auth: Public
Request: `{ phone? } | { email? }` (one required)
Response 200: `{ message: "OTP sent" }`
Errors: 404 (user not found for login OTP), 422

### POST /api/v1/auth/verify-otp
Auth: Public
Request: `{ identifier, otp }`
Response 200: `{ accessToken, refreshToken, user }`
Errors: 400 (invalid/expired OTP), 429 (too many attempts)

### POST /api/v1/auth/forgot-password
Auth: Public
Request: `{ identifier }` (phone or email)
Response 200: `{ message: "OTP sent to registered contact" }`
Errors: 404, 422

### POST /api/v1/auth/reset-password
Auth: Public
Request: `{ identifier, otp, newPassword }`
Response 200: `{ message: "Password reset successful" }`
Errors: 400 (invalid OTP), 422

### POST /api/v1/auth/refresh
Auth: Public
Request: `{ refreshToken }`
Response 200: `{ accessToken }`
Errors: 401 (invalid/expired refresh token)

### GET /api/v1/auth/me
Auth: Customer JWT
Response 200: `{ user: { _id, name, email, phone, tier, loyaltyPoints, totalBookings, totalSpend, city, dob, language, kycStatus } }`

---

## Admin Auth

### POST /api/v1/admin/auth/login
Auth: Public
Request: `{ email, password }`
Response 200: `{ sessionToken, admin: { name, email, role } }`
Errors: 401, 403 (inactive)

### POST /api/v1/admin/auth/verify-2fa
Auth: Bearer `sessionToken` (pending_2fa JWT)
Request: `{ pin }`
Response 200: `{ accessToken, admin: { _id, name, email, role, hotelAccess } }`
Errors: 401 (wrong PIN), 403

---

## Hotels (Public)

### GET /api/v1/hotels
Auth: Public
Query: `city?, minPrice?, maxPrice?, minRating?, amenities?(comma-separated), page?=1, limit?=10`
Response 200: paginated `{ data: Hotel[], pagination }`

### GET /api/v1/hotels/:hotelId
Auth: Public
Response 200: `{ data: Hotel }`
Errors: 404

---

## Bookings (Customer)

### POST /api/v1/bookings
Auth: Customer JWT
Request: `{ hotelId, roomType, checkIn, checkOut, nights, adults, children?, guestName, guestEmail, guestPhone, amount, paymentMethod, specialRequests?, idProofType?, offerCode? }`
Response 201: `{ data: { booking, transaction } }`
Errors: 404 (hotel), 422

### GET /api/v1/bookings
Auth: Customer JWT
Query: `page?=1, limit?=10`
Response 200: paginated `{ data: Booking[] }`

### GET /api/v1/bookings/:bookingId
Auth: Customer JWT
Response 200: `{ data: Booking }`
Errors: 404, 403 (not owner)

---

## Offers (Public)

### GET /api/v1/offers
Auth: Public
Query: `tier?, page?=1, limit?=10`
Response 200: paginated active+non-expired offers

### POST /api/v1/offers/validate
Auth: Public
Request: `{ code, amount }`
Response 200: `{ data: { code, discountType, discountValue, discount, finalAmount } }`
Errors: 404 (code not found), 400 (expired, min spend not met, usage limit)

---

## Reviews

### POST /api/v1/reviews
Auth: Customer JWT
Request: `{ hotelId, rating, comment, stayDate?, roomType?, tags?, subRatings? }`
Response 201: `{ data: Review }`

### GET /api/v1/reviews
Auth: Public
Query: `hotelId (required), page?=1, limit?=10`
Response 200: paginated `{ data: Review[] }`

---

## Admin — Bookings

### GET /api/v1/admin/bookings
Auth: Admin JWT
Query: `hotelId?, bookingStatus?, paymentStatus?, search?, page?=1, limit?=10`
Response 200: paginated

### POST /api/v1/admin/bookings
Auth: Admin JWT | Roles: super_admin, hotel_owner, operations
Request: Same shape as customer booking + admin override fields
Response 201: `{ data: Booking }`

### PATCH /api/v1/admin/bookings/:id/status
Auth: Admin JWT | Roles: super_admin, hotel_owner, operations
Request: `{ status }`
Response 200: `{ data: Booking }`

---

## Admin — Rooms

### GET /api/v1/admin/rooms
Auth: Admin JWT
Query: `hotelId (required), floor?, status?, page?=1, limit?=50`
Response 200: paginated

### POST /api/v1/admin/rooms
Auth: Admin JWT | Roles: super_admin, hotel_owner
Request: `{ hotelId, roomNumber, floor, type, tier, basePrice, features? }`
Response 201: `{ data: Room }`

### PATCH /api/v1/admin/rooms/:id/status
Auth: Admin JWT | Roles: super_admin, hotel_owner, operations
Request: `{ status }`
Response 200: `{ data: Room }`

---

## Admin — Customers

### GET /api/v1/admin/customers
Auth: Admin JWT
Query: `search?, tier?, page?=1, limit?=10`
Response 200: paginated

### PATCH /api/v1/admin/customers/:id/points
Auth: Admin JWT | Roles: super_admin, support_agent
Request: `{ points, reason? }`
Response 200: `{ data: { loyaltyPoints } }`

---

## Admin — Payments

### GET /api/v1/admin/payments
Auth: Admin JWT
Query: `gateway?, status?, page?=1, limit?=10`
Response 200: paginated transactions

---

## Admin — Refunds

### GET /api/v1/admin/refunds
Auth: Admin JWT
Query: `status?, page?=1, limit?=10`
Response 200: paginated

### PATCH /api/v1/admin/refunds/:id/approve
Auth: Admin JWT | Roles: super_admin, support_agent
Response 200: `{ data: Refund }`

### PATCH /api/v1/admin/refunds/:id/reject
Auth: Admin JWT | Roles: super_admin, support_agent
Response 200: `{ data: Refund }`

---

## Admin — Reviews

### GET /api/v1/admin/reviews
Auth: Admin JWT
Query: `hotelId?, page?=1, limit?=10`
Response 200: paginated

### PATCH /api/v1/admin/reviews/:id/respond
Auth: Admin JWT | Roles: super_admin, hotel_owner
Request: `{ message }`
Response 200: `{ data: Review }`

---

## Admin — Offers

### GET /api/v1/admin/offers
Auth: Admin JWT
Query: `isActive?, page?=1, limit?=10`
Response 200: paginated (includes inactive)

### POST /api/v1/admin/offers
Auth: Admin JWT | Roles: super_admin, hotel_owner
Request: `{ code, title, description?, discountType, discountValue, minSpend?, maxDiscount?, validFrom, validUntil, usageLimit?, applicableTier? }`
Response 201: `{ data: Offer }`

### PATCH /api/v1/admin/offers/:id/toggle
Auth: Admin JWT | Roles: super_admin, hotel_owner
Response 200: `{ data: { id, isActive } }`

---

## Admin — Analytics

### GET /api/v1/admin/analytics/overview
Auth: Admin JWT
Query: `hotelId?`
Response 200: `{ data: { totalRevenue, occupancyPct, adr, activeBookings, pendingRefunds, revenueByMonth[], cityDistribution[], paymentMix[] } }`

---

## Admin — Audit Logs

### GET /api/v1/admin/audit-logs
Auth: Admin JWT | Roles: super_admin
Query: `severity?, page?=1, limit?=20`
Response 200: paginated, newest first
