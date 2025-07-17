-- Create main database if it doesn't exist
SELECT 'CREATE DATABASE aris'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'aris')\gexec

-- Create test database if it doesn't exist
SELECT 'CREATE DATABASE test_aris'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'test_aris')\gexec