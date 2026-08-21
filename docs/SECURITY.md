# StayEase — Security

## Authentication
- Customer: JWT Bearer token. Secret via `JWT_SECRET` env var. Access token 7d, refresh token 30d.
- Admin: Two-step JWT. Step 1 `pending_2fa` JWT (15min). Step 2 full JWT (8h).
- Never return passwords, OTPs, PINs, or JWT secrets in API responses.
- JWT payload: `{ userId/adminId, email, role }` — minimal claims only.

## Password Hashing
- bcryptjs with cost factor 12 for customer passwords.
- bcryptjs with cost factor 10 for admin PINs (shorter value, slightly less expensive).
- Mongoose `select: false` on `password`, `otp`, `otpExpiresAt`, `otpAttempts`, `passwordResetOtp`, `passwordResetExpiresAt`, `pin`.

## JWT Handling
- Extract from `Authorization: Bearer <token>` header only.
- Verify with `jsonwebtoken.verify()` using the correct secret.
- On `JsonWebTokenError` or `TokenExpiredError`: return 401 (handled by error.middleware.js).
- Do NOT accept token from URL query params or cookies (simplicity + security).

## Role-Based Access Control
- Customer middleware (`protect`): only validates customer JWT; admin JWT is rejected.
- Admin middleware (`protectAdmin`): only validates admin JWT; customer JWT is rejected.
- `requireRole(...roles)`: validates `req.admin.role` is in the allowed list.
- hotel_owner: service layer checks `req.admin.hotelAccess` matches resource's hotelId.

## Input Validation
- All POST/PATCH endpoints use express-validator chains.
- `validate.middleware.js` collects errors and throws `ApiError.validation(422)`.
- Mongoose schema-level validation is a second-line defense.
- Never trust user-supplied `userId`, `guestId`, `role`, or `tier` — derive from JWT.

## Rate Limiting
- Global: 100 requests per 15 minutes per IP on `/api/`.
- Auth-specific: tighter rate limit (20 req/15min) on `/api/v1/auth/` and `/api/v1/admin/auth/`.

## CORS
- Origin restricted to `CORS_ORIGIN` env var (default: `http://localhost:3000`).
- Credentials: true. Methods: GET, POST, PUT, PATCH, DELETE.

## Security Headers
- `helmet()` applied globally — sets CSP, HSTS, X-Frame-Options, etc.

## Sensitive Data Handling
- Never log passwords, OTPs, tokens, or card data.
- Masked card/Aadhaar numbers stored as-received from client (e.g., `XXXX-XXXX-9421`).
- No actual card data stored — frontend handles payment tokenization (TODO: Razorpay).
- GSTIN and invoice data returned only to authenticated admins.

## Environment Secrets
- Never hardcode secrets. All via `.env` file.
- `.env` is in `.gitignore`. `.env.example` has placeholder values only.
- Minimum required: `JWT_SECRET`, `JWT_REFRESH_SECRET`, `MONGODB_URI`.

## Object-Level Authorization
- Customers can only read/update their own user profile (`req.user._id`).
- Customers can only read their own bookings (`guestId === req.user._id`).
- Admin hotel_owner can only access resources where `hotelId === req.admin.hotelAccess`.

## Injection Prevention
- Mongoose parameterized queries — no raw MongoDB query string injection.
- express-validator sanitizes user input before DB operations.
- No `eval()`, `Function()`, or dynamic query construction from user input.

## Error Information Leakage
- Stack traces only returned in non-production (`NODE_ENV !== 'production'`).
- Production errors show generic message for 500s: "Internal server error".
- Never expose Mongoose internals, DB credentials, or file paths.

## OTP Security
- OTP stored hashed (SHA-256 in production TODO — plain text in mock mode for simplicity).
- OTP expires after 10 minutes (`otpExpiresAt`).
- Max 3 failed attempts before requiring re-request (`otpAttempts`).
- Resend OTP resets attempts counter and generates new OTP.
