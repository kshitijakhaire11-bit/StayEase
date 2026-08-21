# StayEase — Validation Rules

## Customer Registration (POST /api/v1/auth/register)
| Field | Required | Rules |
|-------|----------|-------|
| name | Yes | String, trim, 2–100 chars |
| phone | Yes | String, trim, 10 digits, starts with 6–9 |
| email | Yes | Valid email format, lowercase |
| password | Yes | Min 8 chars |
| dob | No | ISO date string (YYYY-MM-DD) |
| language | No | String, max 50 chars |

## Customer Login (POST /api/v1/auth/login)
| Field | Required | Rules |
|-------|----------|-------|
| email | Yes | Valid email |
| password | Yes | Non-empty |

## Send OTP (POST /api/v1/auth/send-otp)
| Field | Required | Rules |
|-------|----------|-------|
| phone | Conditional | Required if email not provided |
| email | Conditional | Valid email if provided |
At least one of phone or email must be present.

## Verify OTP (POST /api/v1/auth/verify-otp)
| Field | Required | Rules |
|-------|----------|-------|
| identifier | Yes | Phone or email string |
| otp | Yes | Exactly 6 digits |

## Reset Password (POST /api/v1/auth/reset-password)
| Field | Required | Rules |
|-------|----------|-------|
| identifier | Yes | Phone or email |
| otp | Yes | 6 digits |
| newPassword | Yes | Min 8 chars |

## Admin Login (POST /api/v1/admin/auth/login)
| Field | Required | Rules |
|-------|----------|-------|
| email | Yes | Valid email |
| password | Yes | Non-empty |

## Admin 2FA (POST /api/v1/admin/auth/verify-2fa)
| Field | Required | Rules |
|-------|----------|-------|
| pin | Yes | Exactly 6 digits |

## Create Booking (POST /api/v1/bookings)
| Field | Required | Rules |
|-------|----------|-------|
| hotelId | Yes | Non-empty string |
| roomType | Yes | Non-empty string |
| checkIn | Yes | ISO date (YYYY-MM-DD), >= today |
| checkOut | Yes | ISO date, > checkIn |
| nights | Yes | Integer >= 1 |
| adults | Yes | Integer >= 1 |
| children | No | Integer >= 0, default 0 |
| guestName | Yes | 2–100 chars |
| guestEmail | Yes | Valid email |
| guestPhone | Yes | Non-empty string |
| amount | Yes | Number > 0 |
| paymentMethod | Yes | One of: UPI, Credit Card, Debit Card, Net Banking, Corporate Account |
| specialRequests | No | String, max 500 chars |
| idProofType | No | One of valid enum values |

## Create Offer (POST /api/v1/admin/offers)
| Field | Required | Rules |
|-------|----------|-------|
| code | Yes | Uppercase alphanumeric, 3–20 chars |
| title | Yes | 3–100 chars |
| discountType | Yes | Percentage or Flat |
| discountValue | Yes | Number > 0 |
| minSpend | No | Number >= 0 |
| validFrom | Yes | ISO date |
| validUntil | Yes | ISO date, > validFrom |
| usageLimit | No | Integer >= 1 |

## Validate Offer Code (POST /api/v1/offers/validate)
| Field | Required | Rules |
|-------|----------|-------|
| code | Yes | Non-empty string |
| amount | Yes | Number > 0 |

## Submit Review (POST /api/v1/reviews)
| Field | Required | Rules |
|-------|----------|-------|
| hotelId | Yes | Non-empty string |
| rating | Yes | Integer 1–5 |
| comment | Yes | 10–1000 chars |
| stayDate | No | ISO date |
| roomType | No | String |
| tags | No | Array of strings |
| subRatings.cleanliness | No | Number 1–5 |
| subRatings.service | No | Number 1–5 |
| subRatings.location | No | Number 1–5 |
| subRatings.value | No | Number 1–5 |

## Update Booking Status (PATCH /api/v1/admin/bookings/:id/status)
| Field | Required | Rules |
|-------|----------|-------|
| status | Yes | One of: Confirmed, Checked In, Checked Out, Cancelled, No Show |

## General Rules
- All string fields: trimmed, no HTML injection (sanitized by express-validator)
- Numeric fields: must be finite numbers, not NaN/Infinity
- All IDs in URL params: non-empty strings
- Pagination: page >= 1, limit 1–50 (default 10)
- Dates: ISO 8601 format (YYYY-MM-DD)
