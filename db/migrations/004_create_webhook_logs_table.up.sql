-- ====================================================================
-- CREATE WEBHOOK_LOGS TABLE
-- ====================================================================

CREATE TABLE IF NOT EXISTS webhook_logs (
    id UUID PRIMARY KEY,
    endpoint_id UUID NOT NULL REFERENCES endpoints(id) ON DELETE CASCADE,
    destination_id UUID REFERENCES destinations(id) ON DELETE SET NULL,
    request_payload JSONB DEFAULT '{}'::jsonb NOT NULL,
    request_headers JSONB DEFAULT '{}'::jsonb NOT NULL,
    response_status INTEGER,
    response_body TEXT,
    response_headers JSONB DEFAULT '{}'::jsonb,
    latency_ms INTEGER DEFAULT 0,
    error_message TEXT,
    attempt_number INTEGER DEFAULT 1 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- INDEXES
-- ====================================================================

CREATE INDEX IF NOT EXISTS idx_webhook_logs_endpoint_id ON webhook_logs(endpoint_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_destination_id ON webhook_logs(destination_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created_at ON webhook_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_request_payload ON webhook_logs USING GIN (request_payload);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_response_status ON webhook_logs(response_status);
