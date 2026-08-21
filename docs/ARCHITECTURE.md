# StayEase — Backend Architecture

## System Overview

```
┌─────────────────────────────────┐
│   React SPA (Vite + TypeScript) │  localhost:3000
│   Customer Portal + Admin Dash  │
└─────────────────┬───────────────┘
                  │ HTTP/JSON (REST)
                  │ Authorization: Bearer <jwt>
                  ▼
┌─────────────────────────────────┐
│   Express API Server            │  localhost:5000
│   /api/v1/*                     │
├─────────────────────────────────┤
│   Security Layer                │
│   helmet | cors | rate-limit    │
├─────────────────────────────────┤
│   Route Layer                   │
│   routes/                       │
├─────────────────────────────────┤
│   Middleware Layer               │
│   auth | validate | error       │
├─────────────────────────────────┤
│   Controller Layer               │
│   controllers/                  │
├─────────────────────────────────┤
│   Service Layer (Business Logic)│
│   services/                     │
├─────────────────────────────────┤
│   Data Access Layer             │
│   Mongoose Models               │
└─────────────────┬───────────────┘
                  │ Mongoose ODM
                  ▼
┌─────────────────────────────────┐
│   MongoDB                       │
│   stayease database             │
│   10 collections                │
└─────────────────────────────────┘
```

## Request Lifecycle

```
HTTP Request
  → Express Router (routes/)
    → Auth Middleware (protect / protectAdmin)
      → Role Middleware (requireRole)
        → Validation Middleware (express-validator + validate.js)
          → Controller (extract req, call service, send response)
            → Service (business logic, orchestration)
              → Mongoose Model (DB query)
                → MongoDB
              ← Document
            ← Result
          ← ApiResponse.success() / ApiResponse.paginated()
        ← JSON Response
      ← (or ApiError → errorHandler → JSON error)
```

## Folder Structure

```
backend/src/
├── config/
│   ├── database.js     ✅ MongoDB connect
│   ├── env.js          ✅ Environment variables
│   └── logger.js       ✅ Winston logger
│
├── constants/
│   └── index.js        ✅ Enums and constants
│
├── models/             ✅ All 10 Mongoose models
│
├── middlewares/
│   ├── auth.middleware.js       → JWT customer auth
│   ├── adminAuth.middleware.js  → JWT admin auth + role check
│   ├── error.middleware.js      ✅ Centralized error handler
│   └── validate.middleware.js   ✅ express-validator runner
│
├── validators/         → Per-route validation chains (express-validator)
│   ├── auth.validators.js
│   ├── booking.validators.js
│   ├── offer.validators.js
│   └── review.validators.js
│
├── routes/             → HTTP method + path + middleware + controller mapping
│   ├── auth.routes.js
│   ├── admin.auth.routes.js
│   ├── hotel.routes.js
│   ├── booking.routes.js
│   ├── offer.routes.js
│   ├── review.routes.js
│   └── admin.routes.js
│
├── controllers/        → Thin: parse req, call service, send ApiResponse
│   ├── auth.controller.js
│   ├── admin.auth.controller.js
│   ├── hotel.controller.js
│   ├── booking.controller.js
│   ├── offer.controller.js
│   ├── review.controller.js
│   └── admin.controller.js
│
├── services/           → Business logic, transactions, orchestration
│   ├── auth.service.js
│   ├── admin.auth.service.js
│   ├── hotel.service.js
│   ├── booking.service.js
│   ├── offer.service.js
│   ├── review.service.js
│   └── admin.service.js
│
├── utils/              ✅ ApiError, ApiResponse, idGenerator, otp.util
│
├── seeders/
│   └── seed.js         → Hotel + AdminUser + Offer seeder
│
├── app.js              ✅ Express app bootstrap
└── server.js           ✅ DB connect + listen
```

## Authentication Architecture

### Customer JWT Flow
```
POST /api/v1/auth/login
  → Service validates credentials
  → Signs JWT { userId, email, role:'customer' } (7d)
  → Signs refreshToken (30d)
  → Returns { accessToken, refreshToken, user }

Subsequent requests:
  Authorization: Bearer <accessToken>
  → auth.middleware.js verifies JWT
  → Fetches User from DB (checks isActive)
  → Attaches to req.user
```

### Admin JWT Flow
```
POST /api/v1/admin/auth/login
  → Validates email+password
  → Returns { sessionToken } (short-lived 15min, role:pending_2fa)

POST /api/v1/admin/auth/verify-2fa
  → Validates sessionToken + PIN
  → Signs full JWT { adminId, email, role, hotelAccess } (8h)
  → Returns { accessToken, admin }

Admin requests:
  Authorization: Bearer <accessToken>
  → adminAuth.middleware.js verifies JWT, checks role !== 'pending_2fa'
  → Attaches req.admin
  → requireRole() checks role against allowed list
```

## Data Flow Examples

### Booking Creation
```
POST /api/v1/bookings
  → protect middleware (customer JWT)
  → validate (hotelId, checkIn, checkOut, adults, payment fields)
  → BookingController.create()
    → BookingService.createBooking()
      → Validate hotel exists (Hotel.findOne)
      → Calculate taxes (18% GST)
      → Generate bookingId + PNR
      → Create Booking doc (paymentStatus: Pending)
      → Create Transaction doc (status: Processing)
      → Mock payment processing → update paymentStatus: Paid
      → Update Transaction status: Captured & Settled
      → Update User.totalBookings++, totalSpend+=netPayable
      → Return booking
  → ApiResponse.created(res, booking)
```

### Admin Refund Approval
```
PATCH /api/v1/admin/refunds/:id/approve
  → protectAdmin middleware
  → requireRole('super_admin', 'support_agent')
  → AdminController.approveRefund()
    → AdminService.approveRefund()
      → Find Refund (must be Pending Approval)
      → Generate gatewayRefundRef
      → Update Refund.status = Completed
      → Update Booking.paymentStatus = Refunded, bookingStatus = Cancelled
      → Create AuditLog entry
  → ApiResponse.success()
```

## API Versioning
All routes prefixed with `/api/v1/`. Version is in the URL path.

## Pagination Convention
All list endpoints return:
```json
{
  "success": true,
  "message": "Success",
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```
Default: `page=1, limit=10`. Max: `limit=50`.
