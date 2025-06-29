#!/usr/bin/env python3
"""Debug script to check what's happening to the test user password hash."""

import asyncio
import os
from sqlalchemy import text
from aris.deps import ArisSession
from aris.security import hash_password, verify_password

async def debug_password_hash():
    """Debug the test user password hash issue."""
    print("🔍 DEBUGGING PASSWORD HASH ISSUE")
    print("")
    
    # Get credentials
    email = os.getenv("TEST_USER_EMAIL", "testuser@aris.pub")
    password = os.getenv("TEST_USER_PASSWORD", "testpassword123")
    
    print(f"Email: {email}")
    print(f"Password: {password}")
    print("")
    
    session = ArisSession()
    
    try:
        # Check current user state
        print("1. Checking current user state...")
        result = await session.execute(
            text("SELECT id, email, name, password_hash FROM users WHERE email = :email"),
            {"email": email}
        )
        user = result.first()
        
        if not user:
            print("❌ User not found!")
            return
            
        print(f"   User found: ID={user.id}, name='{user.name}'")
        print(f"   Password hash: {user.password_hash}")
        print("")
        
        # Test password verification
        print("2. Testing password verification...")
        is_valid = verify_password(password, user.password_hash)
        print(f"   Password valid: {is_valid}")
        print("")
        
        # Create a fresh hash and compare
        print("3. Creating fresh hash for comparison...")
        fresh_hash = hash_password(password)
        print(f"   Fresh hash: {fresh_hash}")
        print(f"   Fresh hash valid: {verify_password(password, fresh_hash)}")
        print(f"   Hashes match: {user.password_hash == fresh_hash}")
        print("")
        
        # Test multiple verifications
        print("4. Testing multiple password verifications...")
        for i in range(5):
            is_valid = verify_password(password, user.password_hash)
            print(f"   Attempt {i+1}: {is_valid}")
            await asyncio.sleep(0.1)
        print("")
        
        # Check if password hash changes somehow
        print("5. Checking for password hash corruption...")
        await session.refresh(user)
        result2 = await session.execute(
            text("SELECT password_hash FROM users WHERE email = :email"),
            {"email": email}
        )
        user2 = result2.first()
        hash_changed = user.password_hash != user2.password_hash
        print(f"   Hash changed during session: {hash_changed}")
        if hash_changed:
            print(f"   Original: {user.password_hash}")
            print(f"   Current:  {user2.password_hash}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        
    finally:
        await session.close()
        
    print("")
    print("🎯 DEBUG COMPLETE")

if __name__ == "__main__":
    asyncio.run(debug_password_hash())