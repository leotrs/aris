# Contributing to Aris

Thank you for your interest in contributing to Aris! We welcome contributions from the community and appreciate your help in making this project better.

## Getting Started

### Prerequisites

- **Frontend**: Node.js >=23, NPM >=10
- **Backend**: Python >=3.13, uv package manager
- Git for version control

### Development Setup

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/your-username/aris.git
   cd aris
   ```

2. **Backend setup:**
   ```bash
   cd backend
   uv sync
   ```

3. **Frontend setup:**
   ```bash
   cd frontend
   npm install
   ```

4. **Run the development servers:**
   ```bash
   # Backend (from backend/ directory)
   uvicorn main:app --reload
   
   # Frontend (from frontend/ directory)
   npm run dev
   ```

## Development Workflow

### Before Making Changes

1. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make sure all tests pass:
   ```bash
   # Backend tests
   cd backend && uv run python -m pytest
   
   # Frontend tests
   cd frontend && npm test
   ```

### Making Changes

1. **Follow the coding standards:**
   - Backend: Follow PEP 8, use type hints, maintain test coverage
   - Frontend: Follow Vue 3 Composition API patterns, use ESLint configuration

2. **Write tests for your changes:**
   - Backend: Add tests in `backend/tests/`
   - Frontend: Add tests in `frontend/src/tests/`

3. **Run linting and type checking:**
   ```bash
   # Backend
   cd backend && uv run ruff check
   cd backend && uv run mypy aris/
   
   # Frontend
   cd frontend && npm run lint
   ```

### Submitting Changes

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

2. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request:**
   - Go to the GitHub repository
   - Click "New Pull Request"
   - Fill out the PR template with details about your changes

## Code Style Guidelines

### Backend (Python)
- Use async/await for database operations
- Follow SQLAlchemy 2.0 patterns
- Maintain comprehensive test coverage
- Use type hints throughout
- Keep route handlers thin, business logic in CRUD modules

### Frontend (Vue.js)
- Use Vue 3 Composition API
- Components in `src/components/` are auto-registered globally
- Follow existing naming conventions
- Write unit tests for components and composables

## Database Changes

If your changes require database schema modifications:

1. Create a new migration:
   ```bash
   cd backend && alembic revision --autogenerate -m "description"
   ```

2. Review and edit the generated migration file
3. Test the migration:
   ```bash
   cd backend && alembic upgrade head
   ```

## Testing

- All new features must include tests
- Bug fixes should include regression tests
- Aim for high test coverage
- Run the full test suite before submitting PRs

## Types of Contributions

We welcome various types of contributions:

- **Bug fixes** - Help us identify and fix issues
- **New features** - Implement new functionality
- **Documentation** - Improve or add documentation
- **Performance improvements** - Optimize existing code
- **UI/UX improvements** - Enhance user experience
- **Testing** - Add or improve test coverage

## Getting Help

- **Questions?** Open a GitHub Discussion
- **Bug reports?** Use the bug report issue template
- **Feature requests?** Use the feature request issue template

## Code of Conduct

Please note that this project is released with a [Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## Recognition

Contributors are recognized in our release notes and we appreciate all contributions, no matter how small!

Thank you for contributing to Aris! 🚀