-- ------------------------------------------------------------------
-- AIBA Sync — tracking events table
-- Run once against your Neon branch:
--   psql "postgresql://neondb_owner:YOUR_PASSWORD@... (DIRECT connection)" -f migrations/001_tracking_events.sql
-- ------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS tracking_events (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL DEFAULT 'routine_view',
  name TEXT,
  batch TEXT,
  major_or_section TEXT,
  minor TEXT,
  role TEXT,
  teacher_code TEXT,
  ip_hash TEXT,
  user_agent TEXT,
  device_type TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes used by the dashboard queries
CREATE INDEX IF NOT EXISTS idx_tracking_events_created_at ON tracking_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tracking_events_batch ON tracking_events (batch);
CREATE INDEX IF NOT EXISTS idx_tracking_events_ip_hash ON tracking_events (ip_hash);
