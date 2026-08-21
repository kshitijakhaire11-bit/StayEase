# StayEase — Backend Requirements

## Authentication

**REQ-001**
Description: Customers can register with name, phone, email, password, optional DOB and language.
Priority: High | Backend impact: POST /api/v1/auth/register, User model | Status: Pending

**REQ-002**
Description: Customers can log in via email + password.
Priority: High | Backend impact: POST /api/v1/auth/login | Status: Pending

**REQ-003**
Description: Customers can log in via mobile OTP (10-digit Indian number). OTP is 6 digits, valid 10 minutes, max 3 failed attempts.
Priority: High | Backend impact: POST /api/v1/auth/send-otp + POST /api/v1/auth/verify-otp | Status: Pending

**REQ-004**
Description: Customers can request password reset via mobile/email OTP flow (3 steps: identify → OTP → new password).
Priority: High | Backend impact: POST /api/v1/auth/forgot-password + POST /api/v1/auth/reset-password | Status: Pending

**REQ-005**
Description: Authenticated customers can refresh their access token using a refresh token.
Priority: Medium | Backend impact: POST /api/v1/auth/refresh | Status: Pending

**REQ-006**
Description: Authenticated customers can retrieve their own profile.
Priority: High | Backend impact: GET /api/v1/auth/me | Status: Pending

**REQ-007**
Description: Admin users authenticate via two steps: email+password then 6-digit PIN (2FA).
Priority: High | Backend impact: POST /api/v1/admin/auth/login + POST /api/v1/admin/auth/verify-2fa | Status: Pending

---

## Hotels

**REQ-008**
Description: Public endpoint to list/search hotels with filters: city (text match), minPrice, maxPrice, minRating, amenities (comma-separated), page, limit. Paginated response.
Priority: High | Backend impact: GET /api/v1/hotels | Status: Pending

**REQ-009**
Description: Public endpoint to get a single hotel by hotelId.
Priority: High | Backend impact: GET /api/v1/hotels/:hotelId | Status: Pending

**REQ-010**
Description: Admin can create a new hotel property.
Priority: Medium | Backend impact: POST /api/v1/admin/hotels | Status: Pending

**REQ-011**
Description: Admin can update hotel details.
Priority: Medium | Backend impact: PATCH /api/v1/admin/hotels/:hotelId | Status: Pending

---

## Rooms

**REQ-012**
Description: Admin can list rooms for a hotel, filterable by floor and status.
Priority: High | Backend impact: GET /api/v1/admin/rooms?hotelId=&floor=&status= | Status: Pending

**REQ-013**
Description: Admin can update room status (Clean & Available / Dirty / Occupied / Inspected / Maintenance / Blocked).
Priority: High | Backend impact: PATCH /api/v1/admin/rooms/:id/status | Status: Pending

**REQ-014**
Description: Admin can add a new room to a hotel.
Priority: Medium | Backend impact: POST /api/v1/admin/rooms | Status: Pending

---

## Bookings

**REQ-015**
Description: Authenticated customers can create a booking. System generates bookingId (STE-XXXXXX) and PNR (SE-{CITY}-{XXXX}), sets paymentStatus to Pending, bookingStatus to Confirmed.
Priority: High | Backend impact: POST /api/v1/bookings | Status: Pending

**REQ-016**
Description: Authenticated customers can list their own bookings.
Priority: High | Backend impact: GET /api/v1/bookings | Status: Pending

**REQ-017**
Description: Authenticated customers can view a single booking by bookingId.
Priority: High | Backend impact: GET /api/v1/bookings/:bookingId | Status: Pending

**REQ-018**
Description: Admin can list all bookings with filters: hotelId, bookingStatus, paymentStatus, search (by guest name/phone/PNR/bookingId), page, limit.
Priority: High | Backend impact: GET /api/v1/admin/bookings | Status: Pending

**REQ-019**
Description: Admin can update booking status (Check In, Check Out, Cancel, No Show).
Priority: High | Backend impact: PATCH /api/v1/admin/bookings/:id/status | Status: Pending

**REQ-020**
Description: Admin can create a walk-in (manual) booking.
Priority: High | Backend impact: POST /api/v1/admin/bookings | Status: Pending

---

## Payments & Transactions

**REQ-021**
Description: When a booking is created, a Transaction record is created with status Processing. Payment gateway mock processes immediately in dev mode, updating booking paymentStatus to Paid.
Priority: High | Backend impact: POST /api/v1/bookings (internal), Transaction model | Status: Pending

**REQ-022**
Description: Admin can list all transactions with filters: gateway, status, page, limit.
Priority: Medium | Backend impact: GET /api/v1/admin/payments | Status: Pending

---

## Refunds

**REQ-023**
Description: When admin cancels a booking, a Refund record is created with status Pending Approval. Cancellation penalty applied per business rules.
Priority: High | Backend impact: POST /api/v1/admin/refunds (internal from booking cancel) | Status: Pending

**REQ-024**
Description: Admin can approve a refund — sets status to Completed, updates booking paymentStatus to Refunded, creates audit log.
Priority: High | Backend impact: PATCH /api/v1/admin/refunds/:id/approve | Status: Pending

**REQ-025**
Description: Admin can reject a refund.
Priority: High | Backend impact: PATCH /api/v1/admin/refunds/:id/reject | Status: Pending

**REQ-026**
Description: Admin can list refunds with status filter.
Priority: Medium | Backend impact: GET /api/v1/admin/refunds | Status: Pending

---

## Offers

**REQ-027**
Description: Public endpoint to list active offers (isActive=true, not expired). Optionally filter by tier.
Priority: High | Backend impact: GET /api/v1/offers | Status: Pending

**REQ-028**
Description: Validate a promo code at checkout — returns discount type, value, min spend, and max discount.
Priority: High | Backend impact: POST /api/v1/offers/validate | Status: Pending

**REQ-029**
Description: Admin can create a new offer/promo code.
Priority: Medium | Backend impact: POST /api/v1/admin/offers | Status: Pending

**REQ-030**
Description: Admin can toggle an offer active/inactive.
Priority: Medium | Backend impact: PATCH /api/v1/admin/offers/:id/toggle | Status: Pending

**REQ-031**
Description: Admin can list all offers (including inactive).
Priority: Medium | Backend impact: GET /api/v1/admin/offers | Status: Pending

---

## Reviews

**REQ-032**
Description: Authenticated customers can submit a review with rating (1–5), sub-ratings, comment, tags.
Priority: Medium | Backend impact: POST /api/v1/reviews | Status: Pending

**REQ-033**
Description: Public endpoint to list reviews for a hotel, paginated.
Priority: Medium | Backend impact: GET /api/v1/reviews?hotelId= | Status: Pending

**REQ-034**
Description: Admin can view all reviews with hotel/status filters.
Priority: Medium | Backend impact: GET /api/v1/admin/reviews | Status: Pending

**REQ-035**
Description: Admin can post a GM response to a review.
Priority: Medium | Backend impact: PATCH /api/v1/admin/reviews/:id/respond | Status: Pending

---

## Admin — Customers

**REQ-036**
Description: Admin can list all customers with search (name/email/phone) and tier filter, paginated.
Priority: Medium | Backend impact: GET /api/v1/admin/customers | Status: Pending

**REQ-037**
Description: Admin can award loyalty points to a customer.
Priority: Low | Backend impact: PATCH /api/v1/admin/customers/:id/points | Status: Pending

---

## Admin — Analytics

**REQ-038**
Description: Admin overview returns KPIs: total revenue, occupancy %, ADR, active bookings count, pending refunds count, plus revenue trend data (8 months).
Priority: High | Backend impact: GET /api/v1/admin/analytics/overview | Status: Pending

---

## Admin — Audit

**REQ-039**
Description: Every admin mutation (booking status change, refund approve/reject, room status change, review response, offer toggle, points award) creates an immutable AuditLog entry.
Priority: High | Backend impact: AuditLog.create() in every admin service | Status: Pending

**REQ-040**
Description: Admin can list audit logs, paginated, newest first.
Priority: Medium | Backend impact: GET /api/v1/admin/audit-logs | Status: Pending

---

## System

**REQ-041**
Description: Health check endpoint returns server status, environment, and timestamp.
Priority: Low | Backend impact: GET /api/health (already implemented) | Status: Complete

**REQ-042**
Description: Database seeder populates hotels, admin users, sample offers, and sample bookings for development.
Priority: Medium | Backend impact: node src/seeders/seed.js | Status: Pending
