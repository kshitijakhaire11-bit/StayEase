# StayEase — Deployment

## Environment Variables

All variables listed in `backend/.env.example`. Copy to `backend/.env` and fill in values.

```
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/stayease

JWT_SECRET=<generate 64-char random string>
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=<generate 64-char random string>
JWT_REFRESH_EXPIRES_IN=30d

OTP_MODE=mock
OTP_MOCK_CODE=482910

CORS_ORIGIN=http://localhost:3000

LOG_LEVEL=debug
```

## Project Structure
```
StayEase/
├── frontend/    ← React SPA (Vite, port 3000)
├── backend/     ← Express API (Node.js, port 5000)
└── docs/        ← Documentation
```

## Local Development

### Prerequisites
- Node.js >= 18
- MongoDB running locally on port 27017 (or provide MONGODB_URI)

### Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your values
npm install
npm run seed    # Populate hotels + admin users + offers
npm run dev     # Start with --watch (auto-restart) on port 5000
```

### Frontend Setup
```bash
cd frontend
cp .env.example .env
npm install
npm run dev     # Vite on http://localhost:3000
```

## Production

```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/stayease
JWT_SECRET=<strong-random-64-chars>
JWT_REFRESH_SECRET=<strong-random-64-chars>
OTP_MODE=real   # Configure real SMS/email provider
CORS_ORIGIN=https://your-production-domain.com
LOG_LEVEL=info
```

Start: `npm start` (node src/server.js)

## Health Check
`GET /api/health` → Use for load balancer health probes.

## Logging
- Development: Colorized console output (Winston)
- Production: JSON structured logs — pipe to CloudWatch / Datadog / ELK
- Never log sensitive fields (see SECURITY.md)

## Database
- Run `npm run seed` once on first deploy to populate reference data
- Ensure indexes are created (Mongoose creates them on startup)
- Backup strategy: MongoDB Atlas automated backups (recommended for production)

## Build Commands
```bash
npm run dev     # Development (node --watch)
npm start       # Production
npm run seed    # Seed database
npm test        # Run tests
```
