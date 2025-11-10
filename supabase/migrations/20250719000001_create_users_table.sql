-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    name VARCHAR NOT NULL,
    phone VARCHAR UNIQUE NOT NULL,
    email VARCHAR UNIQUE,
    password VARCHAR,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    is_default_customer BOOLEAN NOT NULL DEFAULT FALSE,
    is_system_generated BOOLEAN NOT NULL DEFAULT FALSE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);
CREATE INDEX IF NOT EXISTS idx_users_is_default_customer ON users(is_default_customer);
CREATE INDEX IF NOT EXISTS idx_users_is_system_generated ON users(is_system_generated);
CREATE INDEX IF NOT EXISTS idx_users_is_verified ON users(is_verified);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
