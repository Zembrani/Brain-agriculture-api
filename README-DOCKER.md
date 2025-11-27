# 🐳 Docker Quick Start

## Running the Complete Application

```bash
# 1. Build and start all services
docker compose up -d

# 2. Check status
docker compose ps

# 3. Access the application
# API: http://localhost:3000
# Swagger: http://localhost:3000/api
# Dashboard: http://localhost:3000/dashboard
```

## Common Commands

```bash
# View logs
docker compose logs -f api

# Stop services
docker compose down

# Rebuild after code changes
docker compose build api
docker compose up -d

# Fresh start (removes volumes)
docker compose down -v
docker compose up -d
```

## Services

- **API** - brain-agriculture-api:3000
- **PostgreSQL** - postgresAgro:5432
- **PostgreSQL Test** - postgresAgroTest:5433

All services include health checks and auto-restart.

---

For detailed documentation, see [docs/DOCKER.md](docs/DOCKER.md)
