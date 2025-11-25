-- Create notices table
CREATE TABLE IF NOT EXISTS notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    name VARCHAR NOT NULL,
    url VARCHAR,
    content TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notices_name ON notices(name);
CREATE INDEX IF NOT EXISTS idx_notices_url ON notices(url);
CREATE INDEX IF NOT EXISTS idx_notices_is_active ON notices(is_active);
