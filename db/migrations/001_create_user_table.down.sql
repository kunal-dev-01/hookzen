-- ====================================================================
-- DROP USER TABLE
-- ====================================================================

DROP TRIGGER IF EXISTS tr_users_set_updated_at ON users;
DROP TABLE IF EXISTS users;