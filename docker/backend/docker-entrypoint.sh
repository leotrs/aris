#!/bin/bash
set -e

# Wait for database to be ready
echo "Waiting for database to be ready..."
until pg_isready -h postgres -p 5432 -U aris; do
  echo "Database is unavailable - sleeping"
  sleep 1
done

echo "Database is ready!"

# Run migrations
echo "Running database migrations..."
alembic upgrade head

# Seed database with user data
echo "Seeding database with user data..."
if [ -f /usr/local/share/seed_user.sql ]; then
    PGPASSWORD=aris psql -h postgres -U aris -d aris -f /usr/local/share/seed_user.sql -q || echo "Seed data already exists or failed - continuing..."
fi

# Start the application
echo "Starting FastAPI application..."
exec "$@"