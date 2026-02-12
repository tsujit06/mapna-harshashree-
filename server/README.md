# REXU Backend (Express)

Production-ready Node.js/Express backend for **REXU** (QRgency): FREE QR-based emergency contacts. No payment logic, no Razorpay — every registered user gets one lifetime QR after completing their emergency profile.

---

## Tech Stack

- **Node.js** + **Express.js**
- **PostgreSQL** (recommended for structured data; use free tier: Neon, Supabase, Railway, Render)
- **JWT** authentication
- **bcrypt** password hashing
- **qrcode** (npm) for QR generation
- **helmet**, **cors**, **express-rate-limit**, **express-validator**, **dotenv**

---

## Folder Structure

```
server/
├── database/
│   └── schema.sql          # Run once to create tables
├── src/
│   ├── config/
│   │   └── db.js           # PG pool
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── emergencyProfileController.js
│   │   ├── qrController.js
│   │   ├── publicController.js   # GET /e/:token
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js         # JWT + admin auth
│   │   ├── validate.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── EmergencyProfile.js
│   │   ├── QRToken.js
│   │   └── Admin.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── emergencyProfile.js
│   │   ├── qr.js
│   │   ├── public.js
│   │   └── admin.js
│   ├── services/
│   │   ├── authService.js
│   │   └── qrService.js
│   ├── validators/
│   │   ├── authValidators.js
│   │   ├── emergencyProfileValidators.js
│   │   └── adminValidators.js
│   └── utils/
│       └── AppError.js
├── uploads/
│   └── qrcodes/            # QR PNGs (Option A)
├── server.js
├── package.json
├── .env.example
└── README.md
```

---

## Database Design

### Relationships

- **User** (1) — (1) **EmergencyProfile**: one profile per user.
- **User** (1) — (1) **QRToken**: one QR per user (enforced by UNIQUE on `user_id`).
- **admins**: separate table for admin login (email + bcrypt hash).

### Tables

| Table                | Purpose                                                                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `users`              | id, name, email, password_hash, mobile, role, created_at                                                                                           |
| `emergency_profiles` | user_id (FK), blood_group, allergies, medical_conditions, medications, guardian_phone, secondary_phone, emergency_note, age, language, organ_donor |
| `qr_tokens`          | user_id (FK UNIQUE), token (UNIQUE), is_active                                                                                                     |
| `admins`             | email, password_hash (for admin login)                                                                                                             |
| `scan_logs`          | token, scanned_at, ip, user_agent (analytics, no PII)                                                                                              |

---

## Setup

### 1. Install dependencies

```bash
cd server && npm install
```

### 2. Environment

```bash
cp .env.example .env
# Edit .env: DATABASE_URL, JWT_SECRET, EMERGENCY_PAGE_BASE_URL, etc.
```

### 3. Database

Create a PostgreSQL database (e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com), or local Postgres), then:

```bash
psql $DATABASE_URL -f database/schema.sql
```

### 4. Seed admin (optional)

```bash
node -e "console.log(require('bcrypt').hashSync('your-admin-password', 10))"
# Insert into admins (email, password_hash) values ('admin@rexu.app', '<hash>');
```

### 5. Run

```bash
npm run dev   # or npm start
```

Server runs on `PORT` (default 4000).

---

## API Reference

Base URL: `http://localhost:4000` (or your deployed URL).

### 1. Auth

**POST /api/auth/register**

```json
// Request
{ "name": "John", "email": "john@example.com", "password": "secret123", "mobile": "+919876543210" }

// Response 201
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "name": "John", "email": "john@example.com", "mobile": "+919876543210", "role": "user" },
    "token": "eyJhbG...",
    "expiresIn": "7d"
  }
}
```

**POST /api/auth/login**

```json
// Request
{ "email": "john@example.com", "password": "secret123" }

// Response 200
{ "success": true, "data": { "user": { ... }, "token": "eyJ...", "expiresIn": "7d" } }
```

---

### 2. Emergency Profile

All protected routes need header: `Authorization: Bearer <token>`.

**POST /api/emergency-profile**

Creates or updates profile and ensures user has one QR (generated if missing).

```json
// Request
{
  "bloodGroup": "B+",
  "allergies": "Penicillin",
  "medicalConditions": "Asthma",
  "medications": "Inhaler",
  "guardianPhone": "+919876543210",
  "secondaryPhone": "+919876543211",
  "emergencyNote": "Call wife first",
  "age": 30,
  "language": "English",
  "organDonor": true
}

// Response 200
{
  "success": true,
  "data": {
    "profile": { "id": "...", "bloodGroup": "B+", ... },
    "qr": { "url": "https://yourdomain.com/e/<token>", "qrImagePath": "<token>.png", "isNew": true }
  }
}
```

**GET /api/emergency-profile/me**

Returns current user's profile and QR info.

---

### 3. QR

**GET /api/qr** — Get or create QR (one per user). Returns `url` and `qrImagePath`.

**GET /api/qr/download/:token** — Download QR PNG (token must belong to current user).

---

### 4. Public Emergency Page

**GET /e/:token**

No auth. Returns emergency-safe data only (no email, password, internal IDs). If QR is disabled, returns `inactive: true` and message.

```json
// Response 200 (active)
{
  "success": true,
  "data": {
    "name": "John",
    "age": 30,
    "language": "English",
    "bloodGroup": "B+",
    "allergies": "Penicillin",
    "medicalConditions": "Asthma",
    "medications": "Inhaler",
    "emergencyNote": "Call wife first",
    "guardianPhone": "+919876543210",
    "secondaryPhone": "+919876543211",
    "organDonor": true
  }
}

// Response 200 (disabled)
{ "success": true, "inactive": true, "message": "QR is inactive. Contact the owner.", "data": null }
```

---

### 5. Admin

**POST /api/admin/login**

```json
// Request
{ "email": "admin@rexu.app", "password": "your-admin-password" }

// Response 200
{ "success": true, "data": { "token": "eyJ...", "user": { "id": "...", "email": "...", "role": "admin" } } }
```

**GET /api/admin/users** — Header: `Authorization: Bearer <admin-token>`. Query: `?limit=50&offset=0`.

**POST /api/admin/users/:userId/disable-qr** — Disable QR for user.

**POST /api/admin/users/:userId/enable-qr** — Enable QR for user.

---

## Postman Testing Guide

1. **Create environment**  
   Variable `baseUrl` = `http://localhost:4000`, `token` = (leave empty).

2. **Register**  
   POST `{{baseUrl}}/api/auth/register` with body (raw JSON) as above. Copy `data.token` into `token`.

3. **Login**  
   POST `{{baseUrl}}/api/auth/login`. Save `data.token` to `token`.

4. **Protected routes**  
   Header: `Authorization: Bearer {{token}}`.  
   POST `{{baseUrl}}/api/emergency-profile` with profile body.  
   GET `{{baseUrl}}/api/emergency-profile/me`.  
   GET `{{baseUrl}}/api/qr`.

5. **Public**  
   GET `{{baseUrl}}/e/<token-from-qr>` (no auth).

6. **Admin**  
   POST `{{baseUrl}}/api/admin/login` with admin credentials. Use returned token for GET `/api/admin/users`, POST disable/enable QR.

---

## QR Storage: Option A vs B

- **Option A (recommended):** Save PNG to `/uploads/qrcodes/<token>.png`.  
  **Pros:** Fast to serve, CDN-friendly, small DB, easy backups.
- **Option B:** Store base64 in DB.  
  **Cons:** Larger DB, slower reads, harder to cache.

This backend uses **Option A**.

---

## Security

- **helmet** — Secure headers.
- **rate limiting** — General, auth, and `/e/:token` (brute-force protection).
- **JWT** — Signed, expiry; issuer/audience can be added.
- **bcrypt** — Passwords hashed (12 rounds).
- **Token-based QR** — URL contains only a 64-char hex token (crypto.randomBytes(32)); no PII in QR.
- **Input validation** — express-validator on all inputs.
- **One QR per user** — Enforced in DB (UNIQUE on `qr_tokens.user_id`) and in `qrService.getOrCreateQRForUser`.

---

## Deploy FREE (Render / Railway / Fly.io)

### Render

1. New → Web Service; connect repo; root directory: `server`.
2. Build: `npm install`; Start: `npm start`.
3. Add env vars: `DATABASE_URL`, `JWT_SECRET`, `EMERGENCY_PAGE_BASE_URL` (e.g. `https://your-api.onrender.com`), `NODE_ENV=production`.
4. Create PostgreSQL (Render or Neon) and run `schema.sql`; set `DATABASE_URL`.

### Railway

1. New project → Deploy from repo; set root to `server`.
2. Add PostgreSQL plugin or external `DATABASE_URL`.
3. Env: `DATABASE_URL`, `JWT_SECRET`, `EMERGENCY_PAGE_BASE_URL`, `PORT` (Railway sets this).

### Fly.io

1. `fly launch` in `server/`; add Postgres or external DB.
2. Set secrets: `fly secrets set DATABASE_URL=... JWT_SECRET=... EMERGENCY_PAGE_BASE_URL=...`.

### Domain

- Point DNS A/CNAME to the host (e.g. Render default: `*.onrender.com`).
- Set `EMERGENCY_PAGE_BASE_URL=https://yourdomain.com` so QR links use your domain.

---

## Scaling

- **DB:** Use connection pooling (included); consider read replicas later.
- **Cache:** Add Redis and cache token → profile for `GET /e/:token` (every second matters).
- **CDN:** Serve `/uploads/qrcodes` and static assets via CDN.
- **Edge:** Later, put `GET /e/:token` behind an edge function (e.g. Vercel/Cloudflare) with cached lookups.

---

## License

MIT.
