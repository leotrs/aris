# Aris Multi-Clone Development Environment

This directory contains Docker-based development infrastructure for running multiple isolated Aris instances simultaneously.

## 🎯 Purpose

Solve the multi-clone development nightmare by providing:
- **Complete isolation** between different repository clones
- **No port conflicts** - each clone uses different ports  
- **Production-like setup** with PostgreSQL databases
- **Instant file sync** - edit locally, changes appear immediately in containers
- **Hot reloading** for both frontend (Vite) and backend (FastAPI)

## 📁 Directory Structure

```
docker/
├── README.md                 # This documentation
├── docker-compose.dev.yml    # Multi-service development stack
├── .env.example              # Environment template for port configuration
├── backend/
│   ├── Dockerfile.dev        # Backend development container
│   ├── docker-entrypoint.sh  # Database migration & startup script
│   ├── init_test_db.sql      # Test database initialization
│   └── .env.example          # Backend environment template
├── frontend/
│   └── Dockerfile.dev        # Frontend development container
├── scripts/
│   └── setup-clone.sh        # Quick clone setup script
└── docs/
    └── troubleshooting.md    # Common issues & solutions
```

## 🚀 Quick Start

### 1. Set Up Your First Clone

```bash
# Copy environment template
cp docker/.env.example docker/.env

# Start the development stack
cd docker
docker compose -f docker-compose.dev.yml up --build
```

**Access your services:**
- 🌐 **Frontend**: http://localhost:5173
- 🔧 **Backend API**: http://localhost:8000/docs
- 📊 **Health Check**: http://localhost:8000/health
- 🗄️ **Database**: localhost:5432

### 2. Set Up Additional Clones

For each additional repository clone:

```bash
# In clone directory, copy and customize environment
cp docker/.env.example docker/.env
```

Edit `docker/.env` with unique ports:

**Clone 2:**
```env
BACKEND_PORT=8001
FRONTEND_PORT=5174
STORYBOOK_PORT=6007
DB_PORT=5433
DB_NAME=aris_clone2
TEST_DB_NAME=aris_clone2_test
```

**Clone 3:**
```env
BACKEND_PORT=8002
FRONTEND_PORT=5175
STORYBOOK_PORT=6008
DB_PORT=5434
DB_NAME=aris_clone3
TEST_DB_NAME=aris_clone3_test
```

## 🏗️ Architecture

### Services

- **Backend**: FastAPI with hot reload, async PostgreSQL connection
- **Frontend**: Vue.js + Vite with hot module replacement
- **Database**: PostgreSQL 16 with automatic migrations and health checks

### Development Features

- **Volume Mounts**: Source code changes sync instantly
- **Database Migrations**: Run automatically on container startup
- **Environment Isolation**: Separate databases and ports per clone
- **Development Tools**: Built-in debuggers, dev servers, and monitoring

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BACKEND_PORT` | 8000 | FastAPI server port |
| `FRONTEND_PORT` | 5173 | Vite dev server port |
| `STORYBOOK_PORT` | 6006 | Storybook server port |
| `DB_PORT` | 5432 | PostgreSQL port |
| `DB_NAME` | aris | Database name |
| `TEST_DB_NAME` | aris_test | Test database name |

### File Synchronization

Your local source code is mounted into containers with instant sync:
- **Backend**: `../backend` → `/app` (Python FastAPI)
- **Frontend**: `../frontend` → `/app` (Vue.js + Vite)

Changes to your local files appear immediately in running containers.

## 📋 Common Commands

### Start Development Environment
```bash
cd docker
docker compose -f docker-compose.dev.yml up
```

### Rebuild After Dependency Changes
```bash
docker compose -f docker-compose.dev.yml up --build
```

### Stop Services
```bash
docker compose -f docker-compose.dev.yml down
```

### View Logs
```bash
docker compose -f docker-compose.dev.yml logs -f [service-name]
```

### Run Database Commands
```bash
# Connect to database
docker compose -f docker-compose.dev.yml exec postgres psql -U aris -d aris

# Run backend commands
docker compose -f docker-compose.dev.yml exec backend python -m pytest
```

## 🐛 Troubleshooting

### Port Already in Use
If you get port conflicts, check your `.env` file and ensure unique ports across clones.

### Database Connection Issues
1. Verify PostgreSQL container is healthy: `docker compose ps`
2. Check environment variables match in both services
3. Ensure migrations completed: `docker compose logs backend`

### File Changes Not Syncing
1. Verify volume mounts in `docker-compose.dev.yml`
2. Check file permissions on host system
3. Restart containers if needed

## 🔄 Data Migration

### Export User Data (from host database)
```bash
# Export specific user and related data
psql -d aris -c "COPY (...) TO STDOUT" > user_export.sql
```

### Import into Container
```bash
docker compose -f docker-compose.dev.yml exec -T postgres psql -U aris -d aris < user_export.sql
```

## 🎭 Multiple Clone Workflow

1. **Clone 1** (main): `localhost:8000` / `localhost:5173`
2. **Clone 2** (feature): `localhost:8001` / `localhost:5174`  
3. **Clone 3** (experiment): `localhost:8002` / `localhost:5175`

Each clone operates independently with its own:
- ✅ Database instance and data
- ✅ Port allocation  
- ✅ Container environment
- ✅ Development state

## 📚 Related Documentation

- [Backend Setup](../backend/README.md)
- [Frontend Setup](../frontend/README.md)
- [CLAUDE.md](../CLAUDE.md) - Project development guidelines