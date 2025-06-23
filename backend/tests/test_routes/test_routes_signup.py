"""Tests for signup route endpoints."""

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from aris.crud.signup import create_signup, get_signup_by_email
from aris.models.models import InterestLevel, SignupStatus


class TestCreateSignupEndpoint:
    """Test POST /signup/ endpoint."""

    async def test_create_signup_success(self, client: AsyncClient):
        """Test successful signup creation."""
        signup_data = {
            "email": "newuser@example.com",
            "name": "New User",
            "institution": "Test University",
            "research_area": "Computer Science",
            "interest_level": "ready"
        }
        
        response = await client.post("/signup/", json=signup_data)
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["email"] == "newuser@example.com"
        assert data["name"] == "New User"
        assert data["institution"] == "Test University"
        assert data["research_area"] == "Computer Science"
        assert data["interest_level"] == "ready"
        assert data["status"] == "active"
        assert "id" in data
        assert "created_at" in data

    async def test_create_signup_minimal_data(self, client: AsyncClient):
        """Test signup creation with minimal required data."""
        signup_data = {
            "email": "minimal@example.com",
            "name": "Minimal User"
        }
        
        response = await client.post("/signup/", json=signup_data)
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["email"] == "minimal@example.com"
        assert data["name"] == "Minimal User"
        assert data["institution"] is None
        assert data["research_area"] is None
        assert data["interest_level"] is None
        assert data["status"] == "active"

    async def test_create_signup_duplicate_email(self, client: AsyncClient):
        """Test signup creation with duplicate email."""
        # First signup
        signup_data = {
            "email": "duplicate@example.com",
            "name": "First User"
        }
        response = await client.post("/signup/", json=signup_data)
        assert response.status_code == 200
        
        # Second signup with same email
        signup_data = {
            "email": "duplicate@example.com",
            "name": "Second User"
        }
        response = await client.post("/signup/", json=signup_data)
        
        assert response.status_code == 409
        data = response.json()
        assert data["detail"]["error"] == "duplicate_email"
        assert "already registered" in data["detail"]["message"]

    async def test_create_signup_invalid_email(self, client: AsyncClient):
        """Test signup creation with invalid email format."""
        signup_data = {
            "email": "invalid-email",
            "name": "Test User"
        }
        
        response = await client.post("/signup/", json=signup_data)
        
        assert response.status_code == 422
        data = response.json()
        assert "detail" in data
        assert "email" in str(data).lower()

    async def test_create_signup_missing_required_fields(self, client: AsyncClient):
        """Test signup creation with missing required fields."""
        # Missing name
        signup_data = {
            "email": "test@example.com"
        }
        response = await client.post("/signup/", json=signup_data)
        assert response.status_code == 422
        
        # Missing email
        signup_data = {
            "name": "Test User"
        }
        response = await client.post("/signup/", json=signup_data)
        assert response.status_code == 422

    async def test_create_signup_invalid_interest_level(self, client: AsyncClient):
        """Test signup creation with invalid interest level."""
        signup_data = {
            "email": "test@example.com",
            "name": "Test User",
            "interest_level": "invalid_level"
        }
        
        response = await client.post("/signup/", json=signup_data)
        
        assert response.status_code == 422

    async def test_create_signup_xss_protection(self, client: AsyncClient):
        """Test that XSS attempts are sanitized."""
        signup_data = {
            "email": "xss@example.com",
            "name": "<script>alert('xss')</script>Test User",
            "institution": "<img src=x onerror=alert('xss')>University",
            "research_area": "Computer Science<script>evil()</script>"
        }
        
        response = await client.post("/signup/", json=signup_data)
        
        assert response.status_code == 200
        data = response.json()
        
        # Check that HTML tags are escaped
        assert "<script>" not in data["name"]
        assert "&lt;script&gt;" in data["name"]
        assert "<img" not in data["institution"]
        assert "&lt;img" in data["institution"]

    async def test_create_signup_empty_strings(self, client: AsyncClient):
        """Test signup creation with empty string values."""
        signup_data = {
            "email": "empty@example.com",
            "name": "",  # Actually empty
            "institution": "",
            "research_area": ""
        }
        
        response = await client.post("/signup/", json=signup_data)
        
        # Should fail because name is empty
        assert response.status_code == 422


class TestCheckSignupStatusEndpoint:
    """Test GET /signup/status endpoint."""

    async def test_check_signup_status_exists(self, client: AsyncClient):
        """Test status check for existing email."""
        # Create signup first
        signup_data = {
            "email": "exists@example.com",
            "name": "Exists User"
        }
        await client.post("/signup/", json=signup_data)
        
        # Check status
        response = await client.get("/signup/status?email=exists@example.com")
        
        assert response.status_code == 200
        data = response.json()
        assert data["exists"] is True

    async def test_check_signup_status_not_exists(self, client: AsyncClient):
        """Test status check for non-existent email."""
        response = await client.get("/signup/status?email=notexists@example.com")
        
        assert response.status_code == 200
        data = response.json()
        assert data["exists"] is False

    async def test_check_signup_status_invalid_email(self, client: AsyncClient):
        """Test status check with invalid email format."""
        response = await client.get("/signup/status?email=invalid-email")
        
        # FastAPI query validation should catch this
        assert response.status_code == 422

    async def test_check_signup_status_missing_email(self, client: AsyncClient):
        """Test status check without email parameter."""
        response = await client.get("/signup/status")
        
        assert response.status_code == 422


class TestUnsubscribeEndpoint:
    """Test DELETE /signup/unsubscribe endpoint."""

    async def test_unsubscribe_success(self, client: AsyncClient):
        """Test successful unsubscribe."""
        # Create signup first
        signup_data = {
            "email": "unsubscribe@example.com",
            "name": "Unsubscribe User"
        }
        await client.post("/signup/", json=signup_data)
        
        # Unsubscribe
        unsubscribe_data = {
            "email": "unsubscribe@example.com",
            "token": "dummy-token"  # Token validation not implemented yet
        }
        response = await client.delete("/signup/unsubscribe", content=unsubscribe_data)
        
        assert response.status_code == 200
        data = response.json()
        assert "Successfully unsubscribed" in data["message"]

    async def test_unsubscribe_email_not_found(self, client: AsyncClient):
        """Test unsubscribe for non-existent email."""
        unsubscribe_data = {
            "email": "notfound@example.com",
            "token": "dummy-token"
        }
        response = await client.delete("/signup/unsubscribe", content=unsubscribe_data)
        
        assert response.status_code == 404
        data = response.json()
        assert data["detail"]["error"] == "email_not_found"

    async def test_unsubscribe_invalid_email(self, client: AsyncClient):
        """Test unsubscribe with invalid email format."""
        unsubscribe_data = {
            "email": "invalid-email",
            "token": "dummy-token"
        }
        response = await client.delete("/signup/unsubscribe", content=unsubscribe_data)
        
        assert response.status_code == 422

    async def test_unsubscribe_missing_fields(self, client: AsyncClient):
        """Test unsubscribe with missing required fields."""
        # Missing token
        response = await client.delete("/signup/unsubscribe", content={"email": "test@example.com"})
        assert response.status_code == 422
        
        # Missing email
        response = await client.delete("/signup/unsubscribe", content={"token": "dummy-token"})
        assert response.status_code == 422


class TestSignupEndpointIntegration:
    """Integration tests for signup endpoints."""

    async def test_complete_signup_flow(self, client: AsyncClient):
        """Test complete signup and unsubscribe flow."""
        email = "flow@example.com"
        
        # 1. Check email doesn't exist
        response = await client.get(f"/signup/status?email={email}")
        assert response.json()["exists"] is False
        
        # 2. Create signup
        signup_data = {
            "email": email,
            "name": "Flow User",
            "interest_level": "planning"
        }
        response = await client.post("/signup/", json=signup_data)
        assert response.status_code == 200
        signup_id = response.json()["id"]
        
        # 3. Check email now exists
        response = await client.get(f"/signup/status?email={email}")
        assert response.json()["exists"] is True
        
        # 4. Unsubscribe
        unsubscribe_data = {
            "email": email,
            "token": "dummy-token"
        }
        response = await client.delete("/signup/unsubscribe", content=unsubscribe_data)
        assert response.status_code == 200
        
        # 5. Email still exists (soft delete/unsubscribe)
        response = await client.get(f"/signup/status?email={email}")
        assert response.json()["exists"] is True

    async def test_signup_with_all_fields(self, client: AsyncClient):
        """Test signup with all possible fields filled."""
        signup_data = {
            "email": "complete@example.com",
            "name": "Dr. Complete User",
            "institution": "Complete University of Science",
            "research_area": "Computational Biology and Bioinformatics",
            "interest_level": "migrating"
        }
        
        response = await client.post("/signup/", json=signup_data)
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify all fields are preserved
        for key, value in signup_data.items():
            assert data[key] == value
        
        # Verify computed fields
        assert data["status"] == "active"
        assert isinstance(data["id"], int)
        assert data["created_at"] is not None

    async def test_multiple_signups_different_emails(self, client: AsyncClient):
        """Test creating multiple signups with different emails."""
        emails = [
            "user1@example.com",
            "user2@example.com", 
            "user3@example.com"
        ]
        
        created_ids = []
        
        for i, email in enumerate(emails):
            signup_data = {
                "email": email,
                "name": f"User {i+1}",
                "interest_level": ["exploring", "planning", "ready"][i]
            }
            
            response = await client.post("/signup/", json=signup_data)
            assert response.status_code == 200
            
            data = response.json()
            created_ids.append(data["id"])
            
            # Verify unique IDs
            assert data["id"] not in created_ids[:-1]

    async def test_error_response_format(self, client: AsyncClient):
        """Test that error responses follow the expected format."""
        # Test duplicate email error format
        signup_data = {"email": "error@example.com", "name": "User"}
        await client.post("/signup/", json=signup_data)  # Create first
        
        response = await client.post("/signup/", json=signup_data)  # Duplicate
        assert response.status_code == 409
        
        data = response.json()
        assert "detail" in data
        assert "error" in data["detail"]
        assert "message" in data["detail"]
        assert "details" in data["detail"]