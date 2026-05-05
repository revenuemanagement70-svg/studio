# Staylo.in — Hotel Booking Platform

A full-stack hotel booking platform built with Express.js + Prisma (backend) and Next.js (frontend).

## Quick Start (Docker)

```bash
docker-compose up -d
```

## Manual Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run db:seed
npm run dev
```

Backend runs at `http://localhost:4000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@staylo.in | admin123 |
| Partner | partner@staylo.in | partner123 |
| Guest | guest@staylo.in | guest123 |

## API Endpoints

- `GET  /api/health` — Health check
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `GET  /api/hotels/search` — Search hotels
- `GET  /api/hotels/featured` — Featured hotels
- `POST /api/bookings` — Create booking
- `GET  /api/bookings/my` — My bookings
