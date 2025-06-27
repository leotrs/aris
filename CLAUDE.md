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

## Frontend Commands
```bash
npm install                           # Install dependencies
npm run dev                           # Run dev server
npm run lint                          # Lint code
npm test                              # Run unit tests
npm run test:e2e                      # Run E2E tests
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