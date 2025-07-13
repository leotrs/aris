# Aris Development Task Runner
# Set environment variables from .env
set dotenv-load

# Default recipe - show help
default:
    @just --list

# Development Commands
# ====================

# Start development containers (uses current directory name as project)
dev *args="":
    @echo "Starting development containers for $(basename $(pwd))..."
    @PROJECT_NAME=$(basename $(pwd)); \
    BUILD_FLAG=""; \
    FORCE_BUILD=false; \
    for arg in {{args}}; do \
        if [ "$arg" = "--build" ]; then \
            FORCE_BUILD=true; \
            break; \
        fi; \
    done; \
    if [ "$FORCE_BUILD" = true ]; then \
        echo "Force rebuild requested via --build flag"; \
        BUILD_FLAG="--build"; \
        touch ~/.docker_build_check; \
    elif docker images | grep -q "$PROJECT_NAME-"; then \
        DOCKERFILES_CHANGED=false; \
        for dockerfile in docker/*/Dockerfile.dev; do \
            if [ -f "$dockerfile" ] && [ "$dockerfile" -nt ~/.docker_build_check 2>/dev/null ]; then \
                DOCKERFILES_CHANGED=true; \
                break; \
            fi; \
        done; \
        if [ docker/docker-compose.dev.yml -nt ~/.docker_build_check 2>/dev/null ]; then \
            DOCKERFILES_CHANGED=true; \
        fi; \
        if [ "$DOCKERFILES_CHANGED" = true ]; then \
            echo "Dockerfiles or compose file changed, rebuilding images..."; \
            BUILD_FLAG="--build"; \
            touch ~/.docker_build_check; \
        else \
            echo "Using existing images (no Dockerfile changes detected)"; \
        fi; \
    else \
        echo "No existing images found, building from scratch..."; \
        BUILD_FLAG="--build"; \
        touch ~/.docker_build_check; \
    fi; \
    docker compose --env-file .env -p "$PROJECT_NAME" -f docker/docker-compose.dev.yml up $BUILD_FLAG

# Stop development containers
stop:
    @echo "Stopping containers for $(basename $(pwd))..."
    docker compose -p $(basename $(pwd)) -f docker/docker-compose.dev.yml down

# View logs for development containers
logs:
    docker compose -p $(basename $(pwd)) -f docker/docker-compose.dev.yml logs -f

# Testing Commands
# ================

# Run all tests
test-all:
    cd backend && uv run pytest -n8
    cd frontend && npm run test:all
    cd site && npm run test:all

# Run all linters
lint-all:
    cd backend && uv run ruff check
    cd frontend && npm run lint
    cd site && npm run lint

# Run complete check (lint + typecheck + test)
check-all:
    cd backend && uv run ruff check
    cd backend && uv run mypy aris/
    cd backend && uv run pytest -n8
    cd frontend && npm run lint
    cd frontend && npm run test:run && npx playwright test --grep "@auth\b" --quiet
    cd site && npm run lint
    cd site && npm run test:run && npx playwright test --quiet

# Development Setup
# =================

# Initial setup for new development environment
init:
    @echo "Setting up development environment..."
    @if [ ! -f .env ]; then echo "Copying .env.example to .env"; cp .env.example .env; echo "Please edit .env with your desired configuration"; else echo ".env already exists"; fi
    @if [ ! -f frontend/.env ]; then echo "Copying frontend/.env.example to frontend/.env"; cp frontend/.env.example frontend/.env; else echo "frontend/.env already exists"; fi
    @if [ ! -f site/.env ]; then echo "Copying site/.env.example to site/.env"; cp site/.env.example site/.env; else echo "site/.env already exists"; fi
    @if [ ! -f docker/backend/.env ]; then echo "Copying docker/backend/.env.example to docker/backend/.env"; cp docker/backend/.env.example docker/backend/.env; else echo "docker/backend/.env already exists"; fi
    cd backend && uv sync --all-groups
    cd frontend && npm install
    cd site && npm install
    @echo "Setup complete! Edit .env files if needed, then run 'just dev' to start"

# Utility Commands
# ================

# Check container status
status:
    docker compose -p $(basename $(pwd)) ps

# Show environment configuration
env:
    @echo "Current environment configuration:"
    @if [ -f .env ]; then cat .env; else echo "No .env file found"; fi

# Send macOS notification
notify message:
    osascript -e "display notification \"{{message}}\" with title \"Claude Code\""
