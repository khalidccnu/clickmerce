-- Helper functions for permission-based RLS system with custom JWT auth

-- Function to get current user ID
-- This will be set by your API when making database calls
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS UUID AS $$
DECLARE
    user_id_text TEXT;
BEGIN
    user_id_text := current_setting('request.jwt.claims', true)::json -> 'user' ->> 'id';

    IF user_id_text IS NULL OR user_id_text = '' THEN
        RETURN '00000000-0000-0000-0000-000000000000'::UUID;
    END IF;

    RETURN user_id_text::UUID;
EXCEPTION WHEN OTHERS THEN
    RETURN '00000000-0000-0000-0000-000000000000'::UUID;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current user is a Super Admin
-- Super Admin has access to everything without specific permissions
CREATE OR REPLACE FUNCTION current_user_is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM users u
        JOIN user_roles ur ON u.id = ur.user_id
        JOIN roles r ON ur.role_id = r.id
        WHERE u.id = get_current_user_id()
        AND r.name = 'Super Admin'
        AND u.is_active = true 
        AND ur.is_active = true 
        AND r.is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if a specific user has a permission
CREATE OR REPLACE FUNCTION user_has_permission(user_uuid UUID, permission_name VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    -- First check if user is Super Admin
    IF EXISTS (
        SELECT 1 
        FROM users u
        JOIN user_roles ur ON u.id = ur.user_id
        JOIN roles r ON ur.role_id = r.id
        WHERE u.id = user_uuid
        AND r.name = 'Super Admin'
        AND u.is_active = true 
        AND ur.is_active = true 
        AND r.is_active = true
    ) THEN
        RETURN TRUE;
    END IF;

    -- Otherwise check specific permission
    RETURN EXISTS (
        SELECT 1 
        FROM users u
        JOIN user_roles ur ON u.id = ur.user_id
        JOIN roles r ON ur.role_id = r.id
        JOIN role_permissions rp ON r.id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE u.id = user_uuid 
        AND p.name = permission_name
        AND u.is_active = true 
        AND ur.is_active = true 
        AND r.is_active = true 
        AND rp.is_active = true 
        AND p.is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current authenticated user has permission
-- Super Admin bypasses all permission checks
CREATE OR REPLACE FUNCTION current_user_has_permission(permission_name VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    -- Super Admin has access to everything
    IF current_user_is_super_admin() THEN
        RETURN TRUE;
    END IF;
    
    -- Otherwise check specific permission
    RETURN user_has_permission(get_current_user_id(), permission_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
