-- Create postgres user if it doesn't exist
-- This ensures compatibility between local dev and CI environments
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'postgres') THEN
        CREATE USER postgres WITH PASSWORD 'postgres' SUPERUSER;
    END IF;
END
$$;