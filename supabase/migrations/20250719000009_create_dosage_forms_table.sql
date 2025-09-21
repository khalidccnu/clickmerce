-- Create dosage_forms table
CREATE TABLE IF NOT EXISTS dosage_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    name VARCHAR NOT NULL,
    slug VARCHAR UNIQUE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dosage_forms_name ON dosage_forms(name);
CREATE INDEX IF NOT EXISTS idx_dosage_forms_slug ON dosage_forms(slug);
CREATE INDEX IF NOT EXISTS idx_dosage_forms_is_active ON dosage_forms(is_active);

-- Create updated_at trigger
CREATE TRIGGER update_dosage_forms_updated_at 
    BEFORE UPDATE ON dosage_forms 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
