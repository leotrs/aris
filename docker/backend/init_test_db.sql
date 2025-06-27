-- Create test database if it doesn't exist
SELECT 'CREATE DATABASE aris_test'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'aris_test')\gexec