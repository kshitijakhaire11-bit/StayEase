# StayEase — Architecture Decision Log

---

**DEC-001**
Decision: MongoDB (Mongoose) as primary database, not PostgreSQL.
Why: Existing models are all Mongoose schemas. Flexible document model suits hotel/room JSON structures well. No relational joins required.
Alternatives considered: PostgreSQL with Prisma
Impact: All queries use Mongoose ODM. No SQL.
Date: 2026-08-21

---

**DEC-002**
Decision: JWT-based stateless authentication (not sessions).
Why: SPA frontend doesn't use cookies/sessions. JWT enables horizontal scaling without shared session store. Existing env.js already defines JWT_SECRET + JWT_REFRESH_SECRET.
Alternatives considered: express-session + Redis
Impact: Access token 7d, refresh token 30d. Admin access token 8h (shorter for security).
Date: 2026-08-21

---

**DEC-003**
Decision: Admin 2FA implemented as two-step JWT. Step 1 returns a short-lived `pending_2fa` JWT (15 min). Step 2 validates PIN and returns a full-access JWT (8h).
Why: Stateless approach — no server-side session needed. The `pending_2fa` role in the JWT payload prevents using the step-1 token for protected routes.
Alternatives considered: Redis-stored temp token, cookie session
Impact: Admin middleware must reject tokens with role `pending_2fa`.
Date: 2026-08-21

---

**DEC-004**
Decision: No repository layer — services call Mongoose models directly.
Why: The project complexity does not justify a full repository abstraction. Adding repositories would add files with no clear benefit at this scale. If the DB ever changes, Mongoose queries are localized to service files.
Alternatives considered: Repository pattern with interface
Impact: Services import models directly.
Date: 2026-08-21

---

**DEC-005**
Decision: Payment processing is mocked in development. No real gateway integration in Phase 1.
Why: No Razorpay/Juspay credentials provided. The frontend has no real payment flow. Building mock payment processing allows the full booking flow to work end-to-end for development.
Alternatives considered: Razorpay test mode
Impact: Booking creation immediately sets paymentStatus to Paid in dev mode. A TODO is left for webhook integration.
Date: 2026-08-21

---

**DEC-006**
Decision: OTP delivery uses mock mode by default (logs to Winston). No Twilio/SMS integration in Phase 1.
Why: `otp.util.js` already has this pattern. OTP_MODE=mock in .env.example.
Alternatives considered: Twilio, AWS SNS, Airtel IQ
Impact: OTP code is always `482910` in mock mode. Switch OTP_MODE=real when provider is configured.
Date: 2026-08-21

---

**DEC-007**
Decision: Soft delete not implemented. `isActive: false` used for hotels and users instead of deletion.
Why: Data integrity — booking history must remain intact even if a hotel or user is deactivated. No `deletedAt` field needed at this scale.
Alternatives considered: mongoose-delete plugin, actual deletion
Impact: All GET queries filter `isActive: true` by default.
Date: 2026-08-21

---

**DEC-008**
Decision: Validators are implemented using express-validator chains in separate `validators/` files, not Joi/Zod schemas.
Why: express-validator is already a listed dependency. No new dep needed. Middleware pattern (array of checks + validate.middleware.js) is clean and testable.
Alternatives considered: Joi, Zod, Yup
Impact: Validators are arrays exported from validators/ files, spread into route definitions.
Date: 2026-08-21

---

**DEC-009**
Decision: Audit logging implemented synchronously within service calls, not via event emitter or queue.
Why: Simplicity. Audit log writes are fast (single Mongo insert). Async queue would add complexity without benefit at this scale.
Alternatives considered: EventEmitter, Bull queue, Kafka
Impact: Every admin mutation creates an AuditLog doc before returning. If audit insert fails, it logs a warning but does not fail the main operation.
Date: 2026-08-21

---

**DEC-010**
Decision: Hotel-scoped admin access checked at service layer, not middleware.
Why: The check requires knowing the hotelId of the target resource, which is only known after the route param is parsed. Middleware runs before that context is available.
Alternatives considered: Custom route-level middleware with hotelId injection
Impact: Services check `req.admin.hotelAccess === 'all' || req.admin.hotelAccess === resource.hotelId` for hotel_owner role.
Date: 2026-08-21

---

**DEC-011**
Decision: GST calculation: 18% total (9% CGST + 9% SGST). Platform fee: 5% of booking amount. Hotel payout: amount - platformFee.
Why: Derived from OverviewTab mock data showing these exact percentages and BookingsTab showing GST invoice with CGST+SGST split.
ASSUMPTION: TDS Section 194-O (1%) mentioned in analysis notes is not enforced in Phase 1 — omitted for simplicity.
Date: 2026-08-21

---

**DEC-012**
Decision: Seeder populates 15 hotels (matching frontend HOTELS_DATA), 4 admin users, and 3 offers. Does NOT seed bookings, transactions, or customers — those are created via API.
Why: Hotels and admins are static reference data. Bookings are transactional and should be created via POST /api/v1/bookings.
Date: 2026-08-21
