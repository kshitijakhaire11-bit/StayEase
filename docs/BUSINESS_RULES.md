# StayEase — Business Rules

---

**BR-001**
Customer OTP expires after 10 minutes. After 3 failed OTP attempts, the account is locked for 2 minutes (OTP must be re-requested).

**BR-002**
Customer registration requires: full name, valid 10-digit Indian mobile number (starts 6–9), valid email, password minimum 8 characters. Date of birth is optional.

**BR-003**
Loyalty tier assignment:
- Welcome: New accounts (default)
- Silver: 2+ completed bookings (ASSUMPTION: upgrade logic runs post-checkout)
- Gold: 5+ completed bookings
- StayEase Elite Black: Manual admin assignment only

**BR-004**
Booking price calculation:
- taxes = round(amount * 0.18)   [18% GST = 9% CGST + 9% SGST]
- netPayable = amount + taxes - discount
- platformFee = round(amount * 0.05)
- hotelPayout = amount - platformFee

**BR-005**
A booking can only transition through these statuses:
- Confirmed → Checked In → Checked Out
- Confirmed → Cancelled
- Confirmed → No Show
- Checked In → Checked Out
- Checked In → Cancelled (exceptional, admin only)
Invalid transitions must be rejected by the service layer.

**BR-006**
When a booking is cancelled:
- A Refund record is created automatically.
- Cancellation penalty: 0 if cancelled > 48 hours before check-in. 1 night charge if 24–48 hours. Full booking amount if < 24 hours. (ASSUMPTION: simplified rule — record the penalty at time of cancellation.)
- refundAmount = netPayable - cancellationPenalty
- SLA for refund processing: 2 hours.

**BR-007**
Offers have usage limits (usageLimit). Once usageCount >= usageLimit, the offer cannot be applied even if isActive=true. Expired offers (validUntil < today) are excluded from public listing.

**BR-008**
Offer validation at checkout:
- Code must exist and be active.
- Today's date must be within validFrom–validUntil.
- Booking amount must be >= minSpend.
- If discountType=Percentage: discount = round(amount * discountValue / 100), capped at maxDiscount.
- If discountType=Flat: discount = discountValue.

**BR-009**
Reviews can only be submitted by authenticated customers. One review per booking (ASSUMPTION: enforced by checking for existing review with same guestId + hotelId + stayDate combination).

**BR-010**
Admin role access matrix:
- super_admin: full access to all resources, all hotels
- hotel_owner: read/write access to bookings, rooms, reviews, offers for their assigned hotel only
- operations: read/write access to rooms (status) and bookings (check-in/out only); read-only on customers
- support_agent: read/write on refunds; read-only on bookings and customers

**BR-011**
Admin must not be able to approve a refund that is not in "Pending Approval" status. Duplicate approvals must be rejected.

**BR-012**
Audit logs are immutable — no update or delete endpoint is exposed. Logs are created by services, not by direct API calls.

**BR-013**
Hotel search results only include hotels where `isActive=true`. Admins can see inactive hotels via admin endpoints.

**BR-014**
A customer's `totalBookings` and `totalSpend` counters are updated when a booking is created with Paid status.

**BR-015**
Phone numbers are stored normalized without spaces or country code prefix in the database. Display format (+91 XXXXX XXXXX) is the frontend's responsibility.
