BEGIN;

-- =========================
-- Extensions
-- =========================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS unaccent;

-- =========================
-- Suppression des tables (ordre inverse des dépendances)
-- =========================
DROP TABLE IF EXISTS reset_password      CASCADE;
DROP TABLE IF EXISTS refresh_token       CASCADE;
DROP TABLE IF EXISTS notification        CASCADE;
DROP TABLE IF EXISTS attachment          CASCADE;
DROP TABLE IF EXISTS prescription_line   CASCADE;
DROP TABLE IF EXISTS medication          CASCADE;
DROP TABLE IF EXISTS prescription        CASCADE;
DROP TABLE IF EXISTS "user"              CASCADE;

-- =========================
-- Table: user
-- =========================
CREATE TABLE IF NOT EXISTS "user" (
  user_id      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  first_name   VARCHAR(50)  NOT NULL,
  last_name    VARCHAR(50)  NOT NULL,
  email        VARCHAR(100) NOT NULL UNIQUE,
  password     TEXT         NOT NULL, -- hashed (bcrypt/argon2)
  role         VARCHAR(20)  NOT NULL CHECK (role IN ('USER','ADMIN')),
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- =========================
-- Table: prescription
-- =========================
CREATE TABLE IF NOT EXISTS prescription (
  prescription_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title           VARCHAR(100),
  prescriber      VARCHAR(100),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id         BIGINT NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_prescription_user_id ON prescription(user_id);

-- =========================
-- Table: medication
-- =========================
CREATE TABLE IF NOT EXISTS medication (
  medication_id     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name              VARCHAR(100) NOT NULL,
  brand_name        VARCHAR(100),
  short_description TEXT,
  form              VARCHAR(50),
  base_dosage       VARCHAR(50),
  expiration_date   DATE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX uniq_medication_catalog ON medication(name, COALESCE(form,''), COALESCE(base_dosage,''));

-- Table: prescription_line

CREATE TABLE IF NOT EXISTS prescription_line (
  line_id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  start_date      DATE NOT NULL,
  end_date        DATE,
  dose            NUMERIC(10,3),
  unit            VARCHAR(20),
  frequency_day   INTEGER,
  instructions    TEXT,
  status          VARCHAR(20) CHECK (status IN ('active','completed','paused')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  prescription_id BIGINT NOT NULL REFERENCES prescription(prescription_id) ON DELETE CASCADE,
  medication_id   BIGINT REFERENCES medication(medication_id) ON DELETE SET NULL,
  CONSTRAINT chk_line_temporal_integrity CHECK (end_date IS NULL OR end_date >= start_date),
  CONSTRAINT chk_frequency_day_nonnegative CHECK (frequency_day IS NULL OR frequency_day >= 0)
);

CREATE INDEX IF NOT EXISTS idx_line_prescription_id ON prescription_line(prescription_id);
CREATE INDEX IF NOT EXISTS idx_line_medication_id   ON prescription_line(medication_id);
CREATE INDEX IF NOT EXISTS idx_line_status          ON prescription_line(status);


-- Table: attachment

CREATE TABLE IF NOT EXISTS attachment (
  attachment_id    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  mime_type        VARCHAR(50)  NOT NULL,
  file_size_bytes  INTEGER      NOT NULL CHECK (file_size_bytes > 0),
  file_path        TEXT         NOT NULL,
  sha256           VARCHAR(64)  NOT NULL CHECK (sha256 ~ '^[0-9A-Fa-f]{64}$'),
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  prescription_id  BIGINT       NOT NULL REFERENCES prescription(prescription_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_attachment_prescription_id ON attachment(prescription_id);
CREATE UNIQUE INDEX IF NOT EXISTS uniq_attachment_sha256 ON attachment(sha256);

-- Table: notification

CREATE TABLE IF NOT EXISTS notification (
  notif_id    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  notif_type  VARCHAR(50) NOT NULL CHECK (notif_type IN ('medication_reminder','prescription_expiry','new_prescription')),
  content     TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_read     BOOLEAN     NOT NULL DEFAULT FALSE,
  user_id     BIGINT      NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_notification_user_id ON notification(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_is_read ON notification(is_read);

-- Table: refresh_token

CREATE TABLE IF NOT EXISTS refresh_token (
  token_id    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at  TIMESTAMPTZ NOT NULL,
  device_info VARCHAR(100),
  user_id     BIGINT NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_refresh_token_user_id   ON refresh_token(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_token_expires   ON refresh_token(expires_at);


-- Table: reset_password

CREATE TABLE IF NOT EXISTS reset_password (
  reset_id    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  token       TEXT NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_used     BOOLEAN NOT NULL DEFAULT FALSE,
  user_id     BIGINT NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_reset_password_user_id  ON reset_password(user_id);
CREATE INDEX IF NOT EXISTS idx_reset_password_expires  ON reset_password(expires_at);
CREATE INDEX IF NOT EXISTS idx_reset_password_is_used  ON reset_password(is_used);

COMMIT;
