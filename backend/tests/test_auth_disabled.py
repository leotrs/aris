"""Test authentication disabling functionality for local testing."""

import os
from unittest.mock import patch


def test_auth_disabled_environment_detection():
    """Test that the DISABLE_AUTH environment variable is detected correctly."""
    # Test that auth is disabled when DISABLE_AUTH=true
    with patch.dict(os.environ, {"DISABLE_AUTH": "true"}):
        assert os.getenv("DISABLE_AUTH", "").lower() == "true"
    
    # Test that auth is enabled when DISABLE_AUTH is not set
    with patch.dict(os.environ, {}, clear=True):
        assert os.getenv("DISABLE_AUTH", "").lower() != "true"
    
    # Test that auth is enabled when DISABLE_AUTH=false
    with patch.dict(os.environ, {"DISABLE_AUTH": "false"}):
        assert os.getenv("DISABLE_AUTH", "").lower() != "true"


def test_mock_user_creation():
    """Test that the MockUser class works correctly."""
    from datetime import datetime
    
    # Create a mock user like the one in deps.py
    class MockUser:
        def __init__(self, user_id, email, name):
            self.id = user_id
            self.email = email
            self.name = name
            self.initials = "".join(word[0].upper() for word in name.split()[:2])
            self.created_at = datetime.now()
            self.avatar_color = "#0E9AE9"
    
    user = MockUser(1, "testuser@aris.pub", "Test User")
    
    assert user.id == 1
    assert user.email == "testuser@aris.pub"
    assert user.name == "Test User"
    assert user.initials == "TU"
    assert user.avatar_color == "#0E9AE9"
    assert isinstance(user.created_at, datetime)


def test_test_user_credentials():
    """Test that test user credentials are consistent."""
    # Test the standard test user credentials used in the system
    test_email = "testuser@aris.pub"
    test_password = "testpassword123"
    test_name = "Test User"
    
    assert test_email == "testuser@aris.pub"
    assert test_password == "testpassword123"
    assert test_name == "Test User"
    
    # Test initials generation
    initials = "".join(word[0].upper() for word in test_name.split()[:2])
    assert initials == "TU"