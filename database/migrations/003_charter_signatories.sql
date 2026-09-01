-- Migration 003 : table des signataires de la charte du Collectif
-- Voir _docs/decisions/2026-07-13-discover-backend-du-collectif.md, section 2.
-- Idempotent : CREATE TABLE/INDEX/TRIGGER en IF NOT EXISTS, rejouable sans risque.

CREATE TABLE IF NOT EXISTS charter_signatories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    kind VARCHAR(30) NOT NULL,
    consent BOOLEAN NOT NULL DEFAULT FALSE,
    source VARCHAR(30) NOT NULL DEFAULT 'form',
    status VARCHAR(30) NOT NULL DEFAULT 'pending_email',
    confirm_token VARCHAR(500) UNIQUE,
    email_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    signed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_charter_signatories_email ON charter_signatories (email);
CREATE INDEX IF NOT EXISTS idx_charter_signatories_confirmed ON charter_signatories (email_confirmed);
CREATE INDEX IF NOT EXISTS idx_charter_signatories_source ON charter_signatories (source);

DROP TRIGGER IF EXISTS set_updated_at_charter_signatories ON charter_signatories;
CREATE TRIGGER set_updated_at_charter_signatories
    BEFORE UPDATE ON charter_signatories
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
