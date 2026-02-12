-- REXU (QRgency) - PostgreSQL Schema
-- Run this once against your database (e.g. psql $DATABASE_URL -f database/schema.sql)

-- Users: one row per registered user. role = 'user' | 'admin'
CREATE TABLE IF NOT EXISTS users (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  email          TEXT NOT NULL UNIQUE,
  password_hash  TEXT NOT NULL,
  mobile         TEXT NOT NULL,
  role           TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_mobile ON users (mobile);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);

-- Emergency profile: one per user. Medical and contact info shown on /e/:token
CREATE TABLE IF NOT EXISTS emergency_profiles (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
  blood_group          TEXT,
  allergies            TEXT,
  medical_conditions   TEXT,
  medications          TEXT,
  guardian_phone       TEXT,
  secondary_phone      TEXT,
  emergency_note       TEXT,
  age                  INT,
  language             TEXT,
  organ_donor          BOOLEAN NOT NULL DEFAULT FALSE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_emergency_profiles_user_id ON emergency_profiles (user_id);

-- QR tokens: one per user. token is the cryptographically secure value used in URL
CREATE TABLE IF NOT EXISTS qr_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
  token       TEXT NOT NULL UNIQUE,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_qr_tokens_token ON qr_tokens (token);
CREATE INDEX IF NOT EXISTS idx_qr_tokens_user_id ON qr_tokens (user_id);
CREATE INDEX IF NOT EXISTS idx_qr_tokens_is_active ON qr_tokens (is_active);

-- Admins: separate table for admin login (email + password hash). Optional if you use users.role
CREATE TABLE IF NOT EXISTS admins (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admins_email ON admins (email);

-- Optional: scan log for analytics (who scanned when). No PII from scanner.
CREATE TABLE IF NOT EXISTS scan_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token      TEXT NOT NULL,
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip         TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_scan_logs_token ON scan_logs (token);
CREATE INDEX IF NOT EXISTS idx_scan_logs_scanned_at ON scan_logs (scanned_at);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

DROP TRIGGER IF EXISTS emergency_profiles_updated_at ON emergency_profiles;
CREATE TRIGGER emergency_profiles_updated_at
  BEFORE UPDATE ON emergency_profiles
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
