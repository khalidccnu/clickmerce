-- Create popups table
CREATE TABLE IF NOT EXISTS popups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    type VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    image VARCHAR,
    content TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_popups_type ON popups(type);
CREATE INDEX IF NOT EXISTS idx_popups_name ON popups(name);
CREATE INDEX IF NOT EXISTS idx_popups_is_active ON popups(is_active);
