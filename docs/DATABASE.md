# StayEase — Database

## Database
MongoDB. Database: `stayease`. 10 collections.

## Collections & Key Fields

### users
Primary customer accounts.
- `_id` (ObjectId), `name`, `email` (unique, indexed), `phone` (indexed)
- `password` (bcrypt, select:false), `tier` (Welcome/Silver/Gold/StayEase Elite Black)
- `loyaltyPoints`, `totalBookings`, `totalSpend`
- OTP fields: `otp`, `otpExpiresAt`, `otpAttempts`, `passwordResetOtp`, `passwordResetExpiresAt` (all select:false)
- `kycStatus`, `city`, `dob`, `language`, `favoriteHotel`, `dietaryPreference`, `specialPreferences[]`, `tags[]`
- `isActive` (default true), `createdAt`, `updatedAt`

### adminusers
Admin staff accounts.
- `_id`, `name`, `email` (unique), `password` (select:false), `pin` (bcrypt, select:false)
- `role` (super_admin/hotel_owner/operations/support_agent), `hotelAccess` (default 'all')
- `requires2FA`, `isActive`, `lastLogin`

### hotels
Hotel properties (reference data, seeded).
- `hotelId` (unique string, e.g. 'taj-lands-end'), `name`, `city` (indexed), `state`, `location`
- `rating`, `ratingLabel`, `reviewsCount`, `pricePerNight`
- `gallery[]`, `amenities[]`, `isVerified`, `isHighDemand`
- `roomsCount`, `isActive`
- Indexes: `{ city, pricePerNight }`, text index on `{ name, city, location }`

### rooms
Individual room units.
- `roomId` (unique), `hotelId` (indexed), `roomNumber`, `floor`, `type`, `tier`
- `basePrice`, `status` (6 states), `features[]`
- `assignedGuest`, `assignedBookingId`, `lastCleaned`, `housekeeper`
- Compound index: `{ hotelId, status }`

### bookings
Guest reservations.
- `bookingId` (unique, STE-XXXXXX), `pnr` (SE-CITY-XXXX)
- `hotelId` (indexed), `guestId` (ref: User, indexed)
- `checkIn`, `checkOut`, `nights`, `adults`, `children`
- `amount`, `taxes`, `discount`, `netPayable`
- `paymentStatus` (5 states), `bookingStatus` (5 states)
- `paymentMethod`, `paymentGateway`
- Compound index: `{ guestId, createdAt desc }`, index: `{ bookingStatus }`

### transactions
Payment records, one per booking.
- `txnId` (unique, TXN-XXXXXX), `bookingId` (indexed)
- `gateway`, `method`, `amount`, `gstAmount`, `platformFee`, `hotelPayout`
- `status` (Captured & Settled / Processing / Failed / Refund Reversal)
- `utrOrRrn`, `timestamp`

### refunds
Refund requests linked to cancelled bookings.
- `refundId` (unique, REF-YYYY-XXXX), `bookingId` (indexed)
- `refundAmount`, `cancellationPenalty`, `totalBookingAmount`
- `status` (4 states), `refundMethod` (3 options)
- `slaHoursLeft`, `gatewayRefundRef`, `processedBy`, `processedAt`

### offers
Promotional codes.
- `offerId` (unique), `code` (unique, uppercase, indexed)
- `discountType` (Percentage/Flat), `discountValue`, `minSpend`, `maxDiscount`
- `validFrom`, `validUntil`, `usageCount`, `usageLimit`
- `isActive` (indexed), `applicableTier`

### reviews
Guest reviews for hotels.
- `reviewId` (unique), `hotelId` (indexed), `guestId` (ref: User)
- `rating` (1–5), `subRatings` (cleanliness/service/location/value/amenities)
- `comment`, `tags[]`, `stayDate`, `roomType`
- `response` (respondedAt/responderName/message)
- Compound index: `{ hotelId, createdAt desc }`

### auditlogs
Immutable admin action log.
- `logId` (unique), `timestamp`, `user`, `role`, `action`, `entity`, `entityId`
- `ipAddress`, `severity` (info/warning/error)
- Index: `{ createdAt desc }`

## Important Queries

### Hotel Search
```js
Hotel.find({
  isActive: true,
  ...(city && { city: new RegExp(city, 'i') }),
  ...(minPrice && { pricePerNight: { $gte: minPrice } }),
  ...(maxPrice && { pricePerNight: { ...existing, $lte: maxPrice } }),
  ...(minRating && { rating: { $gte: minRating } }),
  ...(amenities && { amenities: { $all: amenitiesArray } }),
})
.skip((page - 1) * limit).limit(limit)
```

### Customer Bookings
```js
Booking.find({ guestId: req.user._id }).sort({ createdAt: -1 }).skip().limit()
```

### Admin Bookings (with search)
```js
Booking.find({
  ...(hotelId && { hotelId }),
  ...(bookingStatus && { bookingStatus }),
  ...(search && {
    $or: [
      { bookingId: new RegExp(search, 'i') },
      { pnr: new RegExp(search, 'i') },
      { guestName: new RegExp(search, 'i') },
      { guestPhone: new RegExp(search, 'i') },
    ]
  }),
}).sort({ createdAt: -1 }).skip().limit()
```

## Relationships
- `Booking.guestId` → `users._id`
- `Review.guestId` → `users._id`
- `Refund.bookingId` → `Booking.bookingId` (string ref, not ObjectId)
- `Transaction.bookingId` → `Booking.bookingId` (string ref)
- `Room.hotelId` → `Hotel.hotelId` (string ref)

## Soft Delete Strategy
- Hotels: `isActive: false` (excluded from public search)
- Users: `isActive: false` (login rejected)
- Rooms: `status: 'Blocked'` (excluded from availability)
- Bookings/Transactions/Refunds: no deletion — status transitions only
