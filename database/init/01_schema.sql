-- MentalTech Discover - Database Schema
-- PostgreSQL 16

-- Extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum for pricing models
CREATE TYPE pricing_model_enum AS ENUM (
    'free',
    'freemium',
    'subscription',
    'per-session',
    'enterprise',
    'custom'
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'prescriber')),
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    password_changed_at TIMESTAMP WITH TIME ZONE,
    profession VARCHAR(255),
    organization VARCHAR(255),
    rpps_adeli VARCHAR(50),
    is_verified_prescriber BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    url VARCHAR(500) NOT NULL,
    logo VARCHAR(500) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    audience TEXT[] DEFAULT '{}',
    problems_solved TEXT[] DEFAULT '{}',
    preference_match TEXT[] DEFAULT '{}',
    for_company BOOLEAN DEFAULT FALSE,
    is_mentaltech_member BOOLEAN DEFAULT FALSE,
    pricing_model pricing_model_enum,
    pricing_amount VARCHAR(100),
    pricing_details TEXT,
    last_updated DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Quality scoring (0-20 per pillar)
    score_security SMALLINT CHECK (score_security BETWEEN 0 AND 20),
    score_efficacy SMALLINT CHECK (score_efficacy BETWEEN 0 AND 20),
    score_accessibility SMALLINT CHECK (score_accessibility BETWEEN 0 AND 20),
    score_ux SMALLINT CHECK (score_ux BETWEEN 0 AND 20),
    score_support SMALLINT CHECK (score_support BETWEEN 0 AND 20),

    -- Justifications (research references, testimonials, etc.)
    justification_security TEXT,
    justification_efficacy TEXT,
    justification_accessibility TEXT,
    justification_ux TEXT,
    justification_support TEXT
);

-- GIN indexes for array columns (fast lookups)
CREATE INDEX idx_products_audience ON products USING GIN (audience);
CREATE INDEX idx_products_problems_solved ON products USING GIN (problems_solved);
CREATE INDEX idx_products_tags ON products USING GIN (tags);
CREATE INDEX idx_products_preference_match ON products USING GIN (preference_match);

-- Index on users email for fast login lookups
CREATE INDEX idx_users_email ON users (email);

-- Prescriptions table (ordonnance digitale)
CREATE TABLE prescriptions (
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

-- Product updates table (veille solutions)
CREATE TABLE product_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id VARCHAR(100) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    update_type VARCHAR(50) NOT NULL CHECK (update_type IN ('price_change', 'score_change', 'new_feature', 'study', 'general')),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_product_updates_product ON product_updates (product_id);
CREATE INDEX idx_product_updates_created ON product_updates (created_at DESC);

-- Prescriber favorites table
CREATE TABLE prescriber_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescriber_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id VARCHAR(100) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(prescriber_id, product_id)
);

CREATE INDEX idx_favorites_prescriber ON prescriber_favorites (prescriber_id);

-- Prescriber notes table
CREATE TABLE prescriber_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescriber_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id VARCHAR(100) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(prescriber_id, product_id)
);

CREATE INDEX idx_notes_prescriber ON prescriber_notes (prescriber_id);
