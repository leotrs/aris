# Aris: Research publications. Web-native. Human-first.

[![CI](https://github.com/leotrs/aris/actions/workflows/ci.yml/badge.svg)](https://github.com/leotrs/aris/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/leotrs/aris/branch/main/graph/badge.svg)](https://codecov.io/gh/leotrs/aris)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.13+](https://img.shields.io/badge/python-3.13+-blue.svg)](https://www.python.org/downloads/)
[![Node.js 23+](https://img.shields.io/badge/node.js-23+-green.svg)](https://nodejs.org/)

**Aris** is a web-native scientific publishing platform that replaces static PDFs with
interactive, accessible HTML documents. Built for researchers, academics, scientists,
and students, Aris makes it easy to write, revise, collaborate, and publish work that’s
readable on any device, bringing scientific publications to the web. See more at
[](https://aris.pub).


## Getting Started

### Prerequisites

- Frontend: Node.js `>=23`, NPM `>=10`
- Backend: Python `>=3.13`, PostgreSQL `>=14`, FastAPI `>=0.115`

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/leotrs/aris.git
   cd aris
   ```

2. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend Setup**

   ```bash
   cd backend
   uv sync
   uvicorn main:app --reload
   ```

### Project Structure

```
aris/
│
├── backend/
├──── main.py        # FastAPI app
├──── aris           # package that contains routes, CRUD operations, etc
├──── scripts        # DB management scripts
├──── tests          # backend tests
│
├── frontend/
├──── index.html     # mounting point for the app
├──── src            # Vue 3 frontend source
├────── App.vue      # Vue App component
├────── router.js    # Vue Router component
├────── main.js      # script that mounts the app
├────── File.js      # object to hold a RSM file in memory
├────── FileStore.js # manage File objects
├────── login        # login view: auth via JWT
├────── home         # home view: view all files
├────── main         # main view: read and edit a file
├────── assets       # static resources
├────── common       # common components
├────── components   # legacy dir
├────── composables  # Vue composables
│
├── docs/            # Project documentation
│
├── docker/          # Dockerfiles
│
└── README.md
```

## Testing Infrastructure

### Test Types

**Backend Tests**
- **Unit Tests**: `uv run pytest -n8` - Test individual functions and API endpoints
- **Coverage**: Generated in `htmlcov/` directory

**Frontend Tests**  
- **Unit Tests**: `npm test` - Component and utility testing with Vitest
- **E2E Tests**: `npm run test:e2e` - End-to-end browser testing with Playwright

### E2E Test Setup

E2E tests require both backend and frontend servers running with a complete test environment.

#### Prerequisites
1. **PostgreSQL Database**: Running locally with `aris` database created
2. **Environment Variables**: Create `.env` file in `/backend/` with:
   ```bash
   TEST_USER_EMAIL=testuser@aris.pub
   TEST_USER_PASSWORD=your_test_password
   JWT_SECRET_KEY=your_jwt_secret
   DB_URL_LOCAL=postgresql+asyncpg://username@localhost:5432/aris
   ```

#### Complete E2E Setup Process
```bash
# 1. Setup Backend
cd backend
uv sync --all-groups                    # Install dependencies
alembic upgrade head                    # Run database migrations
uv run python scripts/reset_test_user.py  # Create stable test data
uvicorn main:app --reload               # Start backend server (localhost:8000)

# 2. Setup Frontend (in new terminal)
cd frontend  
npm install                             # Install dependencies
npm run dev                             # Start frontend server (localhost:5173)

# 3. Run E2E Tests (in new terminal)
cd frontend
npm run test:e2e                        # Run Playwright tests
```

#### Test Data Management
- **Test User**: `testuser@aris.pub` with stable test files and tags
- **Reset Script**: Use `scripts/reset_test_user.py` to reset test environment to known state
- **Visual Regression**: Test data designed for consistent visual regression testing

#### E2E Test Environment
- **Backend**: FastAPI server on `http://localhost:8000`
- **Frontend**: Vue.js dev server on `http://localhost:5173`  
- **Database**: Local PostgreSQL with test user and stable data
- **Authentication**: JWT-based auth with test user credentials

### Running Individual Test Suites

```bash
# Backend unit tests only
cd backend && uv run pytest -n8

# Frontend unit tests only  
cd frontend && npm test

# E2E tests only (requires both servers running)
cd frontend && npm run test:e2e

# Run all tests
cd backend && uv run pytest -n8
cd frontend && npm test && npm run test:e2e
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to get started.

Please ensure all tests pass and code is linted before submitting PRs:

```bash
# Backend checks
cd backend
uv run pytest -n8                       # All tests pass
uv run ruff check                       # No linting errors
uv run mypy aris/                       # No type errors

# Frontend checks  
cd frontend
npm test                                # All unit tests pass
npm run lint                            # No linting errors
npm run test:e2e                        # All E2E tests pass (requires backend)
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Authors
Made with <3 by [leotrs](https://leotrs.com).

---

Aris, empowering researchers, one draft at a time.
