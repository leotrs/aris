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

# Start the application
echo "Starting FastAPI application..."
exec "$@"