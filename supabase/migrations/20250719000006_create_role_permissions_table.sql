-- Create role_permissions table (junction table)
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Ensure unique combinations of role and permission
    UNIQUE(role_id, permission_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_is_active ON role_permissions(is_active);

-- Create updated_at trigger
CREATE TRIGGER update_role_permissions_updated_at 
    BEFORE UPDATE ON role_permissions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
