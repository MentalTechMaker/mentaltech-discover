-- Migration: Add quality scoring columns to products
-- Each score is an integer 0-20 representing one of the 5 evaluation pillars
-- Each justification is a free-text field for research references, testimonials, etc.

ALTER TABLE products
    ADD COLUMN IF NOT EXISTS score_security   SMALLINT CHECK (score_security   BETWEEN 0 AND 20),
    ADD COLUMN IF NOT EXISTS score_efficacy    SMALLINT CHECK (score_efficacy    BETWEEN 0 AND 20),
    ADD COLUMN IF NOT EXISTS score_accessibility SMALLINT CHECK (score_accessibility BETWEEN 0 AND 20),
    ADD COLUMN IF NOT EXISTS score_ux          SMALLINT CHECK (score_ux          BETWEEN 0 AND 20),
    ADD COLUMN IF NOT EXISTS score_support     SMALLINT CHECK (score_support     BETWEEN 0 AND 20),
    ADD COLUMN IF NOT EXISTS justification_security      TEXT,
    ADD COLUMN IF NOT EXISTS justification_efficacy       TEXT,
    ADD COLUMN IF NOT EXISTS justification_accessibility  TEXT,
    ADD COLUMN IF NOT EXISTS justification_ux             TEXT,
    ADD COLUMN IF NOT EXISTS justification_support        TEXT;
