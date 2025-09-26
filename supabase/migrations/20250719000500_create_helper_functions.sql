-- Create helper functions that work reliably
-- This builds on the successful direct SQL approach

-- Create helper function for permissions
CREATE OR REPLACE FUNCTION create_table_permissions(
    permission_type_name text,
    table_name text,
    permission_actions text[] DEFAULT ARRAY['read', 'write', 'update', 'delete']
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    action text;
    permission_name text;
    type_id uuid;
    type_exists BOOLEAN;
    permission_exists BOOLEAN;
BEGIN
    -- First check if the permission type exists
    SELECT EXISTS(SELECT 1 FROM permission_types WHERE name = permission_type_name) INTO type_exists;
    
    IF NOT type_exists THEN
        INSERT INTO permission_types (name)
        VALUES (permission_type_name);
    END IF;
    
    -- Get the permission type ID
    SELECT id INTO type_id FROM permission_types WHERE name = permission_type_name;
    
    -- Create permissions for each action
    FOREACH action IN ARRAY permission_actions
    LOOP
        permission_name := table_name || ':' || action;
        
        -- Check if permission already exists
        SELECT EXISTS(SELECT 1 FROM permissions WHERE name = permission_name) INTO permission_exists;
        
        IF NOT permission_exists THEN
            INSERT INTO permissions (name, permission_type_id)
            VALUES (permission_name, type_id);
        END IF;
        
        RAISE NOTICE 'Created permission: %', permission_name;
    END LOOP;
    
    RAISE NOTICE 'Completed permissions for permission type: % with table: %', permission_type_name, table_name;
END;
$$;

-- Create helper function for RLS policies
CREATE OR REPLACE FUNCTION create_table_rls_policies(
    table_name text,
    id_column text DEFAULT NULL,
    permission_prefix text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    policy_sql text;
    ownership_check text;
    policy_exists BOOLEAN;
BEGIN
    -- Prepare ownership check if id_column is provided
    IF id_column IS NOT NULL THEN
        ownership_check := ' OR (get_current_user_id() = ' || id_column || ')';
    ELSE
        ownership_check := '';
    END IF;
    
    -- Enable RLS on the table
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
    
    -- Create SELECT policy (only if it doesn't exist)
    SELECT EXISTS(SELECT 1 FROM pg_policies WHERE tablename = table_name AND policyname = table_name || '_select_policy') INTO policy_exists;
    IF NOT policy_exists THEN
        policy_sql := format(
            'CREATE POLICY "%s_select_policy" ON %I FOR SELECT USING (current_user_has_permission(''%s:read'')%s)',
            table_name, table_name, permission_prefix, ownership_check
        );
        EXECUTE policy_sql;
        RAISE NOTICE 'Created SELECT policy for % using % permissions', table_name, permission_prefix;
    END IF;
    
    -- Create INSERT policy (only if it doesn't exist)
    SELECT EXISTS(SELECT 1 FROM pg_policies WHERE tablename = table_name AND policyname = table_name || '_insert_policy') INTO policy_exists;
    IF NOT policy_exists THEN
        policy_sql := format(
            'CREATE POLICY "%s_insert_policy" ON %I FOR INSERT WITH CHECK (current_user_has_permission(''%s:write'')%s)',
            table_name, table_name, permission_prefix, ownership_check
        );
        EXECUTE policy_sql;
        RAISE NOTICE 'Created INSERT policy for % using % permissions', table_name, permission_prefix;
    END IF;
    
    -- Create UPDATE policy (only if it doesn't exist)
    SELECT EXISTS(SELECT 1 FROM pg_policies WHERE tablename = table_name AND policyname = table_name || '_update_policy') INTO policy_exists;
    IF NOT policy_exists THEN
        policy_sql := format(
            'CREATE POLICY "%s_update_policy" ON %I FOR UPDATE USING (current_user_has_permission(''%s:update'')%s)',
            table_name, table_name, permission_prefix, ownership_check
        );
        EXECUTE policy_sql;
        RAISE NOTICE 'Created UPDATE policy for % using % permissions', table_name, permission_prefix;
    END IF;
    
    -- Create DELETE policy (only if it doesn't exist)
    SELECT EXISTS(SELECT 1 FROM pg_policies WHERE tablename = table_name AND policyname = table_name || '_delete_policy') INTO policy_exists;
    IF NOT policy_exists THEN
        policy_sql := format(
            'CREATE POLICY "%s_delete_policy" ON %I FOR DELETE USING (current_user_has_permission(''%s:delete''))',
            table_name, table_name, permission_prefix
        );
        EXECUTE policy_sql;
        RAISE NOTICE 'Created DELETE policy for % using % permissions', table_name, permission_prefix;
    END IF;
    
    RAISE NOTICE 'Completed RLS policies for table: % with permission prefix: %', table_name, permission_prefix;
END;
$$;

-- Create a combined helper function for convenience
CREATE OR REPLACE FUNCTION setup_table_security(
    permission_type_name text,
    table_name text,
    id_column text DEFAULT NULL,
    permission_prefix text DEFAULT NULL,
    permission_actions text[] DEFAULT ARRAY['read', 'write', 'update', 'delete']
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    actual_prefix text;
BEGIN
    -- Use provided permission_prefix or default to table_name
    actual_prefix := COALESCE(permission_prefix, table_name);
    
    -- Create permissions first (using the permission type name and actual prefix as table name)
    PERFORM create_table_permissions(permission_type_name, actual_prefix, permission_actions);
    
    -- Then create RLS policies (using the same prefix)
    PERFORM create_table_rls_policies(table_name, id_column, actual_prefix);
    
    RAISE NOTICE 'Security setup completed for table: % with permission type: % and prefix: %', table_name, permission_type_name, actual_prefix;
END;
$$;

-- Create helper function for updating updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create helper function for updating product quantity
CREATE OR REPLACE FUNCTION update_product_quantity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE products
        SET quantity = (
            SELECT COALESCE(SUM(quantity), 0) 
            FROM product_variations 
            WHERE product_id = NEW.product_id
        )
        WHERE id = NEW.product_id;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE products
        SET quantity = (
            SELECT COALESCE(SUM(quantity), 0) 
            FROM product_variations 
            WHERE product_id = OLD.product_id
        )
        WHERE id = OLD.product_id;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
