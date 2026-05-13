-- ====================================================================
-- CREATE ENDPOINTS TABLE
-- ====================================================================

CREATE TABLE IF NOT EXISTS endpoints (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    secret TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- INDEXES
-- ====================================================================

CREATE INDEX IF NOT EXISTS idx_endpoints_user_id ON endpoints(user_id);
CREATE INDEX IF NOT EXISTS idx_endpoints_slug ON endpoints(slug);
CREATE INDEX IF NOT EXISTS idx_endpoints_is_active ON endpoints(is_active);

-- ====================================================================
-- TRIGGERS
-- ====================================================================

CREATE TRIGGER tr_endpoints_set_updated_at
BEFORE UPDATE ON endpoints
FOR EACH ROW
EXECUTE FUNCTION fn_set_updated_at();
