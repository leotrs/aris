# Integration Tests

This directory contains integration tests for the Aris backend that test complete workflows and cross-module interactions.

## Test Categories

### RSM Integration Tests (`test_rsm_integration.py`)
- **Complete RSM processing pipeline** from markup to HTML output
- **Complex document rendering** with all RSM features (itemize, enumerate, abstracts)
- **API endpoint integration** testing RSM rendering through HTTP
- **File creation and storage** with RSM content
- **Unicode and special character** handling
- **Performance testing** with large documents

### RSM Error Handling (`test_rsm_error_handling.py`)
- **Malformed markup handling** - unclosed tags, invalid syntax
- **Error recovery testing** - processor resilience to bad input
- **Edge cases** - empty documents, deeply nested structures
- **Security testing** - HTML injection prevention
- **Concurrent error handling** - multiple malformed documents
- **Memory safety** - large malformed documents

### Database Constraints (`test_database_constraints.py`)
- **Constraint enforcement** - foreign keys, unique constraints
- **Transaction behavior** - rollbacks, savepoints (PostgreSQL)
- **Concurrent operations** - deadlock prevention
- **Database-specific features** - PostgreSQL vs SQLite differences
- **Performance characteristics** - bulk operations, complex queries

## Database Testing Strategy

### Dual Database Support
- **Local Development**: Uses SQLite for fast test execution
- **CI Environment**: Uses PostgreSQL for production-like testing
- **Same Test Suite**: Identical tests run on both databases
- **Automatic Detection**: Database type determined by environment

### Environment Configuration
- `ENV=CI` or `CI=true`: Forces PostgreSQL usage
- `TEST_DB_URL`: Override for custom database URL
- Default: SQLite with unique file per test worker

### Running Tests

```bash
# Run all integration tests (uses SQLite locally)
uv run pytest tests/integration/ -v

# Force PostgreSQL testing locally (requires local PostgreSQL)
ENV=CI uv run pytest tests/integration/ -v

# Run specific test category
uv run pytest tests/integration/test_rsm_integration.py -v

# Run with coverage
uv run pytest tests/integration/ --cov=aris --cov-report=html
```

## Test Data and Fixtures

### RSM Document Fixtures
- **Simple documents**: Basic structure testing
- **Complex documents**: Full feature testing (abstracts, lists, etc.)
- **Malformed documents**: Error handling testing
- **Large documents**: Performance testing
- **Unicode documents**: Character encoding testing

### Database Fixtures
- **Clean database per test**: Proper isolation
- **Test users and files**: Realistic data scenarios
- **Concurrent access**: Multi-user scenarios

## Performance Considerations

### Test Execution Speed
- SQLite: ~10-50ms per test (local development)
- PostgreSQL: ~50-200ms per test (CI environment)
- Parallel execution: `-n8` for faster test runs

### Memory Usage
- Large document tests monitor memory consumption
- Malformed content tests prevent memory leaks
- Concurrent tests validate resource cleanup

## CI Integration

### GitHub Actions
Tests automatically run on both SQLite (for speed) and PostgreSQL (for accuracy) in CI pipelines.

### Database Setup
PostgreSQL tests use `pytest-postgresql` for automatic database provisioning and cleanup.

## Adding New Tests

### RSM Tests
1. Add test to appropriate class in `test_rsm_integration.py` or `test_rsm_error_handling.py`
2. Include document fixtures with realistic RSM content
3. Test both success and error scenarios
4. Consider performance implications for large documents

### Database Tests
1. Add test to appropriate class in `test_database_constraints.py`
2. Test behavior on both SQLite and PostgreSQL where applicable
3. Use `@pytest.mark.skipif()` for database-specific features
4. Ensure proper cleanup to avoid test interference

### General Guidelines
- Keep tests isolated and independent
- Use descriptive test names and docstrings
- Include both positive and negative test cases
- Consider edge cases and error conditions
- Monitor test execution time and optimize if needed