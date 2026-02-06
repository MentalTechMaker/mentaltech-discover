-- Migration 003: Add indexes for common query patterns
-- Date: 2026-02-06
-- Description: Adds indexes on products columns used in filtering and sorting
--
-- Usage:
--   docker compose exec db psql -U mentaltech -d mentaltech -f /migrations/003_add_indexes.sql

BEGIN;

CREATE INDEX IF NOT EXISTS idx_products_for_company ON products (for_company);
CREATE INDEX IF NOT EXISTS idx_products_pricing_model ON products (pricing_model);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products (created_at);

COMMIT;
