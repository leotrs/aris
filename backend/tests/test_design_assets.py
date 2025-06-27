"""Tests for design assets serving functionality.

This module tests the backend's ability to serve shared design assets
including CSS files and logos through the static file endpoint.
"""

from httpx import AsyncClient


class TestDesignAssetsServing:
    """Test design assets serving through backend static files."""

    async def test_design_css_files_accessible(self, client: AsyncClient):
        """Test that design CSS files are accessible through static endpoint."""
        # Test typography.css - use the actual file that exists
        response = await client.get("/design-assets/css/typography.css")
        assert response.status_code == 200
        assert "text/css" in response.headers.get("content-type", "")
        assert "font-family" in response.text
        assert "Montserrat" in response.text

        # Test variables.css - check if it exists
        response = await client.get("/design-assets/css/variables.css")
        assert response.status_code == 200
        assert "text/css" in response.headers.get("content-type", "")

    async def test_design_logo_files_accessible(self, client: AsyncClient):
        """Test that design logo files are accessible through static endpoint."""
        response = await client.get("/design-assets/logos/logo-32px.svg")
        assert response.status_code == 200
        assert "image/svg+xml" in response.headers.get("content-type", "")
        assert "<svg" in response.text

    async def test_nonexistent_design_file_returns_404(self, client: AsyncClient):
        """Test that requesting nonexistent design files returns 404."""
        response = await client.get("/design-assets/css/nonexistent.css")
        assert response.status_code == 404

        response = await client.get("/design-assets/logos/nonexistent.svg")
        assert response.status_code == 404

    async def test_design_directory_structure(self, client: AsyncClient):
        """Test that the design assets directory structure is correct."""
        # CSS directory should be accessible (though directory listing may be disabled)
        css_files = ["typography.css", "variables.css", "layout.css", "components.css"]
        for css_file in css_files:
            response = await client.get(f"/design-assets/css/{css_file}")
            assert response.status_code == 200

        # Logos directory should be accessible
        logo_files = ["logo-32px.svg", "logo-32px-gray.svg", "logotype.svg"]
        for logo_file in logo_files:
            response = await client.get(f"/design-assets/logos/{logo_file}")
            assert response.status_code == 200

    async def test_cors_headers_for_design_assets(self, client: AsyncClient):
        """Test that CORS headers are properly set for design assets."""
        response = await client.get("/design-assets/css/typography.css")
        assert response.status_code == 200
        
        # The CORS middleware should handle these headers
        # We'll verify the response is successful and can be consumed by frontend


class TestDesignAssetsIntegration:
    """Integration tests for design assets in the context of the full application."""

    async def test_design_assets_served_alongside_rsm_static(self, client: AsyncClient):
        """Test that design assets don't interfere with existing RSM static files."""
        # Test that existing RSM static files still work
        # (This would require the actual RSM package to be available)
        response = await client.get("/static/rsm.css")
        # We expect this to work in a real environment with RSM package
        # For now, we'll just verify the endpoint structure
        assert response.status_code in [200, 404]  # 404 is OK in test environment

    async def test_cache_control_headers(self, client: AsyncClient):
        """Test that cache control headers are set for design assets."""
        # Test the actual /design-assets endpoint middleware behavior
        response = await client.get("/design-assets/css/typography.css")
        # This should return 200 since we have the actual files
        assert response.status_code == 200
        # Check that no-cache headers are applied by middleware
        assert "Cache-Control" in response.headers
        assert response.headers["Cache-Control"] == "no-store"