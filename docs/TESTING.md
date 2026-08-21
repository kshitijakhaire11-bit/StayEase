# StayEase — Testing Strategy

## Framework
Jest + Supertest (already in devDependencies)

## Test Structure
```
backend/tests/
├── unit/
│   ├── services/
│   │   ├── auth.service.test.js
│   │   ├── booking.service.test.js
│   │   └── offer.service.test.js
│   └── utils/
│       ├── idGenerator.test.js
│       └── otp.util.test.js
├── integration/
│   ├── auth.test.js
│   ├── hotels.test.js
│   ├── bookings.test.js
│   └── admin.test.js
└── fixtures/
    ├── users.js
    ├── hotels.js
    └── bookings.js
```

## Priority Test Areas

### Critical — Must Test
1. **Authentication**: register, login, OTP flow, token refresh, invalid token rejection
2. **Authorization**: customer cannot access admin routes; hotel_owner cannot access other hotel's data
3. **Booking creation**: price calculation, GST, booking ID generation
4. **Offer validation**: discount calculation, expired offer rejection, min spend enforcement
5. **Refund approval**: status transition validation, duplicate approval rejection

### Important
6. Hotel search filters (city, price range, rating, amenities)
7. OTP expiry and attempt counting
8. Admin 2FA two-step flow

### Coverage Targets
- Services: 80%+ coverage
- Controllers: integration test via Supertest
- Models: covered via service tests

## Test Setup
```js
// tests/setup.js
beforeAll(() => mongoose.connect(process.env.MONGODB_URI_TEST));
afterAll(() => mongoose.disconnect());
afterEach(() => db cleanup);
```

Environment: `.env.test` with `MONGODB_URI=mongodb://localhost:27017/stayease_test`, `OTP_MODE=mock`

## Running Tests
```bash
npm test                           # all tests
npm run test:integration           # integration only
npx jest --testPathPattern=auth    # specific module
npx jest --coverage                # with coverage report
```
