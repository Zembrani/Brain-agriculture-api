# Brain Agriculture API - Docker Guide

## 🐳 Running with Docker

### Quick Start

```bash
# Start all services (database + API)
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f api

# Stop all services
docker-compose down
```

### Available Services

| Service | Container | Port | Description |
|---------|-----------|------|-------------|
| API | brain-agriculture-api | 3000 | NestJS Application |
| PostgreSQL | postgresAgro | 5432 | Production Database |
| PostgreSQL Test | postgresAgroTest | 5433 | Test Database |

### Accessing the Application

Once running, access:

- **API:** http://localhost:3000
- **Health Check:** http://localhost:3000/dashboard

### Troubleshooting

```bash
# View API logs
docker-compose logs api

# Restart services
docker-compose restart

# Remove volumes and restart fresh
docker-compose down -v
docker-compose up -d
```
