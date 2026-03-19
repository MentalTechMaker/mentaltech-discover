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
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'prescriber', 'publisher')),
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    password_changed_at TIMESTAMP WITH TIME ZONE,
    profession VARCHAR(255),
    organization VARCHAR(255),
    rpps_adeli VARCHAR(50),
    is_verified_prescriber BOOLEAN NOT NULL DEFAULT FALSE,
    -- Publisher fields (migration 009)
    company_name VARCHAR(255),
    siret VARCHAR(20),
    company_website VARCHAR(500),
    is_verified_publisher BOOLEAN NOT NULL DEFAULT FALSE,
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
    justification_support TEXT,

    -- Visibility (migration 011)
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    company_defunct BOOLEAN NOT NULL DEFAULT FALSE,

    -- Detailed scoring criteria (protocol answers stored as JSONB)
    scoring_criteria JSONB DEFAULT NULL
);

-- GIN indexes for array columns (fast lookups)
CREATE INDEX idx_products_audience ON products USING GIN (audience);
CREATE INDEX idx_products_problems_solved ON products USING GIN (problems_solved);
CREATE INDEX idx_products_tags ON products USING GIN (tags);
CREATE INDEX idx_products_preference_match ON products USING GIN (preference_match);
-- Visibility index (migration 011)
CREATE INDEX idx_products_visibility ON products (is_visible, company_defunct);

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

-- ============================================================
-- Auto-update updated_at trigger (migration 008)
-- ============================================================

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_users
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_products
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_prescriptions
    BEFORE UPDATE ON prescriptions
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_prescriber_notes
    BEFORE UPDATE ON prescriber_notes
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- Product submissions table (migration 010)
-- ============================================================

CREATE TABLE product_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    publisher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id VARCHAR(100) REFERENCES products(id) ON DELETE SET NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'changes_requested')),

    -- Basic product info
    name VARCHAR(255),
    type VARCHAR(100),
    tagline TEXT,
    description TEXT,
    url VARCHAR(500),
    logo VARCHAR(500),
    tags TEXT[] DEFAULT '{}',
    audience TEXT[] DEFAULT '{}',
    problems_solved TEXT[] DEFAULT '{}',
    pricing_model VARCHAR(50),
    pricing_amount VARCHAR(100),
    pricing_details TEXT,

    -- Structured protocol answers (JSONB)
    -- Keys: "1.1" through "5.5" (25 sub-criteria)
    protocol_answers JSONB NOT NULL DEFAULT '{}',

    -- Admin review
    admin_notes TEXT,
    admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_submissions_publisher ON product_submissions (publisher_id);
CREATE INDEX idx_submissions_status ON product_submissions (status);
CREATE INDEX idx_submissions_created ON product_submissions (created_at DESC);

CREATE TRIGGER set_updated_at_product_submissions
    BEFORE UPDATE ON product_submissions
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- Public submissions (formulaire anonyme sans compte)
-- ============================================================

CREATE TABLE IF NOT EXISTS public_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending_email',
    confirm_token VARCHAR(500) UNIQUE,
    email_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    name VARCHAR(255),
    type VARCHAR(100),
    tagline TEXT,
    description TEXT,
    url VARCHAR(500),
    logo VARCHAR(500),
    tags TEXT[] DEFAULT '{}',
    audience TEXT[] DEFAULT '{}',
    problems_solved TEXT[] DEFAULT '{}',
    pricing_model VARCHAR(50),
    pricing_amount VARCHAR(100),
    pricing_details TEXT,
    protocol_answers JSONB NOT NULL DEFAULT '{}',
    collectif_requested BOOLEAN NOT NULL DEFAULT FALSE,
    collectif_status VARCHAR(30) NOT NULL DEFAULT 'none',
    collectif_contact_email VARCHAR(255),
    admin_notes TEXT,
    admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
    product_id VARCHAR(100) REFERENCES products(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_public_submissions_email ON public_submissions (contact_email);
CREATE INDEX IF NOT EXISTS idx_public_submissions_status ON public_submissions (status);
CREATE INDEX IF NOT EXISTS idx_public_submissions_token ON public_submissions (confirm_token);

CREATE TRIGGER set_updated_at_public_submissions
    BEFORE UPDATE ON public_submissions
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- Health professional applications (pros de santé - collectif)
-- ============================================================

CREATE TABLE IF NOT EXISTS health_prof_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    profession VARCHAR(255) NOT NULL,
    rpps_adeli VARCHAR(50),
    organization VARCHAR(255),
    motivation TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'pending_email',
    confirm_token VARCHAR(500) UNIQUE,
    email_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    is_collective_member BOOLEAN NOT NULL DEFAULT FALSE,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_health_prof_applications_email ON health_prof_applications (email);
CREATE INDEX IF NOT EXISTS idx_health_prof_applications_status ON health_prof_applications (status);

CREATE TRIGGER set_updated_at_health_prof_applications
    BEFORE UPDATE ON health_prof_applications
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
