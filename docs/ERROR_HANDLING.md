# StayEase — Error Handling

## Standard Error Response Format

```json
{
  "success": false,
  "message": "Human-readable error message",
  "code": "MACHINE_READABLE_CODE",
  "errors": []
}
```

`errors` array is only present when there are field-level validation errors.

## Error Codes

| HTTP | Code | Meaning |
|------|------|---------|
| 400 | BAD_REQUEST | Malformed request, invalid ID |
| 401 | UNAUTHORIZED | Missing or invalid JWT |
| 403 | FORBIDDEN | Authenticated but not authorized |
| 404 | NOT_FOUND | Resource does not exist |
| 409 | CONFLICT | Duplicate key (email/phone already registered) |
| 422 | VALIDATION_ERROR | Input validation failed |
| 429 | RATE_LIMIT_EXCEEDED | Too many requests |
| 500 | INTERNAL_ERROR | Unhandled server error |

## Validation Error Format

```json
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "errors": [
    { "field": "email", "message": "Must be a valid email", "value": "notanemail" },
    { "field": "phone", "message": "Phone must be 10 digits", "value": "123" }
  ]
}
```

## Centralized Error Handler

All errors flow through `errorHandler` in `middlewares/error.middleware.js`.

Handled automatically:
- `Mongoose.ValidationError` → 422 with per-field errors
- `Mongoose duplicate key (11000)` → 409 Conflict
- `Mongoose CastError (ObjectId)` → 400 Bad Request
- `JsonWebTokenError` → 401 Unauthorized
- `TokenExpiredError` → 401 Unauthorized
- Unhandled errors → 500 Internal Error

## Controller Pattern

Controllers use `try/catch` or `express-async-errors` pattern. All async errors passed to `next(err)`.

```js
const createBooking = async (req, res, next) => {
  try {
    const result = await bookingService.createBooking(req.user, req.body);
    ApiResponse.created(res, result, 'Booking created successfully');
  } catch (err) {
    next(err);
  }
};
```

## Service Error Pattern

Services throw `ApiError` instances:

```js
const hotel = await Hotel.findOne({ hotelId });
if (!hotel) throw ApiError.notFound('Hotel not found');

if (booking.bookingStatus === 'Cancelled') throw ApiError.conflict('Booking already cancelled');
```

## Not Found Handler

Unmatched routes return:
```json
{
  "success": false,
  "message": "Route GET /api/v1/unknown not found",
  "code": "NOT_FOUND"
}
```
