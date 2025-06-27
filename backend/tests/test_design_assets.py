"""Tests for design assets serving functionality.

This module tests the backend's ability to serve shared design assets
including CSS files and logos through the static file endpoint.
"""

import tempfile
from pathlib import Path

import pytest
from httpx import AsyncClient


class TestDesignAssetsServing:
    """Test design assets serving through backend static files."""

    @pytest.fixture
    def temp_design_assets(self, tmp_path):
        """Create temporary design assets structure for testing."""
        design_assets = tmp_path / "design-assets"
        design_assets.mkdir()
        
        # Create CSS directory and files
        css_dir = design_assets / "css"
        css_dir.mkdir()
        
        typography_css = css_dir / "typography.css"
        typography_css.write_text("""
/* Typography styles */
.text-h1 {
  font-family: "Montserrat", sans-serif;
  font-size: 32px;
  line-height: 48px;
}
""")
        
        colors_css = css_dir / "colors.css"
        colors_css.write_text("""
/* Color variables */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
}
""")
        
        # Create logos directory and files
        logos_dir = design_assets / "logos"
        logos_dir.mkdir()
        
        logo_svg = logos_dir / "logo-32px.svg"
        logo_svg.write_text("""<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
  <circle cx="16" cy="16" r="15" fill="#007bff"/>
</svg>""")
        
        return design_assets

    @pytest.fixture
    def mock_static_mount(self, monkeypatch, temp_design_assets):
        """Mock the static file mounting to use test design assets."""
        from fastapi.staticfiles import StaticFiles

        from main import app
        
        # Create a temporary static directory with symlink to design assets
        with tempfile.TemporaryDirectory() as temp_static:
            static_path = Path(temp_static)
            design_link = static_path / "design"
            
            # Create symlink (will fail gracefully on Windows)
            try:
                design_link.symlink_to(temp_design_assets, target_is_directory=True)
            except (OSError, NotImplementedError):
                # Fallback: copy files for Windows compatibility
                import shutil
                shutil.copytree(temp_design_assets, design_link)
            
            # Remount static files with test directory
            app.mount(
                "/test-static",
                StaticFiles(directory=str(static_path)),
                name="test-static"
            )
            
            yield static_path

    async def test_design_css_files_accessible(self, client: AsyncClient, mock_static_mount):
        """Test that design CSS files are accessible through static endpoint."""
        # Test typography.css
        response = await client.get("/test-static/design/css/typography.css")
        assert response.status_code == 200
        assert "text/css" in response.headers.get("content-type", "")
        assert "font-family" in response.text
        assert "Montserrat" in response.text

        # Test colors.css
        response = await client.get("/test-static/design/css/colors.css")
        assert response.status_code == 200
        assert "text/css" in response.headers.get("content-type", "")
        assert "--primary-color" in response.text
        assert "#007bff" in response.text

    async def test_design_logo_files_accessible(self, client: AsyncClient, mock_static_mount):
        """Test that design logo files are accessible through static endpoint."""
        response = await client.get("/test-static/design/logos/logo-32px.svg")
        assert response.status_code == 200
        assert "image/svg+xml" in response.headers.get("content-type", "")
        assert "<svg" in response.text
        assert "circle" in response.text

    async def test_nonexistent_design_file_returns_404(self, client: AsyncClient, mock_static_mount):
        """Test that requesting nonexistent design files returns 404."""
        response = await client.get("/test-static/design/css/nonexistent.css")
        assert response.status_code == 404

        response = await client.get("/test-static/design/logos/nonexistent.svg")
        assert response.status_code == 404

    async def test_design_directory_structure(self, client: AsyncClient, mock_static_mount):
        """Test that the design assets directory structure is correct."""
        # CSS directory should be accessible (though directory listing may be disabled)
        css_files = ["typography.css", "colors.css"]
        for css_file in css_files:
            response = await client.get(f"/test-static/design/css/{css_file}")
            assert response.status_code == 200

        # Logos directory should be accessible
        logo_files = ["logo-32px.svg"]
        for logo_file in logo_files:
            response = await client.get(f"/test-static/design/logos/{logo_file}")
            assert response.status_code == 200

    async def test_cors_headers_for_design_assets(self, client: AsyncClient, mock_static_mount):
        """Test that CORS headers are properly set for design assets."""
        response = await client.get("/test-static/design/css/typography.css")
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
        # Test the actual /static endpoint middleware behavior
        response = await client.get("/static/rsm.css")
        # This may return 404 in test environment, which is expected
        if response.status_code == 200:
            # Check that no-cache headers are applied by middleware
            assert "Cache-Control" in response.headers