-- Migration 002: Add password_changed_at column to users table
-- Date: 2026-01-29
-- Description: Tracks when password was last changed to invalidate old reset tokens
--
-- Usage:
--   docker compose exec db psql -U mentaltech -d mentaltech -f /migrations/002_add_password_changed_at.sql

BEGIN;

ALTER TABLE users ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMP WITH TIME ZONE;

COMMIT;
