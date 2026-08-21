# StayEase — TODO

## Backend Implementation

### Authentication
- [x] Customer register (email + phone + password)
- [x] Customer login (email + password)
- [x] Customer mobile OTP send/verify
- [x] Customer forgot password / reset password
- [x] Customer token refresh
- [x] GET /auth/me
- [x] Admin login step 1 (email + password)
- [x] Admin login step 2 (2FA PIN)

### Hotels
- [x] GET /hotels (search + filter + pagination)
- [x] GET /hotels/:hotelId
- [x] Admin: create hotel
- [x] Admin: update hotel

### Rooms
- [x] Admin: list rooms (filter by hotelId, floor, status)
- [x] Admin: update room status
- [x] Admin: add room

### Bookings
- [x] POST /bookings (create with mock payment)
- [x] GET /bookings (customer own list)
- [x] GET /bookings/:bookingId
- [x] Admin: list all bookings
- [x] Admin: update booking status
- [x] Admin: create walk-in booking

### Payments
- [x] Transaction created on booking (Processing → Captured & Settled in mock mode)
- [x] Admin: list transactions
- [ ] Razorpay webhook handler (production TODO)
- [ ] Real payment gateway integration

### Refunds
- [x] Refund record created on booking cancellation
- [x] Admin: list refunds
- [x] Admin: approve refund
- [x] Admin: reject refund

### Offers
- [x] GET /offers (active, non-expired)
- [x] POST /offers/validate (coupon code check)
- [x] Admin: list all offers
- [x] Admin: create offer
- [x] Admin: toggle offer active/inactive

### Reviews
- [x] POST /reviews (authenticated)
- [x] GET /reviews?hotelId= (public)
- [x] Admin: list reviews
- [x] Admin: GM respond to review

### Admin — Customers
- [x] Admin: list customers
- [x] Admin: award loyalty points

### Admin — Analytics
- [x] GET /admin/analytics/overview (revenue KPIs)

### Admin — Audit
- [x] Audit log creation in all admin mutations
- [x] Admin: list audit logs

### Infrastructure
- [x] auth.middleware.js (customer JWT)
- [x] adminAuth.middleware.js (admin JWT + role)
- [x] Database seeder (hotels + admin users + offers)
- [x] README.md
- [ ] Real OTP provider (Twilio/Airtel IQ)
- [ ] Real payment gateway (Razorpay webhook)
- [ ] Rate limiting on auth routes (tighter limit)
- [ ] Unit tests (Jest)
- [ ] Integration tests (Supertest)
- [ ] GST e-invoice PDF generation
- [ ] WhatsApp/SMS booking confirmation

## Deferred / Future
- [ ] Social login (Google/Apple OAuth)
- [ ] Loyalty tier auto-upgrade logic (cron job)
- [ ] Dynamic rate engine (weekend surge multiplier)
- [ ] Multi-property hotel owner scoping (beyond single hotelAccess)
- [ ] File upload (hotel images, ID proof)
- [ ] CSV export endpoints (bookings, transactions)
