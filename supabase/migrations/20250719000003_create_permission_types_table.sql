-- Create permission_types table
CREATE TABLE IF NOT EXISTS permission_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    name VARCHAR NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_permission_types_name ON permission_types(name);
CREATE INDEX IF NOT EXISTS idx_permission_types_is_active ON permission_types(is_active);

-- Create updated_at trigger
CREATE TRIGGER update_permission_types_updated_at 
    BEFORE UPDATE ON permission_types 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
