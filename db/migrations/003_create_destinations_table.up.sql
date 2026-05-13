-- ====================================================================
-- CREATE DESTINATIONS TABLE
-- ====================================================================

CREATE TABLE IF NOT EXISTS destinations (
    id UUID PRIMARY KEY,
    endpoint_id UUID NOT NULL REFERENCES endpoints(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    method TEXT DEFAULT 'POST' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- INDEXES
-- ====================================================================

CREATE INDEX IF NOT EXISTS idx_destinations_endpoint_id ON destinations(endpoint_id);
CREATE INDEX IF NOT EXISTS idx_destinations_is_active ON destinations(is_active);

-- ====================================================================
-- TRIGGERS
-- ====================================================================

CREATE TRIGGER tr_destinations_set_updated_at
BEFORE UPDATE ON destinations
FOR EACH ROW
EXECUTE FUNCTION fn_set_updated_at();
