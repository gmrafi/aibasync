-- Analytics upgrade: raw visitor IP + geo location + browser columns.
-- Run once against your Neon branch (psql with DIRECT connection or the pooled string both work).

ALTER TABLE tracking_events ADD COLUMN IF NOT EXISTS ip_address TEXT;
ALTER TABLE tracking_events ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE tracking_events ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE tracking_events ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE tracking_events ADD COLUMN IF NOT EXISTS browser TEXT;

CREATE INDEX IF NOT EXISTS idx_tracking_events_ip ON tracking_events (ip_address);
