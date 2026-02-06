-- Add MentalTech collective membership flag
ALTER TABLE products
    ADD COLUMN IF NOT EXISTS is_mentaltech_member BOOLEAN DEFAULT FALSE;
