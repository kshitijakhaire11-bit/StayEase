# StayEase — Project Context

## Project Name
StayEase Hotel Booking & Admin Dashboard

## Purpose
Production-grade hotel booking platform for luxury Indian properties. Dual-portal: customer-facing booking SPA + internal admin operations console.

## Target Users
- **Customers**: Indian travelers booking luxury hotel stays (OTP/email auth, loyalty tiers)
- **Admin Staff**: super_admin, hotel_owner, operations, support_agent roles

## Core Modules
1. Authentication (customer OTP + email/password; admin credentials + 2FA PIN)
2. Hotels & Rooms (search, filter, inventory, tape chart)
3. Bookings (create, status management, GST invoices)
4. Payments & Transactions (Razorpay/Juspay/PayU/BillDesk/Stripe India)
5. Refunds (SLA-driven approval workflow)
6. Offers & Promo Codes (tier-targeted, usage-capped)
7. Reviews (guest reviews + GM responses)
8. Admin CRM (customer profiles, loyalty points)
9. Analytics & Audit (revenue KPIs, immutable audit log)

## Technology Stack
- **Runtime**: Node.js (v18+)
- **Framework**: Express 4
- **Database**: MongoDB 7 via Mongoose 8
- **Auth**: JWT (access 7d + refresh 30d), bcryptjs password hashing
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit
- **Logging**: Winston (colorized dev, JSON production)
- **Testing**: Jest + Supertest

## Backend Architecture
```
Request → Express Route → Middleware (auth/validate) → Controller → Service → Repository → Mongoose Model → MongoDB
```

## Database
MongoDB. Database name: `stayease`. 10 collections: users, adminusers, hotels, rooms, bookings, transactions, refunds, offers, reviews, auditlogs.

## Authentication Strategy
- **Customer**: JWT Bearer token. Two paths: (1) mobile OTP flow, (2) email+password. OTP stored hashed in User doc with 10-min expiry + attempt counter.
- **Admin**: Two-step. Step 1: email+password → temp session token. Step 2: 6-digit PIN → full JWT. Role encoded in JWT payload.

## Authorization Strategy
- Customer middleware: `protect` — verifies JWT, attaches `req.user`
- Admin middleware: `protectAdmin` — verifies JWT, attaches `req.admin`, checks `isActive`
- Role middleware: `requireRole(...roles)` — checks `req.admin.role` against allowed list
- Hotel-scoped access: hotel_owner restricted to their `hotelAccess` property

## Important Integrations
- OTP delivery: mock mode (dev) / Twilio or Airtel IQ (production — TODO)
- Payment gateway: mock processing (dev) / Razorpay webhook (production — TODO)

## Current Implementation Status
- Models: ✅ Complete (10 models)
- Config/utils/middleware: ✅ Complete
- Routes/controllers/services/validators: ❌ Not yet created
- Seeder: ❌ Not yet created
- Documentation: ✅ In progress

## Current Development Phase
Phase 1 — Core API implementation (auth → hotels → bookings → payments → offers → reviews → admin)

## Important Constraints
- OTP mock code: `482910` (configurable via `OTP_MOCK_CODE` env)
- GST: 18% (9% CGST + 9% SGST), SAC code `996311`, GSTIN `27AABCS9912K1Z9`
- Platform fee: 5% of booking amount
- Indian phone numbers: 10 digits, starting 6–9
- All monetary values in INR (paise not used — full rupees)
- Frontend uses static mock data; first integration points are auth + hotel search
