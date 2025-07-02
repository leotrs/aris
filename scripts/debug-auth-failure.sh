#!/bin/bash

# Validate environment variables first
node docker/env-check.js

echo "🔍 DEBUGGING AUTH FAILURE - Let's find the real problem"
echo ""

# Test the actual credentials that are being used
echo "1. Testing environment variables..."
echo "TEST_USER_EMAIL: ${TEST_USER_EMAIL:-'NOT SET'}"
echo "TEST_USER_PASSWORD length: ${#TEST_USER_PASSWORD}"
echo "TEST_USER_PASSWORD starts with: ${TEST_USER_PASSWORD:0:4}..."
echo ""

# Test the test user creation
echo "2. Testing test user creation..."
cd backend
uv run python scripts/reset_test_user.py
echo ""

# Test backend auth directly
echo "3. Testing backend authentication directly..."
echo "Starting backend..."
uv run uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
sleep 5

# Test login endpoint directly
echo "Testing login with credentials..."
LOGIN_RESPONSE=$(curl -s -w "HTTP_STATUS:%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"${TEST_USER_EMAIL}\", \"password\": \"${TEST_USER_PASSWORD}\"}" \
  http://localhost:8000/login)

echo "Login response: $LOGIN_RESPONSE"

# Test multiple login attempts to see if there's a pattern
echo ""
echo "4. Testing multiple consecutive logins..."
for i in {1..3}; do
  echo "Login attempt $i:"
  ATTEMPT=$(curl -s -w "HTTP_STATUS:%{http_code}" \
    -X POST \
    -H "Content-Type: application/json" \
    -d "{\"email\": \"${TEST_USER_EMAIL}\", \"password\": \"${TEST_USER_PASSWORD}\"}" \
    http://localhost:8000/login)
  echo "  Response: $ATTEMPT"
  sleep 1
done

# Check what's in the database
echo ""
echo "5. Checking database state..."
uv run python -c "
import asyncio
import os
from sqlalchemy import text
from aris.deps import ArisSession

async def check_user():
    session = ArisSession()
    try:
        result = await session.execute(
            text('SELECT id, email, name, password_hash FROM users WHERE email = :email'),
            {'email': os.getenv('TEST_USER_EMAIL', 'testuser@aris.pub')}
        )
        user = result.first()
        if user:
            print(f'User found: ID={user.id}, email={user.email}, name={user.name}')
            print(f'Password hash starts with: {user.password_hash[:20]}...')
        else:
            print('User not found in database!')
    finally:
        await session.close()

asyncio.run(check_user())
"

# Clean up
kill $BACKEND_PID 2>/dev/null || true

echo ""
echo "🎯 DIAGNOSIS COMPLETE"
echo "Check the outputs above to identify the real issue"