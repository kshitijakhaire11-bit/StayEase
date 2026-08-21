# PROJECT MEMORY

## Current State
- Phase: Active implementation — building routes/controllers/services
- Status: Middleware + validators done. Services/controllers/routes all MISSING.

## Completed
- All 10 Mongoose models (User, AdminUser, Hotel, Room, Booking, Transaction, Refund, Offer, Review, AuditLog)
- Config: env.js, database.js, logger.js
- Utils: ApiError, ApiResponse, idGenerator, otp.util
- Middlewares: error.middleware, validate.middleware, auth.middleware, adminAuth.middleware
- Validators: auth, booking, offer, review, admin
- Docs: all 13 context files

## In Progress
- auth.service.js → auth.controller.js → auth.routes.js + admin.auth.routes.js
- Then: hotel → booking → offer → review → admin (all services/controllers/routes)

## Important Decisions
- No repository layer — services call Mongoose models directly
- Admin 2FA: step-1 returns `pending_2fa` JWT (15min), step-2 returns full JWT (8h)
- Mock payments in dev: booking creation immediately marks payment Paid
- platform fee = 5%, GST = 18% (9% CGST + 9% SGST)
- JWT: customer 7d access / 30d refresh; admin 8h access
- express-validator for all input validation
- Soft delete: isActive:false for hotels/users; no deletion of bookings/transactions
- Audit logs created synchronously in every admin mutation service

## Important Constraints
- OTP mock code: 482910 (OTP_MODE=mock in .env)
- Indian phone: 10 digits starting 6–9
- Booking IDs: STE-XXXXXX, PNR: SE-{CITY}-{XXXX}, TXN: TXN-XXXXXX, Refund: REF-YYYY-XXXX
- GSTIN: 27AABCS9912K1Z9, SAC: 996311
- app.js already imports route files at fixed paths — must match exactly:
  - ./routes/auth.routes
  - ./routes/admin.auth.routes
  - ./routes/hotel.routes
  - ./routes/booking.routes
  - ./routes/offer.routes
  - ./routes/review.routes
  - ./routes/admin.routes

## Known Issues
- None yet

## Next Actions
1. auth.service.js
2. admin.auth.service.js
3. auth.controller.js + admin.auth.controller.js
4. auth.routes.js + admin.auth.routes.js
5. hotel.service.js + hotel.controller.js + hotel.routes.js
6. booking.service.js + booking.controller.js + booking.routes.js
7. offer.service.js + offer.controller.js + offer.routes.js
8. review.service.js + review.controller.js + review.routes.js
9. admin.service.js + admin.controller.js + admin.routes.js
10. seeders/seed.js
11. README.md
12. Verify server starts

## Project Structure (Separated)
```
StayEase/
├── frontend/    ← React 19 + TypeScript + Vite (src/, index.html, package.json, vite.config.ts, tsconfig.json)
├── backend/     ← Node.js + Express + MongoDB (src/, package.json, .env.example)
├── docs/        ← All AI context files
└── README.md
```
Run frontend: `cd frontend && npm run dev` (port 3000)
Run backend:  `cd backend && npm run dev`  (port 5000)

## Important Files
- backend/src/app.js — route imports (paths are fixed, must match)
- backend/src/utils/idGenerator.js — STE/TXN/REF/PNR generators
- backend/src/utils/otp.util.js — generateOtp, verifyOtp, sendOtp
- backend/src/constants/index.js — all enums
- backend/src/models/ — all 10 models
- frontend/src/App.tsx — SPA routing and screen state
- frontend/src/types.ts — Hotel, Screen, BookingDetails types
- frontend/src/data/hotels.ts — 15 seeder hotels (used by backend seed)
