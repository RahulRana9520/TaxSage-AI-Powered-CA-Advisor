-- 🚀 TAXSAGE SUPABASE DATABASE SCHEMA (FIXED VERSION)
-- Copy and paste this FIXED script into Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS app_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(128) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id UUID PRIMARY KEY REFERENCES app_users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    age INTEGER CHECK (age > 0 AND age < 120),
    location VARCHAR(255),
    phone_number VARCHAR(32), -- E.164 format with country code, e.g. +919876543210
    dependents INTEGER DEFAULT 0 CHECK (dependents >= 0),
    filing_status VARCHAR(16) CHECK (filing_status IN ('single', 'married', 'huf', 'other')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create income entries table
CREATE TABLE IF NOT EXISTS income_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    source VARCHAR(255) NOT NULL,
    amount DECIMAL(18,2) NOT NULL CHECK (amount >= 0),
    frequency VARCHAR(16) NOT NULL CHECK (frequency IN ('monthly', 'weekly', 'yearly', 'one-time')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create expense entries table
CREATE TABLE IF NOT EXISTS expense_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL CHECK (category IN (
        'food', 'transport', 'entertainment', 'shopping', 
        'bills', 'healthcare', 'education', 'investment', 'other'
    )),
    amount DECIMAL(18,2) NOT NULL CHECK (amount >= 0),
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT,
    level VARCHAR(16) CHECK (level IN ('basic', 'moderate', 'expensive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create budget allocations table
CREATE TABLE IF NOT EXISTS budget_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    monthly_amount DECIMAL(18,2) NOT NULL CHECK (monthly_amount >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, category)
);

-- Create user goals table
CREATE TABLE IF NOT EXISTS user_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    target_amount DECIMAL(18,2) NOT NULL CHECK (target_amount > 0),
    current_amount DECIMAL(18,2) DEFAULT 0 CHECK (current_amount >= 0),
    target_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create credit scores table
CREATE TABLE IF NOT EXISTS credit_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    credit_score INTEGER CHECK (credit_score >= 300 AND credit_score <= 850),
    band VARCHAR(32),
    provider VARCHAR(32),
    retrieved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    source VARCHAR(255),
    analysis_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Create chat sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_user_message BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create credit analysis table (for PDF uploads)
CREATE TABLE IF NOT EXISTS credit_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    file_name VARCHAR(255),
    file_size INTEGER,
    analysis_result JSONB,
    score INTEGER CHECK (score >= 300 AND score <= 850),
    recommendations TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create file uploads table
CREATE TABLE IF NOT EXISTS file_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500),
    file_type VARCHAR(100),
    file_size INTEGER,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance (only if they don't exist)
DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_users_email ON app_users(email);
    CREATE INDEX IF NOT EXISTS idx_income_user_id ON income_entries(user_id);
    CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expense_entries(user_id);
    CREATE INDEX IF NOT EXISTS idx_expenses_date ON expense_entries(expense_date);
    CREATE INDEX IF NOT EXISTS idx_expenses_category ON expense_entries(category);
    CREATE INDEX IF NOT EXISTS idx_budget_user_id ON budget_allocations(user_id);
    CREATE INDEX IF NOT EXISTS idx_goals_user_id ON user_goals(user_id);
    CREATE INDEX IF NOT EXISTS idx_goals_status ON user_goals(status);
    CREATE INDEX IF NOT EXISTS idx_credit_user_id ON credit_analysis(user_id);
    CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
    CREATE INDEX IF NOT EXISTS idx_file_uploads_user_id ON file_uploads(user_id);
EXCEPTION WHEN duplicate_table THEN
    -- Indexes already exist, continue
    NULL;
END $$;

-- Insert demo data for testing (only if not exists)
INSERT INTO app_users (id, email, password_hash, name) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'demo@taxsage.com', '$2b$10$example.hash.here', 'Demo User'),
('660e8400-e29b-41d4-a716-446655440001', 'test@taxsage.com', '$2b$10$example.hash.here', 'Test User')
ON CONFLICT (email) DO NOTHING;

INSERT INTO user_profiles (user_id, full_name, age, location, dependents, filing_status) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Demo User', 30, 'Mumbai', 2, 'married'),
('660e8400-e29b-41d4-a716-446655440001', 'Test User', 25, 'Delhi', 0, 'single')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO expense_entries (user_id, category, amount, expense_date, description, level) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'food', 500.00, '2025-11-01', 'Groceries', 'basic'),
('550e8400-e29b-41d4-a716-446655440000', 'transport', 200.00, '2025-11-01', 'Metro card recharge', 'basic'),
('550e8400-e29b-41d4-a716-446655440000', 'bills', 1500.00, '2025-11-02', 'Electricity bill', 'moderate'),
('550e8400-e29b-41d4-a716-446655440000', 'entertainment', 800.00, '2025-11-02', 'Movie tickets', 'moderate'),
('550e8400-e29b-41d4-a716-446655440000', 'shopping', 2500.00, '2025-11-03', 'Clothes shopping', 'expensive')
ON CONFLICT DO NOTHING;

INSERT INTO income_entries (user_id, source, amount, frequency) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Software Engineer Salary', 75000.00, 'monthly'),
('550e8400-e29b-41d4-a716-446655440000', 'Freelance Work', 15000.00, 'monthly'),
('660e8400-e29b-41d4-a716-446655440001', 'Marketing Manager Salary', 60000.00, 'monthly')
ON CONFLICT DO NOTHING;

INSERT INTO budget_allocations (user_id, category, monthly_amount) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'food', 8000.00),
('550e8400-e29b-41d4-a716-446655440000', 'transport', 3000.00),
('550e8400-e29b-41d4-a716-446655440000', 'entertainment', 5000.00),
('550e8400-e29b-41d4-a716-446655440000', 'bills', 12000.00),
('550e8400-e29b-41d4-a716-446655440000', 'shopping', 10000.00)
ON CONFLICT (user_id, category) DO NOTHING;

INSERT INTO user_goals (user_id, name, target_amount, current_amount, target_date, status) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Emergency Fund', 300000.00, 45000.00, '2026-06-01', 'active'),
('550e8400-e29b-41d4-a716-446655440000', 'House Down Payment', 1500000.00, 200000.00, '2027-01-01', 'active'),
('660e8400-e29b-41d4-a716-446655440001', 'New Car', 800000.00, 100000.00, '2026-03-01', 'active')
ON CONFLICT DO NOTHING;

INSERT INTO credit_scores (user_id, credit_score, band, provider, source) VALUES
('550e8400-e29b-41d4-a716-446655440000', 745, 'Good', 'CIBIL', 'Credit Bureau Report'),
('660e8400-e29b-41d4-a716-446655440001', 680, 'Fair', 'CIBIL', 'Bank Statement Analysis')
ON CONFLICT (user_id) DO NOTHING;

-- Success message
SELECT 'TaxSage database schema created successfully! 🎉' as result;
SELECT 'Tables created: ' || count(*) || ' tables' as tables_count FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'app_%' OR table_name LIKE 'user_%' OR table_name LIKE 'income_%' OR table_name LIKE 'expense_%' OR table_name LIKE 'budget_%' OR table_name LIKE 'credit_%' OR table_name LIKE 'chat_%' OR table_name LIKE 'file_%';
SELECT 'Demo data inserted for testing' as demo_data;
SELECT 'Database is ready for TaxSage app!' as status;