-- NOTE: Run this in Supabase SQL Editor. The table may not exist yet; the API routes gracefully handle this.

-- Pipeline events table for tracking errors and failures
-- This table is written to by the Step Functions pipeline (future Lambda modification)
-- and read by the admin dashboard for error monitoring

CREATE TABLE IF NOT EXISTS pipeline_events (
  id SERIAL PRIMARY KEY,
  source_name TEXT NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'error',  -- 'error', 'warning', 'info'
  error_step TEXT,                            -- 'fetch', 'analyze', 'save', 'publish', 'image', 'social'
  error_message TEXT,
  article_uuid UUID REFERENCES articles(uuid) ON DELETE SET NULL,
  metadata JSONB,
  resolved BOOLEAN DEFAULT false,
  occurred_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pipeline_events_source ON pipeline_events(source_name);
CREATE INDEX idx_pipeline_events_occurred ON pipeline_events(occurred_at DESC);
CREATE INDEX idx_pipeline_events_type ON pipeline_events(event_type);
CREATE INDEX idx_pipeline_events_resolved ON pipeline_events(resolved);
