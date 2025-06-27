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

**Login credentials (auto-seeded):**
- 📧 **Email**: `foo@bar.com`
- 🔑 **Password**: `admin`

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
DB_NAME=aris
TEST_DB_NAME=aris_test
```

**Clone 3:**
```env
BACKEND_PORT=8002
FRONTEND_PORT=5175
STORYBOOK_PORT=6008
DB_PORT=5434
DB_NAME=aris
TEST_DB_NAME=aris_test
```

### 3. Start Your Clones

**Important**: Use unique project names to prevent clones from interfering with each other:

```bash
# Clone 1 (main development)
cd aris-main/docker
docker compose -p aris-main -f docker-compose.dev.yml up --build

# Clone 2 (feature branch) 
cd aris-feature/docker
docker compose -p aris-feature -f docker-compose.dev.yml up --build

# Clone 3 (experimental)
cd aris-experiment/docker  
docker compose -p aris-experiment -f docker-compose.dev.yml up --build
```

**Access your clones:**
- Clone 1: http://localhost:5173 (shows "LOCAL:8000")
- Clone 2: http://localhost:5174 (shows "LOCAL:8001") 
- Clone 3: http://localhost:5175 (shows "LOCAL:8002")

### 4. Managing Multiple Clones

```bash
# Check all running containers
docker ps --format "table {{.Names}}\t{{.Ports}}"

# Stop specific clone
docker compose -p aris-main down
docker compose -p aris-feature down

# Stop specific clone and remove volumes (fresh start)
docker compose -p aris-main down -v
```

## 🏗️ Architecture

### Services

- **Backend**: FastAPI with hot reload, async PostgreSQL connection
- **Frontend**: Vue.js + Vite with hot module replacement
- **Database**: PostgreSQL 16 with automatic migrations and health checks

### Development Features

- **Volume Mounts**: Source code changes sync instantly
- **Database Migrations**: Run automatically on container startup
- **Auto-Seeding**: Pre-populated with user and sample data
- **Environment Isolation**: Separate databases and ports per clone
- **Development Tools**: Built-in debuggers, dev servers, and monitoring

## 🎲 Auto-Seeding

Every fresh container automatically includes a complete development dataset:

### Pre-loaded User Account
- **Email**: `foo@bar.com`
- **Password**: `admin`
- **Name**: Leo Torres
- **Initials**: LT
- **Avatar Color**: Blue

### Sample Content
- **18 Files**: Realistic documents with actual RSM content, including mathematical notation and formatted text
- **18 Tags**: Various categories like 'math2', 'rsm', 'nb', 'journal', 'research', etc.
- **26 File-Tag Relationships**: Files properly categorized with multiple tags

### Data Isolation
- **Per-Clone Independence**: Each clone has its own complete dataset
- **Container-Level Isolation**: Different ports create separate Docker containers with isolated databases
- **Same Database Names**: All clones use `DB_NAME=aris` since isolation happens at the container level
- **No Cross-Clone Syncing**: Data changes in one clone don't affect others
- **Persistent Storage**: Data survives container restarts within each clone
- **Fresh Start Option**: Use `docker compose down -v` to reset to clean state

### Seeding Process
The auto-seeding happens automatically during container startup:
1. Database migrations run first
2. User and sample data inserted with conflict handling
3. Sequences updated to prevent ID conflicts
4. Application starts with ready-to-use data

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