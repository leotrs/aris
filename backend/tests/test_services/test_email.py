"""Tests for email service functionality."""

import logging
from unittest.mock import patch, MagicMock

import pytest

from aris.services.email import EmailConfig, EmailService, get_email_service


class TestEmailConfig:
    """Test EmailConfig model."""

    def test_email_config_creation(self):
        """Test creating EmailConfig with valid data."""
        config = EmailConfig(
            resend_api_key="test_key",
            from_email="test@example.com"
        )
        assert config.resend_api_key == "test_key"
        assert config.from_email == "test@example.com"

    def test_email_config_default_from_email(self):
        """Test EmailConfig uses default from_email."""
        config = EmailConfig(resend_api_key="test_key")
        assert config.from_email == "noreply@aris.pub"


class TestEmailService:
    """Test EmailService functionality."""

    @patch('aris.services.email.resend')
    def test_email_service_initialization(self, mock_resend):
        """Test EmailService initialization sets API key."""
        config = EmailConfig(
            resend_api_key="test_key",
            from_email="test@example.com"
        )
        
        service = EmailService(config)
        assert service.config == config
        # Verify the API key was set on the mocked resend module
        assert mock_resend.api_key == "test_key"

    @pytest.mark.asyncio
    @patch('aris.services.email.resend')
    async def test_send_waitlist_confirmation_success(self, mock_resend):
        """Test successful email sending."""
        config = EmailConfig(
            resend_api_key="test_key",
            from_email="test@example.com"
        )
        
        # Mock successful email send
        mock_resend.Emails.send.return_value = {"id": "email_id"}
        
        service = EmailService(config)
        result = await service.send_waitlist_confirmation(
            to_email="user@example.com",
            name="Test User",
            unsubscribe_token="test_token"
        )
        
        assert result is True
        mock_resend.Emails.send.assert_called_once()
        
        # Verify email parameters
        call_args = mock_resend.Emails.send.call_args[0][0]
        assert call_args["from"] == "test@example.com"
        assert call_args["to"] == ["user@example.com"]
        assert "Welcome to the Aris Waitlist!" in call_args["subject"]
        assert "Test User" in call_args["html"]
        assert "test_token" in call_args["html"]

    @pytest.mark.asyncio
    @patch('aris.services.email.resend')
    async def test_send_waitlist_confirmation_failure(self, mock_resend, caplog):
        """Test email sending failure handling."""
        config = EmailConfig(
            resend_api_key="test_key",
            from_email="test@example.com"
        )
        
        # Mock email send failure
        mock_resend.Emails.send.side_effect = Exception("API Error")
        
        service = EmailService(config)
        
        with caplog.at_level(logging.ERROR):
            result = await service.send_waitlist_confirmation(
                to_email="user@example.com",
                name="Test User",
                unsubscribe_token="test_token"
            )
        
        assert result is False
        assert "Failed to send email to user@example.com" in caplog.text
        assert "API Error" in caplog.text

    @pytest.mark.asyncio
    @patch('aris.services.email.resend')
    async def test_email_template_content(self, mock_resend):
        """Test email template contains expected content."""
        config = EmailConfig(
            resend_api_key="test_key",
            from_email="test@example.com"
        )
        
        mock_resend.Emails.send.return_value = {"id": "email_id"}
        
        service = EmailService(config)
        await service.send_waitlist_confirmation(
            to_email="user@example.com",
            name="Dr. Jane Smith",
            unsubscribe_token="abc123"
        )
        
        call_args = mock_resend.Emails.send.call_args[0][0]
        html_content = call_args["html"]
        text_content = call_args["text"]
        
        # Check HTML content
        assert "Hi Dr. Jane Smith," in html_content
        assert "Welcome to Aris" in html_content
        assert "Web-native publishing" in html_content
        assert "Readable Science Markup (RSM)" in html_content
        assert "Seamless collaboration" in html_content
        assert "https://aris.pub/unsubscribe/abc123" in html_content
        
        # Check text content
        assert "Hi Dr. Jane Smith," in text_content
        assert "Welcome to Aris!" in text_content
        assert "Web-native publishing" in text_content
        assert "Readable Science Markup (RSM)" in text_content
        assert "https://aris.pub/unsubscribe/abc123" in text_content


class TestGetEmailService:
    """Test get_email_service function."""

    @patch('aris.services.email.settings')
    def test_get_email_service_with_valid_api_key(self, mock_settings, caplog):
        """Test get_email_service returns service with valid API key."""
        mock_settings.RESEND_API_KEY = "valid_key"
        mock_settings.FROM_EMAIL = "test@example.com"
        
        with caplog.at_level(logging.INFO):
            service = get_email_service()
        
        assert service is not None
        assert isinstance(service, EmailService)
        assert service.config.resend_api_key == "valid_key"
        assert service.config.from_email == "test@example.com"
        assert "Initializing email service with Resend" in caplog.text

    @patch('aris.services.email.settings')
    def test_get_email_service_with_empty_api_key(self, mock_settings, caplog):
        """Test get_email_service returns None with empty API key."""
        mock_settings.RESEND_API_KEY = ""
        mock_settings.FROM_EMAIL = "test@example.com"
        
        with caplog.at_level(logging.WARNING):
            service = get_email_service()
        
        assert service is None
        assert "Email service disabled: RESEND_API_KEY not configured" in caplog.text

    @patch('aris.services.email.settings')
    def test_get_email_service_with_placeholder_api_key(self, mock_settings, caplog):
        """Test get_email_service returns None with placeholder API key."""
        mock_settings.RESEND_API_KEY = "your_resend_api_key_here"
        mock_settings.FROM_EMAIL = "test@example.com"
        
        with caplog.at_level(logging.WARNING):
            service = get_email_service()
        
        assert service is None
        assert "Email service disabled: RESEND_API_KEY not configured" in caplog.text