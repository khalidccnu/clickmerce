-- Create users_info table
CREATE TABLE IF NOT EXISTS users_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    birthday TIMESTAMPTZ,
    blood_group VARCHAR,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_info_user_id ON users_info(user_id);
CREATE INDEX IF NOT EXISTS idx_users_info_birthday ON users_info(birthday);
CREATE INDEX IF NOT EXISTS idx_users_info_is_active ON users_info(is_active);

-- Create updated_at trigger
CREATE TRIGGER update_users_info_updated_at 
    BEFORE UPDATE ON users_info 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
