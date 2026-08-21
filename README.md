# StayEase — Hotel Booking Platform

Production-grade hotel booking platform with a customer-facing SPA and an internal admin operations console.

## Project Structure

```
StayEase/
├── frontend/          # React 19 + TypeScript + Tailwind + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── data/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.example
│
├── backend/           # Node.js + Express + MongoDB
│   ├── src/
│   │   ├── config/
│   │   ├── constants/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── seeders/
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── docs/              # Project documentation & AI context
│   ├── CONTEXT.md
│   ├── MEMORY.md
│   ├── API_CONTRACT.md
│   └── ...
│
└── README.md
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS v4, Vite |
| Backend | Node.js, Express 4, MongoDB, Mongoose 8 |
| Auth | JWT (access + refresh tokens), bcryptjs |
| Validation | express-validator |
| Logging | Winston |

## Getting Started

### Backend

```bash
cd backend
cp .env.example .env     # fill in MONGODB_URI, JWT_SECRET, etc.
npm install
npm run seed             # seed hotels + admin users + offers
npm run dev              # starts on http://localhost:5000
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev              # starts on http://localhost:3000
```

### Admin Portal

Navigate to `http://localhost:3000`, then either:
- Press `Ctrl+Shift+A`
- Append `#admin` to the URL
- Click "Authorized Staff Portal" in the footer

Default admin credentials (seeded):
- Email: `admin@stayease.in` | Password: `StayEase@Enterprise2026` | PIN: `789012`

### OTP (Development)

All OTPs in mock mode return `482910`. Set `OTP_MODE=mock` in `backend/.env`.

## API Documentation

See [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md) for the full API reference.

## Documentation

All architecture decisions, business rules, and context live in [`docs/`](docs/).
