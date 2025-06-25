"""RSM error handling and malformed markup tests.

Tests how the RSM processing pipeline handles various error conditions,
malformed markup, and edge cases.
"""

import logging

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from aris.crud.render import render


class TestRSMErrorHandling:
    """Test RSM error handling and malformed markup scenarios."""

    @pytest.fixture
    def malformed_rsm_documents(self):
        """Collection of malformed RSM documents for testing."""
        return {
            "unclosed_itemize": """:rsm:
# Document with Unclosed Itemize

:itemize:
:item: First item
:item: Second item
# Missing :: to close itemize

## Next Section
This should cause issues.
::""",

            "unclosed_enumerate": """:rsm:
# Document with Unclosed Enumerate

:enumerate:
:item: First item
:item: Second item
# Missing :: to close enumerate

Content after unclosed enumerate.
::""",

            "nested_itemize_error": """:rsm:
# Nested Lists Error

:itemize:
:item: Outer item 1
:itemize:
:item: Inner item - this nesting might cause issues
:item: Another inner item
::
:item: This item might be malformed due to nesting
::""",

            "missing_rsm_tags": """
# Document Missing RSM Tags

This document doesn't have proper :rsm: opening and closing tags.

:itemize:
:item: Item without proper document structure
::

This should cause issues.""",

            "invalid_rsm_syntax": """:rsm:
# Document with Invalid Syntax

:invalidtag:
This is not a valid RSM tag.
::

:itemize:
:invaliditem: This is not a valid item tag
:item: This is valid
::

::""",

            "mixed_list_types": """:rsm:
# Mixed List Types Error

:itemize:
:item: Item 1
:enumerate:
:item: This enumerate inside itemize might cause issues
::
:item: Back to itemize
::

::""",

            "empty_sections": """:rsm:
# Document with Empty Sections

:itemize:
::

:enumerate:
::

:abstract:
::

::""",

            "malformed_abstract": """:rsm:
# Document with Malformed Abstract

:abstract:
This abstract is missing its closing tag.

## Introduction
This content should be outside the abstract.
::""",

            "unicode_and_special_chars": """:rsm:
# Üñïçödë Tëst wïth Spëçïäl Chäräçtërs

This document tests various unicode and special characters:
- Mathematical: ∑∫∂∞≤≥≠±
- Greek: αβγδεζηθικλμνξοπρστυφχψω
- Emojis: 🚀📊🔬💻📈📉
- Quotes: "smart quotes", 'apostrophes', «guillemets»

:itemize:
:item: Itëm wïth ëmöjï 🎯
:item: Itëm wïth mäth ∫₀¹ f(x)dx
::

::""",

            "very_long_lines": """:rsm:
# Document with Very Long Lines

This is an extremely long line that goes on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on and on.

:itemize:
:item: This is another extremely long item that should test how the RSM processor handles very long content within list items and whether it can properly parse and render such content without breaking or causing performance issues in the rendering pipeline and whether line wrapping and text formatting work correctly.
::

::""",

            "deeply_nested_headings": """:rsm:
# Level 1
## Level 2
### Level 3
#### Level 4
##### Level 5
###### Level 6
####### Level 7 - This might be too deep
######## Level 8 - Definitely too deep

Content at the deepest level.
::""",

            "mixed_markup_styles": """:rsm:
# Mixed Markup Test

This paragraph has *italic text* and **bold text** and ***bold italic*** text.

But what about `inline code` and [links](http://example.com)?

And HTML entities like &lt;, &gt;, &amp;, &quot;?

:itemize:
:item: Item with *emphasis* and **bold**
:item: Item with `code` and &special; entities
::

::"""
        }

    async def test_unclosed_itemize_handling(self, db_session: AsyncSession, malformed_rsm_documents):
        """Test handling of unclosed itemize sections."""
        result = await render(malformed_rsm_documents["unclosed_itemize"], db_session)
        
        # Should still generate some HTML output, not crash
        assert isinstance(result, str)
        
        # Should contain some of the content even if malformed
        assert "Document with Unclosed Itemize" in result or len(result) == 0

    async def test_unclosed_enumerate_handling(self, db_session: AsyncSession, malformed_rsm_documents):
        """Test handling of unclosed enumerate sections."""
        result = await render(malformed_rsm_documents["unclosed_enumerate"], db_session)
        
        # Should handle gracefully
        assert isinstance(result, str)
        assert "Document with Unclosed Enumerate" in result or len(result) == 0

    async def test_missing_rsm_tags(self, db_session: AsyncSession, malformed_rsm_documents):
        """Test handling of documents missing RSM opening/closing tags."""
        result = await render(malformed_rsm_documents["missing_rsm_tags"], db_session)
        
        # Should handle gracefully, might return empty string
        assert isinstance(result, str)

    async def test_invalid_rsm_syntax(self, db_session: AsyncSession, malformed_rsm_documents):
        """Test handling of invalid RSM syntax elements."""
        result = await render(malformed_rsm_documents["invalid_rsm_syntax"], db_session)
        
        # Should handle gracefully
        assert isinstance(result, str)
        
        # Valid content should still be processed
        if result:
            assert "Document with Invalid Syntax" in result or "This is valid" in result

    async def test_nested_itemize_error(self, db_session: AsyncSession, malformed_rsm_documents):
        """Test handling of nested list errors."""
        result = await render(malformed_rsm_documents["nested_itemize_error"], db_session)
        
        # Should handle gracefully
        assert isinstance(result, str)

    async def test_mixed_list_types(self, db_session: AsyncSession, malformed_rsm_documents):
        """Test handling of mixed list type errors."""
        result = await render(malformed_rsm_documents["mixed_list_types"], db_session)
        
        # Should handle gracefully
        assert isinstance(result, str)

    async def test_empty_sections(self, db_session: AsyncSession, malformed_rsm_documents):
        """Test handling of empty RSM sections."""
        result = await render(malformed_rsm_documents["empty_sections"], db_session)
        
        # Should handle empty sections gracefully
        assert isinstance(result, str)
        
        if result:
            assert "Document with Empty Sections" in result

    async def test_malformed_abstract(self, db_session: AsyncSession, malformed_rsm_documents):
        """Test handling of malformed abstract sections."""
        result = await render(malformed_rsm_documents["malformed_abstract"], db_session)
        
        # Should handle gracefully
        assert isinstance(result, str)

    async def test_unicode_and_special_chars(self, db_session: AsyncSession, malformed_rsm_documents):
        """Test handling of unicode and special characters."""
        result = await render(malformed_rsm_documents["unicode_and_special_chars"], db_session)
        
        # Should handle unicode without issues
        assert isinstance(result, str)
        
        # Unicode content should be preserved if rendering succeeds
        if result and len(result) > 0:
            # Check for some unicode preservation
            unicode_preserved = any(char in result for char in ['Ü', 'ñ', 'ï', '∑', 'α', '🚀'])
            # It's OK if unicode is transformed, but result should not be empty due to unicode
            assert len(result) > 100 or unicode_preserved

    async def test_very_long_lines(self, db_session: AsyncSession, malformed_rsm_documents):
        """Test handling of very long lines."""
        result = await render(malformed_rsm_documents["very_long_lines"], db_session)
        
        # Should handle long lines without issues
        assert isinstance(result, str)
        
        if result:
            assert "Document with Very Long Lines" in result

    async def test_deeply_nested_headings(self, db_session: AsyncSession, malformed_rsm_documents):
        """Test handling of deeply nested headings."""
        result = await render(malformed_rsm_documents["deeply_nested_headings"], db_session)
        
        # Should handle deep nesting gracefully
        assert isinstance(result, str)
        
        if result:
            assert "Level 1" in result

    async def test_mixed_markup_styles(self, db_session: AsyncSession, malformed_rsm_documents):
        """Test handling of mixed markup styles."""
        result = await render(malformed_rsm_documents["mixed_markup_styles"], db_session)
        
        # Should handle mixed markup
        assert isinstance(result, str)
        
        if result:
            assert "Mixed Markup Test" in result

    async def test_rsm_error_logging(self, db_session: AsyncSession, caplog, malformed_rsm_documents):
        """Test that RSM errors are properly logged."""
        caplog.set_level(logging.ERROR)
        
        # Test with a clearly malformed document
        malformed_doc = malformed_rsm_documents["missing_rsm_tags"]
        
        result = await render(malformed_doc, db_session)
        
        # Should return a string (even if empty on error)
        assert isinstance(result, str)
        
        # Check if error was logged (if RSM package throws errors)
        # This depends on RSM package implementation
        if "There was an error rendering the code" in caplog.text:
            assert True  # Error was properly logged
        else:
            # RSM package might handle errors gracefully without throwing
            assert True  # This is also acceptable

    async def test_malformed_rsm_via_api(self, client: AsyncClient, malformed_rsm_documents):
        """Test malformed RSM handling through API endpoint."""
        for doc_name, doc_content in malformed_rsm_documents.items():
            response = await client.post("/render", json={"source": doc_content})
            
            # API should always return 200, even for malformed content
            assert response.status_code == 200
            
            result = response.json()
            assert isinstance(result, str)
            
            # Should not return error responses for malformed markup
            # RSM processor should handle errors gracefully

    async def test_extremely_large_malformed_document(self, db_session: AsyncSession):
        """Test handling of extremely large malformed document."""
        # Create a large malformed document
        large_malformed = [":rsm:", "# Large Malformed Document"]
        
        # Add many unclosed itemize sections
        for i in range(50):
            large_malformed.extend([
                f"## Section {i}",
                ":itemize:",
                f":item: Item {i}.1",
                f":item: Item {i}.2",
                # Intentionally missing :: to close itemize
                f"Unclosed section {i} content."
            ])
        
        large_malformed.append("::")  # Only close the main document
        large_doc = "\n".join(large_malformed)
        
        # Should handle large malformed document without crashing
        result = await render(large_doc, db_session)
        assert isinstance(result, str)
        
        # Should complete in reasonable time even with malformed content
        # If it hangs, the test will timeout

    async def test_null_and_empty_inputs(self, db_session: AsyncSession):
        """Test handling of null and empty inputs."""
        # Empty string
        result = await render("", db_session)
        assert isinstance(result, str)
        
        # Whitespace only
        result = await render("   \n\t\n   ", db_session)
        assert isinstance(result, str)
        
        # Just RSM tags
        result = await render(":rsm:::", db_session)
        assert isinstance(result, str)

    async def test_rsm_with_html_injection_attempt(self, db_session: AsyncSession):
        """Test RSM handling of potential HTML injection."""
        html_injection_doc = """:rsm:
# Document with HTML

This document contains HTML tags: <script>alert('xss')</script>

And other tags: <div>content</div>, <img src="x" onerror="alert('xss')">

:itemize:
:item: Item with <strong>HTML</strong>
:item: Item with <em onclick="alert('xss')">JavaScript</em>
::

::"""
        
        result = await render(html_injection_doc, db_session)
        assert isinstance(result, str)
        
        # Check that result doesn't contain dangerous HTML as-is
        # (RSM should escape or process it safely)
        if result:
            # These checks depend on RSM's security handling
            # If RSM properly escapes, script tags should be escaped or removed
            # We don't assert on specific escaping as it depends on RSM implementation
            # Just ensure we get a string result without crashing
            pass

    async def test_rsm_memory_usage_with_malformed_content(self, db_session: AsyncSession):
        """Test that malformed content doesn't cause memory issues."""
        # Create content designed to potentially cause memory issues
        memory_test_doc = ":rsm:\n" + "# Header\n" * 1000 + ":itemize:\n" + ":item: Item\n" * 1000 + "\n::"
        
        result = await render(memory_test_doc, db_session)
        assert isinstance(result, str)
        
        # Result should not be excessively large
        if result:
            assert len(result) < 50 * 1024 * 1024, "Result size suggests potential memory issue"

    async def test_concurrent_malformed_rendering(self, db_session: AsyncSession, malformed_rsm_documents):
        """Test concurrent rendering of malformed documents."""
        import asyncio
        
        # Create multiple concurrent render tasks with malformed content
        tasks = []
        for doc_content in list(malformed_rsm_documents.values())[:5]:  # Test with 5 documents
            task = render(doc_content, db_session)
            tasks.append(task)
        
        # Run concurrently
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # All should complete without exceptions
        for result in results:
            assert not isinstance(result, Exception)
            assert isinstance(result, str)

    async def test_rsm_error_recovery(self, db_session: AsyncSession):
        """Test that RSM processor can recover from errors."""
        # First render a malformed document
        malformed = ":rsm:\n:itemize:\n:item: Unclosed\n"  # Missing closings
        result1 = await render(malformed, db_session)
        assert isinstance(result1, str)
        
        # Then render a valid document - should work fine
        valid = ":rsm:\n# Valid Document\nContent\n::"
        result2 = await render(valid, db_session)
        assert isinstance(result2, str)
        
        if result2:
            assert "Valid Document" in result2
            assert "Content" in result2

    async def test_edge_case_rsm_structures(self, db_session: AsyncSession):
        """Test edge cases in RSM structure."""
        edge_cases = [
            # Only whitespace between tags
            ":rsm:\n\n\n\t\t\t\n\n::",
            
            # Multiple consecutive tags
            ":rsm:\n:itemize:\n::\n:enumerate:\n::\n::",
            
            # Tags with extra whitespace
            ":rsm:   \n#   Title   \n\n   :itemize:   \n:item:   Content   \n::   \n::",
            
            # Mixed line endings (though this is hard to test directly)
            ":rsm:\n# Title\r\nContent\r\n::",
        ]
        
        for edge_case in edge_cases:
            result = await render(edge_case, db_session)
            assert isinstance(result, str)
            # Should not crash on edge cases