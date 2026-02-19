-- Migration 008: auto-update updated_at on every row UPDATE
-- Apply with: psql $DATABASE_URL -f /migrations/008_updated_at_triggers.sql

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Users
DROP TRIGGER IF EXISTS set_updated_at_users ON users;
CREATE TRIGGER set_updated_at_users
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- Products
DROP TRIGGER IF EXISTS set_updated_at_products ON products;
CREATE TRIGGER set_updated_at_products
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- Prescriptions
DROP TRIGGER IF EXISTS set_updated_at_prescriptions ON prescriptions;
CREATE TRIGGER set_updated_at_prescriptions
    BEFORE UPDATE ON prescriptions
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- Prescriber notes
DROP TRIGGER IF EXISTS set_updated_at_prescriber_notes ON prescriber_notes;
CREATE TRIGGER set_updated_at_prescriber_notes
    BEFORE UPDATE ON prescriber_notes
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
