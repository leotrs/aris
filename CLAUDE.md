# CLAUDE.md

## Project Overview
Aris is a web-native scientific publishing platform that replaces static PDFs with interactive, accessible HTML documents. Built with FastAPI backend and Vue.js frontend, it manages research manuscripts written in RSM (Research Source Markup) format, providing APIs for user management, document storage, and collaboration features.

### RSM (Readable Science Markup)
RSM is the core document format for scientific manuscripts used in Aris. Documents must start with `:rsm:` and end with `::`. The platform converts RSM markup to HTML with scientific formatting, enabling web-native publishing with proper citations, equations, and responsive layouts.

## Monorepo Structure
```
aris/
├── backend/                # FastAPI backend
├── frontend/               # Vue.js frontend
├── .prettierrc.shared.json # Shared Prettier configuration
├── eslint.config.shared.js # Shared ESLint base configuration
├── .prettierrc             # Root Prettier config (references shared)
├── .prettierignore         # Shared Prettier ignore patterns
├── CLAUDE.md              # This file
└── README.md
```

## Backend (FastAPI)

### Tech Stack
- **Python 3.13+** with **uv** for dependency management
- **FastAPI** for the web framework
- **SQLAlchemy 2.0** with async support for ORM
- **PostgreSQL** (production) / **SQLite** (testing)
- **Alembic** for database migrations
- **PyJWT** for token-based authentication
- **pytest** with **pytest-asyncio** for testing
- **RSM-markup** for scientific document parsing and rendering

### Key Commands
```bash
# Install dependencies
uv sync --all-groups

# Run the development server
uvicorn main:app --reload

# Run database migrations
alembic upgrade head

# Create new migration
alembic revision --autogenerate -m "description"

# Run tests with coverage
uv run pytest -n8 --cov=aris --cov-report=term-missing

# Run tests in parallel
uv run pytest -n8

# Run single test file
uv run pytest tests/test_specific_file.py

# Run specific test
uv run pytest tests/test_crud/test_crud_user.py::test_create_user

# Run linting
uv run ruff check

# Run type checking
uv run mypy aris/

# Format code (JSON/JS files only, Python uses ruff format)
prettier --write "**/*.{json,js,md}"
```

### Dependency Groups
UV manages dependencies in groups for different environments:
- **Main dependencies**: Core runtime requirements
- **test group**: Testing dependencies (freezegun, pillow, pytest-cov)
- **dev group**: Development tools (ruff, mypy, type stubs)

Use `uv sync --all-groups` to install all dependencies including test and dev groups.

### Key API Endpoints
- **Authentication**: `/auth/login`, `/auth/register`, `/auth/refresh`
- **Users**: `/users/me`, `/users/{user_id}`
- **Files**: `/files/`, `/files/{file_id}`, `/files/{file_id}/assets`
- **Tags**: `/tags/`, `/tags/{tag_id}`
- **Render**: `/render/` (RSM to HTML conversion)
- **Documentation**: Available at `http://localhost:8000/docs` when running locally

### Database Models
- **User**: Authentication and profile management
- **File**: RSM research documents with metadata
- **Tag**: User-defined organization system
- **FileAsset**: Supporting files (images, data, code)
- **FileSettings**: Per-user display preferences
- **Annotation/AnnotationMessage**: Collaborative comments


## Frontend (Vue.js)

### Tech Stack
- **Vue 3** with **Composition API**
- **Vue Router** for routing
- **Vite** for build tooling
- **Axios** for HTTP requests
- **VueUse** for composables
- **Vitest** for testing
- **ESLint + Prettier** for code quality

### Key Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting (run periodically during development)
npm run lint

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run single test file
npm test -- tests/components/SpecificComponent.test.js

# Run tests matching pattern
npm test -- --grep "ContextMenu"
```

### Test Configuration
- **Environment**: jsdom for DOM simulation
- **Memory**: 4GB limit for Node.js processes
- **Parallelism**: Limited to 2 threads to prevent memory exhaustion
- **Coverage thresholds**: 80% for branches, functions, lines, and statements
- **Setup**: Global test setup in `src/tests/setup.ts`

### Key Dependencies
- **@floating-ui/vue**: Floating UI positioning
- **@tabler/icons-vue**: Icon library
- **@vueuse/core**: Vue composition utilities
- **axios**: HTTP client for API requests

## Key Patterns

### Backend Authentication
- JWT-based authentication with access tokens
- `current_user` dependency for protected routes
- All user routes require authentication by default

### Backend Database
- Async SQLAlchemy sessions via `get_db()` dependency
- Soft deletes using `deleted_at` timestamp
- Proper transaction handling with commit/rollback

### Frontend State Management
- Composables for shared state and logic
- Vue Router for navigation
- Axios for backend API communication
- **Global Components**: All components in `src/components/` are automatically registered globally via `main.js`

### Testing
- **Backend**: pytest with async support and parallel execution
- **Frontend**: Vitest with Vue Test Utils
- Comprehensive test coverage for both layers

## Common Workflows

### Adding a New Backend Route
1. Define route handler in appropriate `routes/` file
2. Add CRUD operations in `crud/` if needed
3. Create comprehensive tests in `tests/test_routes/`
4. Update models if database changes are required
5. Run tests to ensure everything works

### Adding a New Frontend Component
1. Create component in `src/components/` (automatically registered globally)
2. Create tests in `tests/` directory
3. Update routing if it's a page component
4. Run linting and tests

### Database Changes
1. Modify models in `aris/models/models.py`
2. Generate migration: `alembic revision --autogenerate -m "description"`
3. Review and edit migration file if needed
4. Apply migration: `alembic upgrade head`
5. Update tests to reflect schema changes

## Shared Configuration

### Code Formatting and Linting
The project uses shared ESLint and Prettier configurations to maintain consistency across frontend and backend:

**Prettier Configuration:**
- **Shared config**: `.prettierrc.shared.json` (root level)
- **Frontend**: `.prettierrc` → references shared config
- **Backend**: `.prettierrc` → references shared config
- **Rules**: 100 char line width for JS/Vue, 88 for Python, 4 spaces for Python, 2 for JS/Vue

**ESLint Configuration:**
- **Shared base**: `eslint.config.shared.js` (common rules and patterns)
- **Frontend**: `eslint.config.js` extends shared config with Vue-specific rules
- **Backend**: Uses ruff for Python linting, Prettier for JSON/JS files

**Usage:**
```bash
# Format all supported files from root
prettier --write .

# Format specific file types
prettier --write "**/*.{json,js,md}"

# Frontend linting (from frontend/)
npm run lint
```

## Development Notes
- Follow existing code patterns and conventions
- Use proper async/await throughout backend
- Maintain comprehensive test coverage
- Keep CRUD operations separate from route logic
- Use soft deletes for data preservation
- Follow Vue 3 Composition API best practices
- Use shared formatting configurations for consistency
- Don't leave trailing whitespace in lines
- Always insert a blank line at the end of all files

## Utility Scripts (Backend)
Located in `scripts/` directory:
- **`init_db.py`**: Create all database tables using SQLAlchemy metadata
- **`add_mock_data.py`**: Populate database with mock users, files, and tags for testing
- **`add_example_data.py`**: Load example RSM documents from rsm-examples package
- **`sync_columns.py`**: Sync columns between Postgres databases, skipping duplicates

## Environment Configuration
- **Backend**: Uses `.env` file with database URLs, JWT secrets, and environment flags
- **Frontend**: Uses `.env` with API base URLs and environment settings
- **CI**: Uses `.env.ci` for continuous integration environment

## Deployment
- **Backend**: Production deployment on **fly.io**
  - Use `fly deploy` to deploy backend
  - Use `fly logs` to view backend logs
- **Database**: Hosted on **Supabase**
- **Frontend**: Deployed to Netlify on each push to origin/main


## Test Suite Memory Management

### Memory Leak Prevention
To prevent test suite memory exhaustion:

1. **Split large test files** (>400 lines) into focused, smaller files
2. **Avoid global ref() objects** - use `let` variables and reset in `beforeEach()`
3. **Don't create refs in mock factories** - use reusable mock objects instead
4. **Always add afterEach cleanup** with `vi.restoreAllMocks()` for every `beforeEach()`
5. **Use plain objects** `{ value: {} }` instead of reactive `ref({})` in mocks

## Known Issues
- Coverage tool may report false negatives for some FastAPI async routes
- RSM parser shows deprecation warnings (external dependency)
- Missing test dependencies (freezegun, pillow) require `uv sync --all-groups` for full test suite
