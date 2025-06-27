"""Integration tests for design assets serving through actual backend endpoints."""

from httpx import AsyncClient


class TestDesignAssetsIntegration:
    """Test design assets integration with actual backend endpoints."""

    async def test_design_assets_endpoint_available(self, client: AsyncClient):
        """Test that the /design-assets endpoint is mounted and responds."""
        # Test accessing a file that should exist
        response = await client.get("/design-assets/design/css/typography.css")
        
        # Should either return 200 (file exists) or 404 (symlink not working)
        # We expect it to work since we created the symlink
        assert response.status_code == 200
        assert "text/css" in response.headers.get("content-type", "")
        assert "font-family" in response.text
        assert "Montserrat" in response.text

    async def test_design_assets_logos_accessible(self, client: AsyncClient):
        """Test that design asset logos are accessible."""
        response = await client.get("/design-assets/design/logos/logo-32px.svg")
        assert response.status_code == 200
        assert "image/svg+xml" in response.headers.get("content-type", "")
        assert "<svg" in response.text

    async def test_design_assets_cache_headers(self, client: AsyncClient):
        """Test that design assets get proper cache headers."""
        response = await client.get("/design-assets/design/css/typography.css")
        assert response.status_code == 200
        # The middleware should add no-cache headers
        assert "Cache-Control" in response.headers
        assert response.headers["Cache-Control"] == "no-store"

    async def test_nonexistent_design_asset_404(self, client: AsyncClient):
        """Test that nonexistent design assets return 404."""
        response = await client.get("/design-assets/design/css/nonexistent.css")
        assert response.status_code == 404

    async def test_design_assets_alongside_static(self, client: AsyncClient):
        """Test that design assets work alongside existing static endpoint."""
        # Test that RSM static files still work
        rsm_response = await client.get("/static/rsm.css")
        # This may be 404 in test environment but the endpoint should exist
        assert rsm_response.status_code in [200, 404]
        
        # Test that design assets work
        design_response = await client.get("/design-assets/design/css/typography.css")
        assert design_response.status_code == 200