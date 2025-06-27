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

## Backend Commands
```bash
uv sync --all-groups                  # Install dependencies
uvicorn main:app --reload             # Run dev server
alembic upgrade head                  # Run migrations
uv run pytest -n8                     # Run tests (SQLite locally, PostgreSQL in CI)
uv run ruff check                     # Lint
uv run mypy aris/                     # Type check
```

## Testing Infrastructure
- **Local Development**: Tests use SQLite for fast development iterations
- **CI Environment**: Tests automatically use PostgreSQL for production-like testing
- **Dual Database Support**: Same test suite runs on both databases
- **Integration Tests**: `tests/integration/` contains RSM processing and database constraint tests
- **Environment Variables**: 
  - `TEST_DB_URL`: Override test database URL
  - `CI=true` or `ENV=CI`: Forces PostgreSQL usage
- **Local CI Simulation**: Use `./simulate-ci -- <command>` for 100% CI fidelity

## Development Setup

### Standard Development
```bash
cd backend && uv sync --all-groups   # Install backend dependencies
cd frontend && npm install           # Install frontend dependencies
```

### Containerized Development (Multi-Clone Setup)
```bash
# Quick setup for first clone
cp docker/.env.example docker/.env
cd docker
docker compose -f docker-compose.dev.yml up --build

# For additional clones, use the setup script
./docker/scripts/setup-clone.sh

# Access services:
# Frontend: http://localhost:5173 (or your FRONTEND_PORT)
# Backend API: http://localhost:8000/docs (or your BACKEND_PORT)
# Database: localhost:5432 (or your DB_PORT)
```

See [docker/README.md](docker/README.md) for detailed multi-clone setup instructions.
## CI/CD Test Architecture

### Test Separation Strategy
The CI pipeline separates tests by type and dependency requirements for optimal performance and reliability:

**Unit Test Jobs (Phase 1 - Parallel):**
- `backend-test`: Backend unit tests with PostgreSQL
- `frontend-test`: Frontend unit tests with coverage
- `site-test`: Marketing site unit tests

**E2E Test Jobs (Phase 2 - After Unit Tests):**
- `site-e2e`: Marketing site E2E tests (depends only on site-test) - ⚡ starts early
- `e2e-auth`: Authentication & redirects (16 tests) - fastest feedback
- `e2e-demo`: Demo functionality + site demo integration (35+ tests)
- `e2e-standard`: Standard functionality (file management, account) 
- `e2e-uncategorized`: Tests without specific category tags
- `e2e-desktop-only`: Desktop-specific interactions (hover, keyboard shortcuts) - runs only on desktop browsers

**Efficiency Benefits:**
- Site E2E tests start as soon as site unit tests pass (don't wait for backend/frontend)
- Frontend E2E tests run in parallel across 5 specialized jobs
- Demo integration tests run in `e2e-demo` with both marketing site and frontend servers

### E2E Test Categories

**1. Frontend E2E Tests**
- Test frontend application functionality in isolation
- Require: Backend (port 8000) + Frontend (port 5173)

**2. Site E2E Tests (Non-Demo)**
- Test marketing site functionality in isolation  
- Require: Only marketing site (port 3000)
- Run with: `npm run test:e2e:all -- --grep-invert "demo"`

**3. Site Demo Integration Tests**
- Test cross-application user journeys from marketing site to frontend demo
- Require: Marketing site (port 3000) + Frontend (port 5173) + Backend (port 8000)
- Run with: `npm run test:e2e -- --grep "demo"`
- Environment: `FRONTEND_URL=http://localhost:5173`

**Why Demo Tests Are Separated:**
- Demo tests verify integration between two separate applications (marketing → frontend)
- They test complete user journeys: marketing site CTA → frontend demo functionality
- They require special environment configuration and cross-app testing utilities
- They have different failure modes (can fail if frontend is down, even if marketing site works)
- Separation allows marketing site tests to remain reliable independent of frontend status

### Playwright Configuration
- **CI Environment**: Single worker (`workers: 1`) for stability
- **Local Development**: Two workers (`workers: 2`) for speed
- **Retries**: 2 retries in CI, 1 retry locally
- **Performance**: `list` reporter, video disabled, traces only on failure
- **Browser Caching**: Playwright browsers cached between CI runs

### Test Categorization Tags
- **@auth**: Authentication & redirects (16 tests) - fastest feedback
- **@demo**: Demo functionality (35 tests) - critical user paths
- **@standard**: File management, account features, main functionality
- **@desktop-only**: Desktop-specific interactions (hover, keyboard shortcuts, focus management) - excluded from mobile browsers
- **No tag**: Uncategorized tests (run in e2e-uncategorized job)

**Desktop-Only Test Categories:**
- Hover interactions (RSM handrails, border dots)
- Keyboard shortcuts (focus mode 'c' key, file operations '.', search '/', view switching 'v,l/v,c')
- Keyboard navigation (j/k navigation, arrow keys, Enter/Space for file opening)
- Focus management and accessibility keyboard tests
- Split-screen desktop layouts

### Test Category Commands
```bash
# Run authentication tests (fastest feedback)
npm run test:e2e -- --grep "@auth"

# Run demo functionality tests
npm run test:e2e -- --grep "@demo"

# Run all desktop-only tests (keyboard shortcuts, hover interactions)
npm run test:e2e -- --grep "@desktop-only"

# Run all uncategorized tests (no tags at all)
npm run test:e2e -- --grep-invert "@"

# Run all tests except desktop-only (mobile-compatible tests)
npm run test:e2e -- --grep-invert "@desktop-only"
```
## Frontend Commands
```bash
npm install                           # Install dependencies
npm run dev                           # Run dev server
npm run lint                          # Lint code
npm test                              # Run unit tests
npm run test:e2e                      # Run E2E tests
```

## Site Commands
```bash
npm install                           # Install dependencies
npm run dev                           # Run dev server
npm run lint                          # Lint code
npm run test:run                      # Run unit tests
npm run test:e2e                      # Run E2E tests
npm run test:e2e:all                  # Run E2E tests (CI mode)
```

## Critical Rules
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