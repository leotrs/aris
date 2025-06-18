# Contributing to Aris

Thank you for your interest in contributing to Aris! This guide will help you get started with contributing to our scientific publishing platform.

## 🚀 Quick Start

### Prerequisites

**Backend (Python):**
- Python 3.13+
- [uv](https://docs.astral.sh/uv/) (Python package manager)
- PostgreSQL (for production) or SQLite (for development)

**Frontend (Vue.js):**
- Node.js 18+
- npm

### 5-Minute Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/aris.git
   cd aris
   ```

2. **Backend setup:**
   ```bash
   cd backend
   uv sync                    # Install dependencies
   alembic upgrade head       # Set up database
   uvicorn main:app --reload  # Start development server (http://localhost:8000)
   ```

3. **Frontend setup (in new terminal):**
   ```bash
   cd frontend
   npm install               # Install dependencies
   npm run dev              # Start development server (http://localhost:5173)
   ```

4. **Verify setup:**
   - Backend API docs: http://localhost:8000/docs
   - Frontend app: http://localhost:5173
   - Run tests: `cd backend && uv run pytest` and `cd frontend && npm test`

## 📋 Development Workflow

### Branch Strategy

- **`main`** - Production-ready code
- **Feature branches** - `feat/your-feature-name`
- **Bug fixes** - `fix/issue-description`
- **Documentation** - `docs/topic-name`

### Making Changes

1. **Create a branch:**
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes following our standards (see below)**

3. **Test your changes:**
   ```bash
   # Backend
   cd backend
   uv run pytest                           # Run tests
   uv run ruff check                       # Lint code
   uv run mypy aris/                       # Type check

   # Frontend
   cd frontend
   npm test                                # Run tests
   npm run lint                            # Lint code
   ```

4. **Commit using conventional commits:**
   ```bash
   git commit -m "feat: add user authentication endpoint"
   git commit -m "fix: resolve database connection timeout"
   git commit -m "docs: update API documentation"
   ```

5. **Push and create a Pull Request:**
   ```bash
   git push origin feat/your-feature-name
   ```

## 📝 Code Standards

### General Principles
- Write clear, readable code with meaningful variable names
- Add comprehensive tests for new functionality
- Follow existing patterns and conventions in the codebase
- Document complex business logic and API endpoints

### Backend (Python)
- **Style**: Follow PEP 8, enforced by `ruff`
- **Type hints**: Required for all public functions
- **Docstrings**: Use NumPy-style docstrings for all functions/classes
- **Testing**: pytest with async support, aim for >90% coverage
- **Database**: Use async SQLAlchemy, implement soft deletes

**Example:**
```python
async def create_user(name: str, email: str, db: AsyncSession) -> User:
    """Create a new user account.

    Parameters
    ----------
    name : str
        Full name of the user.
    email : str
        Unique email address.
    db : AsyncSession
        Database session.

    Returns
    -------
    User
        The created user object.

    Raises
    ------
    HTTPException
        If email already exists.
    """
```

### Frontend (Vue.js)
- **Style**: Prettier + ESLint configuration (automatically applied)
- **Components**: Vue 3 Composition API, global component registration
- **Testing**: Vitest with Vue Test Utils
- **Type safety**: Use TypeScript where beneficial

**Example:**
```vue
<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  }
})

const isVisible = ref(false)
</script>
```

### Database
- **Migrations**: Always use Alembic for schema changes
- **Models**: Comprehensive docstrings with field descriptions
- **Soft deletes**: Use `deleted_at` timestamp instead of hard deletes

## 🧪 Testing Requirements

### Backend Testing
- **Unit tests**: Test individual functions and methods
- **Integration tests**: Test API endpoints with database
- **Test isolation**: Each test should be independent
- **Fixtures**: Use pytest fixtures for common setup

### Frontend Testing
- **Component tests**: Test Vue component behavior
- **Unit tests**: Test utility functions and composables
- **User interaction**: Test user workflows

### Running Tests
```bash
# Backend - Run all tests
cd backend && uv run pytest

# Backend - Run with coverage
cd backend && uv run pytest --cov=aris --cov-report=term-missing

# Backend - Run in parallel
cd backend && uv run pytest -n8

# Frontend - Run all tests
cd frontend && npm test

# Frontend - Run with coverage
cd frontend && npm run test:coverage
```

## 🐛 Reporting Issues

### Bug Reports
Use the bug report template and include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Python/Node versions)
- Screenshots if applicable

### Feature Requests
Use the feature request template and include:
- Problem you're trying to solve
- Proposed solution
- Alternative solutions considered
- Impact on existing functionality

## 📚 Documentation

### Code Documentation
- **Backend**: NumPy-style docstrings for all public functions
- **Frontend**: JSDoc comments for complex functions
- **Database**: Model field descriptions in docstrings

### API Documentation
- FastAPI automatically generates interactive docs at `/docs`
- Keep endpoint descriptions clear and comprehensive
- Include example requests/responses

## 🏗️ Architecture Guidelines

### Backend Architecture
- **CRUD operations**: Keep in separate modules (`crud/`)
- **Route handlers**: Keep thin, delegate to CRUD functions
- **Dependencies**: Use FastAPI dependency injection
- **Error handling**: Use appropriate HTTP status codes

### Frontend Architecture
- **Components**: Keep focused and reusable
- **Composables**: Extract shared logic into composables
- **State management**: Use Vue's reactivity system
- **API calls**: Centralize in service modules

### Database Design
- **Relationships**: Use proper foreign keys and constraints
- **Indexing**: Add indexes for frequently queried fields
- **Validation**: Use both database and application-level validation

## 🤝 Pull Request Process

1. **Pre-submission checklist:**
   - [ ] Tests pass locally
   - [ ] Code follows style guidelines
   - [ ] Documentation updated if needed
   - [ ] No merge conflicts with main

2. **PR Requirements:**
   - Clear title and description
   - Link to related issues
   - Screenshots for UI changes
   - Breaking changes documented

3. **Review process:**
   - At least one maintainer approval required
   - All CI checks must pass
   - Address feedback promptly

## 🆘 Getting Help

- **Questions**: Open a discussion in GitHub Discussions
- **Bug reports**: Use GitHub Issues with bug template
- **Feature requests**: Use GitHub Issues with feature template
- **Development help**: Reach out to maintainers

## 🎯 Good First Issues

Look for issues labeled with:
- `good first issue` - Perfect for newcomers
- `help wanted` - Community contributions welcome
- `documentation` - Help improve docs

## 📜 Code of Conduct

This project follows our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## 📄 License

By contributing to Aris, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Aris! Your efforts help make scientific publishing more
accessible and collaborative. 🚀
