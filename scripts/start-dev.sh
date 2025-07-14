#!/bin/bash

# Start development containers script
# This script handles Docker image building logic and container startup

set -e

PROJECT_NAME=$(basename $(pwd))
echo "Starting development containers for $PROJECT_NAME..."

# Parse arguments
BUILD_FLAG=""
FORCE_BUILD=false

for arg in "$@"; do
    if [ "$arg" = "--build" ]; then
        FORCE_BUILD=true
        break
    fi
done

# Determine if rebuild is needed
if [ "$FORCE_BUILD" = true ]; then
    echo "Force rebuild requested via --build flag"
    BUILD_FLAG="--build"
    touch ~/.docker_build_check
elif docker images | grep -q "$PROJECT_NAME-"; then
    DOCKERFILES_CHANGED=false
    
    # Check if any Dockerfiles have changed
    for dockerfile in docker/*/Dockerfile.dev; do
        if [ -f "$dockerfile" ] && [ "$dockerfile" -nt ~/.docker_build_check 2>/dev/null ]; then
            DOCKERFILES_CHANGED=true
            break
        fi
    done
    
    # Check if docker-compose file has changed
    if [ docker/docker-compose.dev.yml -nt ~/.docker_build_check 2>/dev/null ]; then
        DOCKERFILES_CHANGED=true
    fi
    
    if [ "$DOCKERFILES_CHANGED" = true ]; then
        echo "Dockerfiles or compose file changed, rebuilding images..."
        BUILD_FLAG="--build"
        touch ~/.docker_build_check
    else
        echo "Using existing images (no Dockerfile changes detected)"
    fi
else
    echo "No existing images found, building from scratch..."
    BUILD_FLAG="--build"
    touch ~/.docker_build_check
fi

# Start containers
docker compose --env-file .env -p "$PROJECT_NAME" -f docker/docker-compose.dev.yml up $BUILD_FLAG