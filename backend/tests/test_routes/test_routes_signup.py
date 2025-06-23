"""Tests for signup route endpoints."""

from httpx import AsyncClient

from aris.crud.signup import get_signup_by_email
from aris.models.models import SignupStatus


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
        assert "unsubscribe_token" in data
        assert len(data["unsubscribe_token"]) > 10  # Token should be reasonably long

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
        assert "unsubscribe_token" in data

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
        
        # Query parameter validation is less strict, so this might return 200 with exists=False
        # But it should not crash the application
        assert response.status_code in [200, 422]
        if response.status_code == 200:
            data = response.json()
            assert "exists" in data

    async def test_check_signup_status_missing_email(self, client: AsyncClient):
        """Test status check without email parameter."""
        response = await client.get("/signup/status")
        
        assert response.status_code == 422


class TestUnsubscribeEndpoint:
    """Test DELETE /signup/unsubscribe/{token} endpoint."""

    async def test_unsubscribe_success(self, client: AsyncClient, db_session):
        """Test successful unsubscribe with valid token."""
        # Create signup first
        signup_data = {
            "email": "unsubscribe@example.com",
            "name": "Unsubscribe User"
        }
        create_response = await client.post("/signup/", json=signup_data)
        assert create_response.status_code == 200
        
        # Extract unsubscribe token from response
        signup_data = create_response.json()
        unsubscribe_token = signup_data["unsubscribe_token"]
        
        # Unsubscribe using token
        response = await client.delete(f"/signup/unsubscribe/{unsubscribe_token}")
        
        assert response.status_code == 200
        data = response.json()
        assert "Successfully unsubscribed" in data["message"]
        
        # Verify unsubscribed_at timestamp is set
        signup = await get_signup_by_email("unsubscribe@example.com", db_session)
        assert signup.status == SignupStatus.UNSUBSCRIBED
        assert signup.unsubscribed_at is not None

    async def test_unsubscribe_invalid_token(self, client: AsyncClient):
        """Test unsubscribe with invalid/non-existent token."""
        invalid_token = "invalid-token-123"
        response = await client.delete(f"/signup/unsubscribe/{invalid_token}")
        
        assert response.status_code == 404
        data = response.json()
        assert data["detail"]["error"] == "invalid_token"
        assert "Invalid or expired unsubscribe token" in data["detail"]["message"]

    async def test_unsubscribe_already_unsubscribed(self, client: AsyncClient, db_session):
        """Test unsubscribe with token for already unsubscribed user."""
        # Create signup
        signup_data = {
            "email": "already_unsubscribed@example.com",
            "name": "Already Unsubscribed User"
        }
        create_response = await client.post("/signup/", json=signup_data)
        unsubscribe_token = create_response.json()["unsubscribe_token"]
        
        # First unsubscribe
        response1 = await client.delete(f"/signup/unsubscribe/{unsubscribe_token}")
        assert response1.status_code == 200
        
        # Verify unsubscribed_at is set
        signup = await get_signup_by_email("already_unsubscribed@example.com", db_session)
        assert signup.unsubscribed_at is not None
        first_unsubscribe_time = signup.unsubscribed_at
        
        # Second unsubscribe attempt
        response2 = await client.delete(f"/signup/unsubscribe/{unsubscribe_token}")
        assert response2.status_code == 400
        data = response2.json()
        assert data["detail"]["error"] == "already_unsubscribed"
        
        # Verify unsubscribed_at timestamp didn't change
        signup = await get_signup_by_email("already_unsubscribed@example.com", db_session)
        assert signup.unsubscribed_at == first_unsubscribe_time

    async def test_unsubscribe_empty_token(self, client: AsyncClient):
        """Test unsubscribe with empty token."""
        response = await client.delete("/signup/unsubscribe/")
        
        # Should return 404 or 405 depending on route matching
        assert response.status_code in [404, 405]


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
        signup_data = response.json()
        signup_id = signup_data["id"]
        unsubscribe_token = signup_data["unsubscribe_token"]
        
        # 3. Check email now exists
        response = await client.get(f"/signup/status?email={email}")
        assert response.json()["exists"] is True
        
        # 4. Unsubscribe using token
        response = await client.delete(f"/signup/unsubscribe/{unsubscribe_token}")
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