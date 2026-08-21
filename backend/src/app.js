const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const logger = require('./config/logger');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');

// Route imports
const authRoutes = require('./routes/auth.routes');
const adminAuthRoutes = require('./routes/admin.auth.routes');
const hotelRoutes = require('./routes/hotel.routes');
const bookingRoutes = require('./routes/booking.routes');
const offerRoutes = require('./routes/offer.routes');
const reviewRoutes = require('./routes/review.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// ── Security ──────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: env.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Rate Limiting ─────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
});
app.use('/api/', limiter);

// ── Body Parsing ──────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Request Logging ───────────────────────────────────
if (!env.isProduction) {
  app.use(morgan('dev'));
}

// ── Health Check ──────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'StayEase API is running',
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin/auth', adminAuthRoutes);
app.use('/api/v1/hotels', hotelRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/offers', offerRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/admin', adminRoutes);

// ── 404 & Error Handling ──────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
