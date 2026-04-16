-- Migration 001: Add P1/P2/P3 priority columns
-- Run this on existing production databases before deploying V2.1

-- Products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS audience_priorities JSONB DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS problems_priorities JSONB DEFAULT '{}';
CREATE INDEX IF NOT EXISTS idx_products_audience_priorities ON products USING GIN (audience_priorities);
CREATE INDEX IF NOT EXISTS idx_products_problems_priorities ON products USING GIN (problems_priorities);

-- Product submissions table
ALTER TABLE product_submissions ADD COLUMN IF NOT EXISTS audience_priorities JSONB DEFAULT '{}';
ALTER TABLE product_submissions ADD COLUMN IF NOT EXISTS problems_priorities JSONB DEFAULT '{}';

-- Public submissions table
ALTER TABLE public_submissions ADD COLUMN IF NOT EXISTS audience_priorities JSONB DEFAULT '{}';
ALTER TABLE public_submissions ADD COLUMN IF NOT EXISTS problems_priorities JSONB DEFAULT '{}';

-- Migrate existing products: distribute audiences/problems across P1/P2/P3 (1 item per level)
UPDATE products SET
  audience_priorities = jsonb_build_object('P1', to_jsonb(audience[1:1]), 'P2', to_jsonb(audience[2:2]), 'P3', to_jsonb(audience[3:3])),
  problems_priorities = jsonb_build_object('P1', to_jsonb(problems_solved[1:1]), 'P2', to_jsonb(problems_solved[2:2]), 'P3', to_jsonb(problems_solved[3:3]))
WHERE audience_priorities = '{}' OR audience_priorities IS NULL;
