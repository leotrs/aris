# CLAUDE.md

## Project Overview
Aris is a web-native scientific publishing platform. FastAPI backend + Vue.js frontend
for RSM (Readable Research Markup) manuscripts.

## Structure
```
aris/
├── backend/    # FastAPI backend
├── frontend/   # Vue.js frontend
└── CLAUDE.md
```

## Just Commands (Task Runner)

### Development
```bash
just init                             # Initial setup - copies .env files, installs dependencies
just dev                              # Start development containers (uses current directory name)
just stop                             # Stop development containers
just logs                             # View container logs
just status                           # Check container status
```

### Testing & Quality
```bash
just test-all                         # Run all tests (backend + frontend + site)
just lint-all                         # Run all linters (backend + frontend + site)
just check-all                        # Complete check: lint + typecheck + test
```

### Individual Service Commands (run inside containers)
```bash
# Backend (inside container)
uv sync --all-groups                  # Install dependencies
uvicorn main:app --reload             # Run dev server
alembic upgrade head                  # Run migrations
uv run pytest -n8                     # Run tests (SQLite locally, PostgreSQL in CI)
uv run ruff check                     # Lint
uv run mypy aris/                     # Type check

# Frontend (inside container)
npm install                           # Install dependencies
npm run dev                           # Run dev server
npm test                              # Run unit tests
npm run test:e2e                      # Run E2E tests
npm run lint                          # Lint code
npm run storybook                     # Run Storybook

# Site (inside container)
npm install                           # Install dependencies
npm run dev                           # Run dev server
npm test                              # Run tests
npm run lint                          # Lint code
```

## AI Copilot Setup
```bash
cp backend/.env.example backend/.env  # Configure API keys
# Add your ANTHROPIC_API_KEY to backend/.env
# See backend/AI_SETUP.md for detailed instructions
```

**CI Cost Prevention**: The codebase includes automatic cost protection for CI environments. E2E tests use mock AI responses instead of real API calls, preventing charges during automated testing while still validating frontend-backend communication workflows.

## Testing Infrastructure

### Backend Testing
- **Local Development**: Tests use SQLite for fast development iterations
- **CI Environment**: Tests automatically use PostgreSQL for production-like testing
- **Dual Database Support**: Same test suite runs on both databases
- **Integration Tests**: `tests/integration/` contains RSM processing and database constraint tests
- **Environment Variables**:
  - `TEST_DB_URL`: Override test database URL
  - `CI=true` or `ENV=CI`: Forces PostgreSQL usage
  - `TEST_USER_EMAIL` / `TEST_USER_PASSWORD`: Credentials for E2E test user
- **Local CI Simulation**: Use `./simulate-ci -- <command>` for 100% CI fidelity

### E2E Testing Strategy
The E2E test suite is organized into **7 mutually exclusive jobs** for optimal parallelization:

#### **Authentication-Required Tests** (with database + test user):
1. **`e2e-auth`** (27 tests): User account, file management, authenticated features
2. **`e2e-auth-flows`** (22 tests): Login, registration, auth redirects

#### **Authentication-Disabled Tests** (public/demo content):
3. **`e2e-core`** (4 tests): Smoke tests, auth-disabled mode, critical functionality
4. **`e2e-demo-content`** (37 tests): Demo content rendering, navigation, backend integration
5. **`e2e-demo-ui`** (33 tests): Demo workspace, annotations, focus mode interactions

#### **Test Selection & Tagging**:
- **Tag-based execution**: Tests use `@auth`, `@auth-flows`, `@core`, `@demo-content`, `@demo-ui` tags
- **Precise pattern matching**: `@auth[^-]` pattern prevents tag collision with `@auth-flows`
- **Mutually exclusive**: Each test runs exactly once across all jobs

#### **Authentication Control**:
- **`DISABLE_AUTH=true`**: Bypasses authentication for demo/public content testing
- **Mock user injection**: Returns test user without database lookup when auth disabled
- **Environment-aware**: Automatically detects CI vs local environments

## Development Setup

### Environment Configuration (REQUIRED)

#### Development Environment
```bash
# Copy environment template and configure ports
cp .env.example .env
# Edit .env with your desired port configuration
```

**CRITICAL**: All environment variables in `.env` are REQUIRED. The system will crash immediately if any are missing - there are NO fallbacks.

#### CI/STAGING/PROD Environments
For CI, STAGING, and PROD environments, set these environment variables directly in your deployment configuration:
- `BACKEND_PORT`, `FRONTEND_PORT`, `SITE_PORT`, `STORYBOOK_PORT`
- `DB_PORT`, `DB_NAME`, `TEST_DB_NAME`
- Set `ENV=CI`, `ENV=STAGING`, or `ENV=PROD` to enable system environment variable mode

### Standard Development
```bash
just init                             # Sets up all .env files and installs all dependencies
just dev                              # Start development containers
```

### Containerized Development (Multi-Clone Setup)
```bash
# Quick setup for any clone
just init                             # Sets up all .env files and installs dependencies
just dev                              # Start containers (uses directory name as project name)

# For additional clones, use the setup script
./docker/scripts/setup-clone.sh

# Access services (using your configured ports):
# Frontend: http://localhost:{FRONTEND_PORT}
# Storybook: http://localhost:{STORYBOOK_PORT}
# Backend API: http://localhost:{BACKEND_PORT}/docs
# Database: localhost:{DB_PORT}
```

See [docker/README.md](docker/README.md) for detailed multi-clone setup instructions.

## Frontend Commands
```bash
npm install                           # Install dependencies
npm run dev                           # Run dev server
npm run storybook                     # Run Storybook component library
npm run lint                          # Lint code
npm test                              # Run unit tests
npm run test:e2e                      # Run all E2E tests (sequential)
```

### E2E Test Execution
```bash
# Run specific test suites (parallel-friendly)
npx playwright test --grep "@auth[^-]"     # Auth-required tests (27 tests)
npx playwright test --grep "@auth-flows"   # Auth flow tests (22 tests)
npx playwright test --grep "@core"         # Core functionality (4 tests)
npx playwright test --grep "@demo-content" # Demo content tests (37 tests)
npx playwright test --grep "@demo-ui"      # Demo UI tests (33 tests)

# Debug and development
npx playwright test --headed              # Run with browser visible
npx playwright test --debug               # Run in debug mode
npx playwright test --reporter=html       # Generate HTML report
```

## Critical Rules

### Environment Configuration
- **Development**: Copy `.env.example` to `.env` and configure ALL variables before starting any service
- **CI/STAGING/PROD**: Set environment variables directly in deployment configuration (`ENV=CI/STAGING/PROD`)
- **NO FALLBACKS**: Missing environment variables will crash the system immediately
- **FAIL-FAST**: All scripts validate environment before execution using `docker/env-check.js`

### Development Practices
- **ALWAYS use `osascript` for macOS notifications** (allowed in any directory)
- **ALWAYS use `git mv` to move files** (preserve history)
- **ALWAYS add blank line at end of files**
- **NEVER leave whitespace at the end of lines**
- **Follow existing code patterns and conventions**
- **Run tests after changes** (`npm test` and `uv run pytest -n8`)
- **Run linters before terminating a task**
- **Global Components**: All components in `src/components/` auto-registered via `main.js`
- **For user interaction bugs: ALWAYS use `debug/debug-bug-template.js` to replicate**
- **Whenever using puppeteer or playwright, use headless mode**
- **Always run e2e tests with --reporter=line**
- **When using playwright or puppeteer, always run in headless mode**
- Before starting any service, check if it is already running
- **Send notifications when tasks complete or need user input**: `osascript -e "display notification \"message\" with title \"Claude Code\""`
```

## Language Guidelines
- Stop using the word 'absolutely'
- **Playwright MUST always be used in headless mode**