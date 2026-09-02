-- Migration 004 : durcissement de charter_signatories (revue advisor du 2026-09-01)
-- - charter_version : sans elle, "qui a signe quelle version" est irrecuperable des que
--   la charte change.
-- - Index unique sur email normalise : le check applicatif (query avant insert) ne
--   protege pas contre deux POST concurrents qui passeraient tous les deux le check
--   avant que l'un des deux ne commite. Idempotent : IF NOT EXISTS.

ALTER TABLE charter_signatories
    ADD COLUMN IF NOT EXISTS charter_version VARCHAR(20) NOT NULL DEFAULT '2026';

CREATE UNIQUE INDEX IF NOT EXISTS idx_charter_signatories_email_unique
    ON charter_signatories (lower(btrim(email)));
