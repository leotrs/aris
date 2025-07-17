-- Create main database if it doesn't exist
SELECT 'CREATE DATABASE aris'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'aris')\gexec

-- Create test database if it doesn't exist
SELECT 'CREATE DATABASE test_aris'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'test_aris')\gexec

-- Create aris_test database if it doesn't exist (for environment variable consistency)
SELECT 'CREATE DATABASE aris_test'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'aris_test')\gexec