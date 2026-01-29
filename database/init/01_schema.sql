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
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
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
    pricing_model pricing_model_enum,
    pricing_amount VARCHAR(100),
    pricing_details TEXT,
    last_updated DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GIN indexes for array columns (fast lookups)
CREATE INDEX idx_products_audience ON products USING GIN (audience);
CREATE INDEX idx_products_problems_solved ON products USING GIN (problems_solved);
CREATE INDEX idx_products_tags ON products USING GIN (tags);
CREATE INDEX idx_products_preference_match ON products USING GIN (preference_match);

-- Index on users email for fast login lookups
CREATE INDEX idx_users_email ON users (email);
