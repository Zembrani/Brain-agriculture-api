# Quick Reference Guide

## Quick Start

```bash
# 1. Clone and setup
git clone https://github.com/Zembrani/Brain-agriculture-api.git
cd Brain-agriculture-api

# 2. Run setup script (Linux/Mac)
./setup.sh

# 3. Start development server
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=brain_agriculture
PORT=3000
NODE_ENV=development
```

## Common Commands

### Development
```bash
npm run dev          # Start development server with ts-node
npm run build        # Compile TypeScript to JavaScript
npm start            # Run production server
```

### Database Migrations
```bash
npm run migration:run      # Run all pending migrations
npm run migration:revert   # Revert last migration
npm run migration:generate -- src/migrations/MyMigration  # Generate new migration
```

### Database Operations
```bash
# Create database manually
psql -U postgres -c "CREATE DATABASE brain_agriculture"

# Enable UUID extension
psql -U postgres -d brain_agriculture -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\""

# Connect to database
psql -U postgres -d brain_agriculture

# View tables
\dt

# View table structure
\d producer
\d producerfarm

# View foreign keys
\d+ producerfarm
```

## API Examples

### Health Check
```bash
curl http://localhost:3000/health
```

### Create Producer
```bash
curl -X POST http://localhost:3000/producers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "cpfCnpj": "12345678901",
    "email": "joao@example.com",
    "phone": "11999999999"
  }'
```

### Get All Producers
```bash
curl http://localhost:3000/producers
```

### Get Single Producer
```bash
curl http://localhost:3000/producers/{id}
```

### Delete Producer (with cascade)
```bash
curl -X DELETE http://localhost:3000/producers/{id}
```

### Create Farm
```bash
curl -X POST http://localhost:3000/farms \
  -H "Content-Type: application/json" \
  -d '{
    "producerId": "uuid-here",
    "farmName": "Fazenda Boa Vista",
    "city": "São Paulo",
    "state": "SP",
    "totalArea": 100.50,
    "arableArea": 60.30,
    "vegetationArea": 40.20,
    "crops": ["Soja", "Milho", "Café"]
  }'
```

### Get All Farms
```bash
curl http://localhost:3000/farms
```

## Troubleshooting Quick Fixes

### Error: Cannot connect to database
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list               # Mac

# Start PostgreSQL
sudo systemctl start postgresql  # Linux
brew services start postgresql   # Mac
```

### Error: Database does not exist
```bash
psql -U postgres -c "CREATE DATABASE brain_agriculture"
```

### Error: Foreign key constraint violation
```bash
# The CASCADE delete is already configured
# When deleting a producer, farms are automatically deleted
# No manual intervention needed
```

### Error: Migration failed
```bash
# Revert last migration
npm run migration:revert

# Fix the migration file
# Then run again
npm run migration:run
```

### Reset Database (Development only!)
```bash
# Drop and recreate database
psql -U postgres << EOF
DROP DATABASE IF EXISTS brain_agriculture;
CREATE DATABASE brain_agriculture;
\c brain_agriculture
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
EOF

# Run migrations
npm run migration:run
```

## Project Structure

```
Brain-agriculture-api/
├── src/
│   ├── config/
│   │   ├── data-source.ts       # TypeORM DataSource configuration
│   │   └── database.ts          # Database connection singleton
│   ├── entities/
│   │   ├── Producer.ts          # Producer entity with CASCADE
│   │   └── ProducerFarm.ts      # ProducerFarm entity with foreign key
│   ├── migrations/
│   │   └── 1700000000000-CreateProducerAndFarmTables.ts
│   └── index.ts                 # Express server with API routes
├── .env.example                 # Environment template
├── package.json
├── tsconfig.json
├── setup.sh                     # Automated setup script
├── README.md                    # Full documentation
├── TROUBLESHOOTING.md          # Detailed error solutions
└── QUICK_REFERENCE.md          # This file
```

## Key Features

✅ **Foreign Key CASCADE**: Deleting a producer automatically deletes farms
✅ **UUID Primary Keys**: Using PostgreSQL UUID extension
✅ **TypeORM Migrations**: Version-controlled database schema
✅ **Proper Error Handling**: Connection errors are caught and logged
✅ **Entity Relationships**: One-to-many properly configured

## Testing the CASCADE Delete

```bash
# 1. Create a producer
PRODUCER_ID=$(curl -s -X POST http://localhost:3000/producers \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","cpfCnpj":"12345678901"}' | jq -r '.id')

# 2. Create a farm for this producer
curl -X POST http://localhost:3000/farms \
  -H "Content-Type: application/json" \
  -d "{\"producerId\":\"$PRODUCER_ID\",\"farmName\":\"Test Farm\",\"city\":\"SP\",\"state\":\"SP\",\"totalArea\":100,\"arableArea\":60,\"vegetationArea\":40}"

# 3. Delete the producer (farm will be automatically deleted)
curl -X DELETE http://localhost:3000/producers/$PRODUCER_ID

# 4. Verify farm is gone
curl http://localhost:3000/farms
```

## Database Schema Verification

```sql
-- Check if CASCADE is properly configured
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
  ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'producerfarm';

-- Should show: delete_rule = 'CASCADE'
```

## Need Help?

1. Check `README.md` for full documentation
2. Check `TROUBLESHOOTING.md` for detailed error solutions
3. Review entity files for relationship configuration
4. Check migration files for schema setup
