-- Migration 007: Premium prescriber features
-- Tables: prescriptions, product_updates, prescriber_favorites, prescriber_notes
-- Fields: is_verified_prescriber on users

-- 1. Add prescriber verification flag to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified_prescriber BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Prescriptions table (ordonnance digitale)
CREATE TABLE IF NOT EXISTS prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescriber_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    patient_name VARCHAR(255),
    patient_email VARCHAR(255),
    product_ids TEXT[] NOT NULL DEFAULT '{}',
    message TEXT,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    viewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_prescriptions_prescriber ON prescriptions (prescriber_id);
CREATE INDEX idx_prescriptions_token ON prescriptions (token);

-- 3. Product updates table (veille solutions)
CREATE TABLE IF NOT EXISTS product_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id VARCHAR(100) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    update_type VARCHAR(50) NOT NULL CHECK (update_type IN ('price_change', 'score_change', 'new_feature', 'study', 'general')),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_product_updates_product ON product_updates (product_id);
CREATE INDEX idx_product_updates_created ON product_updates (created_at DESC);

-- 4. Prescriber favorites table
CREATE TABLE IF NOT EXISTS prescriber_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescriber_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id VARCHAR(100) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(prescriber_id, product_id)
);

CREATE INDEX idx_favorites_prescriber ON prescriber_favorites (prescriber_id);

-- 5. Prescriber notes table
CREATE TABLE IF NOT EXISTS prescriber_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescriber_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id VARCHAR(100) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(prescriber_id, product_id)
);

CREATE INDEX idx_notes_prescriber ON prescriber_notes (prescriber_id);
