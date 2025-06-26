import logging
from typing import Optional

import resend
from pydantic import BaseModel

from ..config import settings


logger = logging.getLogger(__name__)


class EmailConfig(BaseModel):
    resend_api_key: str
    from_email: str = "noreply@aris.pub"


class EmailService:
    def __init__(self, config: EmailConfig):
        self.config = config
        resend.api_key = config.resend_api_key
    
    async def send_waitlist_confirmation(
        self,
        to_email: str,
        name: str,
        unsubscribe_token: str
    ) -> bool:
        """Send waitlist confirmation email."""
        logger.info(f"Attempting to send confirmation email to {to_email}")
        try:
            unsubscribe_url = f"https://aris.pub/unsubscribe/{unsubscribe_token}"
            
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Aris Waitlist</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <img src="https://aris.pub/logo.png" alt="Aris" style="height: 48px; margin-bottom: 16px;" />
                    <h1 style="color: #2563eb; margin: 0;">Welcome to Aris</h1>
                    <p style="color: #6b7280; margin: 5px 0 0 0;">The future of scientific publishing</p>
                </div>
                
                <div style="background: #f8fafc; border-radius: 8px; padding: 30px; margin-bottom: 30px;">
                    <h2 style="margin-top: 0; color: #1f2937;">Hi {name},</h2>
                    <p>Thank you for joining the Aris waitlist! We're excited to have you as part of our community of researchers, academics, and science enthusiasts.</p>
                    
                    <p>Aris is revolutionizing scientific publishing with:</p>
                    <ul style="margin: 20px 0;">
                        <li><strong>Web-native publishing</strong> - Interactive, multimedia-rich manuscripts</li>
                        <li><strong>Readable Science Markup (RSM)</strong> - A modern format for scientific content</li>
                        <li><strong>Seamless collaboration</strong> - Built for modern research workflows</li>
                    </ul>
                    
                    <p>We'll keep you updated on our progress and let you know as soon as we're ready for early access.</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://aris.pub" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Visit Aris.pub</a>
                    </div>
                </div>
                
                <div style="text-align: center; color: #6b7280; font-size: 14px;">
                    <p>Questions? Reply to this email or visit our website.</p>
                    <p>
                        <a href="{unsubscribe_url}" style="color: #6b7280;">Unsubscribe</a> | 
                        <a href="https://aris.pub" style="color: #6b7280;">Aris.pub</a>
                    </p>
                </div>
            </body>
            </html>
            """
            
            text_content = f"""
            Welcome to Aris!
            
            Hi {name},
            
            Thank you for joining the Aris waitlist! We're excited to have you as part of our community of researchers, academics, and science enthusiasts.
            
            Aris is revolutionizing scientific publishing with:
            • Web-native publishing - Interactive, multimedia-rich manuscripts
            • Readable Science Markup (RSM) - A modern format for scientific content  
            • Seamless collaboration - Built for modern research workflows
            
            We'll keep you updated on our progress and let you know as soon as we're ready for early access.
            
            Visit us at: https://aris.pub
            
            Questions? Reply to this email or visit our website.
            Unsubscribe: {unsubscribe_url}
            """
            
            params = {
                "from": self.config.from_email,
                "to": [to_email],
                "subject": "Welcome to the Aris Waitlist! 🚀",
                "html": html_content,
                "text": text_content,
            }
            
            resend.Emails.send(params)
            logger.info(f"Successfully sent confirmation email to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False


def get_email_service() -> Optional[EmailService]:
    """Get configured email service instance."""
    if not settings.RESEND_API_KEY or settings.RESEND_API_KEY == "your_resend_api_key_here":
        logger.warning("Email service disabled: RESEND_API_KEY not configured")
        return None
        
    logger.info("Initializing email service with Resend")
    config = EmailConfig(
        resend_api_key=settings.RESEND_API_KEY,
        from_email=settings.FROM_EMAIL
    )
    
    return EmailService(config)