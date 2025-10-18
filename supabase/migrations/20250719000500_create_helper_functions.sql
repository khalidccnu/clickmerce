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

-- Helper function to check permissions with dependencies
CREATE OR REPLACE FUNCTION current_user_has_permission_with_dependencies(
    permission_name VARCHAR,
    dependent_permissions text[] DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    dep_permission text;
    main_action text;
BEGIN
    -- Super Admin has access to everything
    IF current_user_is_super_admin() THEN
        RETURN TRUE;
    END IF;
    
    -- Check if user has the direct permission
    IF user_has_permission(get_current_user_id(), permission_name) THEN
        RETURN TRUE;
    END IF;
    
    -- Extract the action from the main permission
    main_action := split_part(permission_name, ':', 2);
    
    -- Only apply dependencies for read permissions
    IF main_action = 'read' AND dependent_permissions IS NOT NULL THEN
        FOREACH dep_permission IN ARRAY dependent_permissions
        LOOP
            DECLARE
                dep_permission_with_action text;
            BEGIN
                dep_permission_with_action := dep_permission || ':read';
                
                -- Check if user has the dependent permission with read action
                IF user_has_permission(get_current_user_id(), dep_permission_with_action) THEN
                    RETURN TRUE;
                END IF;
            END;
        END LOOP;
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create helper function for RLS policies with dependency support
CREATE OR REPLACE FUNCTION create_table_rls_policies(
    table_name text,
    id_column text DEFAULT NULL,
    permission_prefix text DEFAULT NULL,
    dependent_permissions text[] DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    policy_sql text;
    ownership_check text;
    policy_exists BOOLEAN;
    dep_array_literal text;
BEGIN
    -- Prepare ownership check if id_column is provided
    IF id_column IS NOT NULL THEN
        ownership_check := ' OR (get_current_user_id() = ' || id_column || ')';
    ELSE
        ownership_check := '';
    END IF;
    
    -- Prepare dependent permissions array literal
    IF dependent_permissions IS NOT NULL AND array_length(dependent_permissions, 1) > 0 THEN
        dep_array_literal := 'ARRAY[' || array_to_string(
            ARRAY(SELECT '''' || unnest(dependent_permissions) || '''' ), 
            ', '
        ) || ']';
    ELSE
        dep_array_literal := 'NULL';
    END IF;
    
    -- Enable RLS on the table
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
    
    -- Drop existing policies first to avoid conflicts when updating
    EXECUTE format('DROP POLICY IF EXISTS "%s_select_policy" ON %I', table_name, table_name);
    EXECUTE format('DROP POLICY IF EXISTS "%s_insert_policy" ON %I', table_name, table_name);
    EXECUTE format('DROP POLICY IF EXISTS "%s_update_policy" ON %I', table_name, table_name);
    EXECUTE format('DROP POLICY IF EXISTS "%s_delete_policy" ON %I', table_name, table_name);
    
    -- Create SELECT policy with dependencies
    policy_sql := format(
        'CREATE POLICY "%s_select_policy" ON %I FOR SELECT USING (current_user_has_permission_with_dependencies(''%s:read'', %s)%s)',
        table_name, table_name, permission_prefix, dep_array_literal, ownership_check
    );
    EXECUTE policy_sql;
    RAISE NOTICE 'Created SELECT policy for % using % permissions with dependencies: %', table_name, permission_prefix, dependent_permissions;
    
    -- Create INSERT policy without dependencies
    policy_sql := format(
        'CREATE POLICY "%s_insert_policy" ON %I FOR INSERT WITH CHECK (current_user_has_permission(''%s:write'')%s)',
        table_name, table_name, permission_prefix, ownership_check
    );
    EXECUTE policy_sql;
    RAISE NOTICE 'Created INSERT policy for % using % permissions (no dependencies)', table_name, permission_prefix;
    
    -- Create UPDATE policy without dependencies
    policy_sql := format(
        'CREATE POLICY "%s_update_policy" ON %I FOR UPDATE USING (current_user_has_permission(''%s:update'')%s)',
        table_name, table_name, permission_prefix, ownership_check
    );
    EXECUTE policy_sql;
    RAISE NOTICE 'Created UPDATE policy for % using % permissions (no dependencies)', table_name, permission_prefix;
    
    -- Create DELETE policy without dependencies
    policy_sql := format(
        'CREATE POLICY "%s_delete_policy" ON %I FOR DELETE USING (current_user_has_permission(''%s:delete''))',
        table_name, table_name, permission_prefix
    );
    EXECUTE policy_sql;
    RAISE NOTICE 'Created DELETE policy for % using % permissions (no dependencies)', table_name, permission_prefix;
    
    RAISE NOTICE 'Completed RLS policies with dependencies for table: % with permission prefix: %', table_name, permission_prefix;
END;
$$;

-- Create a combined helper function for convenience
CREATE OR REPLACE FUNCTION setup_table_security(
    permission_type_name text,
    table_name text,
    id_column text DEFAULT NULL,
    permission_prefix text DEFAULT NULL,
    dependent_permissions text[] DEFAULT NULL,
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
    
    -- Then create RLS policies with dependencies (using the same prefix)
    PERFORM create_table_rls_policies(table_name, id_column, actual_prefix, dependent_permissions);
    
    RAISE NOTICE 'Security setup completed for table: % with permission type: %, prefix: %, and dependencies: %', 
        table_name, permission_type_name, actual_prefix, dependent_permissions;
END;
$$;

-- Create specific permission dependency RLS policy utility
-- This creates an RLS policy for a specific permission with dependencies
CREATE OR REPLACE FUNCTION create_permission_dependency_policy(
    dependent_permissions text[],
    table_name text,
    actions text[]
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    action text;
    policy_name text;
    policy_sql text;
    dep_permission text;
    permission_checks text[];
    all_checks text;
BEGIN
    -- Loop through each action
    FOREACH action IN ARRAY actions
    LOOP
        policy_name := table_name || '_' || action || '_dependency_policy';
        permission_checks := ARRAY[]::text[];
        
        -- Add the direct permission check
        permission_checks := array_append(permission_checks, 
            format('current_user_has_permission(''%s:%s'')', table_name, action));
        
        -- Add dependency permission checks
        FOREACH dep_permission IN ARRAY dependent_permissions
        LOOP
            permission_checks := array_append(permission_checks, 
                format('current_user_has_permission(''%s:%s'')', dep_permission, action));
        END LOOP;
        
        -- Combine all permission checks with OR
        all_checks := array_to_string(permission_checks, ' OR ');
        
        -- Enable RLS if not already enabled
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
        
        -- Drop existing policy if it exists
        EXECUTE format('DROP POLICY IF EXISTS "%s" ON %I', policy_name, table_name);
        
        -- Create the appropriate policy based on action
        CASE action
            WHEN 'read' THEN
                policy_sql := format(
                    'CREATE POLICY "%s" ON %I FOR SELECT USING (%s)',
                    policy_name, table_name, all_checks
                );
            WHEN 'write' THEN
                policy_sql := format(
                    'CREATE POLICY "%s" ON %I FOR INSERT WITH CHECK (%s)',
                    policy_name, table_name, all_checks
                );
            WHEN 'update' THEN
                policy_sql := format(
                    'CREATE POLICY "%s" ON %I FOR UPDATE USING (%s)',
                    policy_name, table_name, all_checks
                );
            WHEN 'delete' THEN
                policy_sql := format(
                    'CREATE POLICY "%s" ON %I FOR DELETE USING (%s)',
                    policy_name, table_name, all_checks
                );
            ELSE
                RAISE EXCEPTION 'Unsupported action: %', action;
        END CASE;
        
        -- Execute the policy creation
        EXECUTE policy_sql;
        
        RAISE NOTICE 'Created % policy for %:% with dependencies: %', 
            action, table_name, action, dependent_permissions;
    END LOOP;
    
    RAISE NOTICE 'Completed dependency policies for table: % with dependencies: %', 
        table_name, dependent_permissions;
END;
$$;

-- Create specific permission-to-permission dependency mapping
-- This creates a function that checks if a user has a source permission and grants target permission access
CREATE OR REPLACE FUNCTION create_permission_mapping(
    source_permission text,
    target_permission text
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    target_table text;
    target_action text;
    policy_name text;
    policy_sql text;
BEGIN
    -- Extract table and action from target permission
    target_table := split_part(target_permission, ':', 1);
    target_action := split_part(target_permission, ':', 2);
    
    -- Validate that we have both parts
    IF target_table = '' OR target_action = '' THEN
        RAISE EXCEPTION 'Invalid target permission format. Expected format: table:action, got: %', target_permission;
    END IF;
    
    -- Validate that we have source permission in correct format
    IF split_part(source_permission, ':', 1) = '' OR split_part(source_permission, ':', 2) = '' THEN
        RAISE EXCEPTION 'Invalid source permission format. Expected format: table:action, got: %', source_permission;
    END IF;
    
    -- Create policy name
    policy_name := target_table || '_' || target_action || '_mapping_policy';
    
    -- Enable RLS if not already enabled
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', target_table);
    
    -- Drop existing mapping policy if it exists
    EXECUTE format('DROP POLICY IF EXISTS "%s" ON %I', policy_name, target_table);
    
    -- Create the appropriate policy based on target action
    CASE target_action
        WHEN 'read' THEN
            policy_sql := format(
                'CREATE POLICY "%s" ON %I FOR SELECT USING (current_user_has_permission(''%s'') OR current_user_has_permission(''%s''))',
                policy_name, target_table, target_permission, source_permission
            );
        WHEN 'write' THEN
            policy_sql := format(
                'CREATE POLICY "%s" ON %I FOR INSERT WITH CHECK (current_user_has_permission(''%s'') OR current_user_has_permission(''%s''))',
                policy_name, target_table, target_permission, source_permission
            );
        WHEN 'update' THEN
            policy_sql := format(
                'CREATE POLICY "%s" ON %I FOR UPDATE USING (current_user_has_permission(''%s'') OR current_user_has_permission(''%s''))',
                policy_name, target_table, target_permission, source_permission
            );
        WHEN 'delete' THEN
            policy_sql := format(
                'CREATE POLICY "%s" ON %I FOR DELETE USING (current_user_has_permission(''%s'') OR current_user_has_permission(''%s''))',
                policy_name, target_table, target_permission, source_permission
            );
        ELSE
            RAISE EXCEPTION 'Unsupported target action: %. Supported actions: read, write, update, delete', target_action;
    END CASE;
    
    -- Execute the policy creation
    EXECUTE policy_sql;
    
    RAISE NOTICE 'Created permission mapping: % -> % (Policy: %)', 
        source_permission, target_permission, policy_name;
END;
$$;

-- Create multiple permission mappings at once
CREATE OR REPLACE FUNCTION create_multiple_permission_mappings(
    source_permissions text[],
    target_permission text
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    target_table text;
    target_action text;
    policy_name text;
    policy_sql text;
    permission_checks text[];
    all_checks text;
    source_perm text;
BEGIN
    -- Extract table and action from target permission
    target_table := split_part(target_permission, ':', 1);
    target_action := split_part(target_permission, ':', 2);
    
    -- Validate target permission format
    IF target_table = '' OR target_action = '' THEN
        RAISE EXCEPTION 'Invalid target permission format. Expected format: table:action, got: %', target_permission;
    END IF;
    
    -- Validate source permissions
    FOREACH source_perm IN ARRAY source_permissions
    LOOP
        IF split_part(source_perm, ':', 1) = '' OR split_part(source_perm, ':', 2) = '' THEN
            RAISE EXCEPTION 'Invalid source permission format. Expected format: table:action, got: %', source_perm;
        END IF;
    END LOOP;
    
    -- Create policy name
    policy_name := target_table || '_' || target_action || '_multi_mapping_policy';
    
    -- Build permission checks array
    permission_checks := ARRAY[]::text[];
    
    -- Add the direct target permission check
    permission_checks := array_append(permission_checks, 
        format('current_user_has_permission(''%s'')', target_permission));
    
    -- Add all source permission checks
    FOREACH source_perm IN ARRAY source_permissions
    LOOP
        permission_checks := array_append(permission_checks, 
            format('current_user_has_permission(''%s'')', source_perm));
    END LOOP;
    
    -- Combine all permission checks with OR
    all_checks := array_to_string(permission_checks, ' OR ');
    
    -- Enable RLS if not already enabled
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', target_table);
    
    -- Drop existing mapping policy if it exists
    EXECUTE format('DROP POLICY IF EXISTS "%s" ON %I', policy_name, target_table);
    
    -- Create the appropriate policy based on target action
    CASE target_action
        WHEN 'read' THEN
            policy_sql := format(
                'CREATE POLICY "%s" ON %I FOR SELECT USING (%s)',
                policy_name, target_table, all_checks
            );
        WHEN 'write' THEN
            policy_sql := format(
                'CREATE POLICY "%s" ON %I FOR INSERT WITH CHECK (%s)',
                policy_name, target_table, all_checks
            );
        WHEN 'update' THEN
            policy_sql := format(
                'CREATE POLICY "%s" ON %I FOR UPDATE USING (%s)',
                policy_name, target_table, all_checks
            );
        WHEN 'delete' THEN
            policy_sql := format(
                'CREATE POLICY "%s" ON %I FOR DELETE USING (%s)',
                policy_name, target_table, all_checks
            );
        ELSE
            RAISE EXCEPTION 'Unsupported target action: %. Supported actions: read, write, update, delete', target_action;
    END CASE;
    
    -- Execute the policy creation
    EXECUTE policy_sql;
    
    RAISE NOTICE 'Created multiple permission mapping: % -> % (Policy: %)', 
        source_permissions, target_permission, policy_name;
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
