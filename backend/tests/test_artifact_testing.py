"""Test file to validate CI artifact collection system.

This test intentionally fails to test our new artifact collection approach.
"""

import pytest


def test_artifact_collection_always_fails():
    """This test intentionally fails to test CI artifact generation."""
    assert False, "This test is designed to fail to test CI artifact collection"


def test_artifact_collection_another_failure():
    """Another intentional failure with specific error pattern."""
    raise ValueError("Intentional test failure for artifact validation")


def test_artifact_collection_assertion_error():
    """Test assertion error patterns."""
    expected = "success"
    actual = "failure"
    assert expected == actual, f"Expected {expected} but got {actual}"


def test_artifact_collection_import_simulation():
    """Simulate an import error pattern."""
    try:
        import nonexistent_module  # This will fail  # noqa: F401
    except ImportError as e:
        pytest.fail(f"Import error simulation: {e}")