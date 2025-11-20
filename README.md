# Brain Agriculture API

A RESTful API for managing agricultural producers and their farms using Node.js, TypeScript, Express, and PostgreSQL with TypeORM.

## Features

- ✅ Proper PostgreSQL database connection with TypeORM
- ✅ Foreign key relationships with CASCADE delete
- ✅ Producer and Farm entity management
- ✅ Database migrations for schema management
- ✅ RESTful API endpoints
- ✅ Error handling and validation

## Database Schema

### Producer Table
- `id` (UUID, Primary Key)
- `name` (String)
- `cpfCnpj` (String, Unique)
- `email` (String, Optional)
- `phone` (String, Optional)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### ProducerFarm Table
- `id` (UUID, Primary Key)
- `producerId` (UUID, Foreign Key → Producer.id)
- `farmName` (String)
- `city` (String)
- `state` (String)
- `totalArea` (Decimal)
- `arableArea` (Decimal)
- `vegetationArea` (Decimal)
- `crops` (Array)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

## Solving the PostgreSQL Foreign Key Error

The original error `2BP01` ("constraint producerfarm_producerid_fkey depends on index producer_pkey") occurs when trying to drop or modify the `producer` table without handling dependent foreign keys. This project solves it by:

1. **CASCADE Delete**: Foreign keys are configured with `onDelete: 'CASCADE'`, so deleting a producer automatically deletes associated farms
2. **Proper Migration Order**: Migrations create tables in correct order (producer first, then producerfarm)
3. **TypeORM Relationship Management**: Entity relationships are properly defined with cascade options

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Zembrani/Brain-agriculture-api.git
cd Brain-agriculture-api
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=brain_agriculture
PORT=3000
NODE_ENV=development
```

4. Create the database:
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE brain_agriculture;

# Enable UUID extension
\c brain_agriculture
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

5. Run migrations:
```bash
npm run migration:run
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### Health Check
- **GET** `/health` - Check API and database status

### Producers
- **GET** `/producers` - Get all producers with their farms
- **GET** `/producers/:id` - Get a specific producer by ID
- **POST** `/producers` - Create a new producer
- **DELETE** `/producers/:id` - Delete a producer (cascades to farms)

### Farms
- **GET** `/farms` - Get all farms with producer info
- **POST** `/farms` - Create a new farm

## Example API Usage

### Create a Producer
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

### Create a Farm
```bash
curl -X POST http://localhost:3000/farms \
  -H "Content-Type: application/json" \
  -d '{
    "producerId": "producer-uuid-here",
    "farmName": "Fazenda Boa Vista",
    "city": "São Paulo",
    "state": "SP",
    "totalArea": 100.50,
    "arableArea": 60.30,
    "vegetationArea": 40.20,
    "crops": ["Soja", "Milho", "Café"]
  }'
```

### Get All Producers
```bash
curl http://localhost:3000/producers
```

### Delete a Producer (with cascade)
```bash
curl -X DELETE http://localhost:3000/producers/{id}
```

## Database Migration Commands

Generate a new migration:
```bash
npm run migration:generate -- src/migrations/MigrationName
```

Run pending migrations:
```bash
npm run migration:run
```

Revert last migration:
```bash
npm run migration:revert
```

## Troubleshooting

### Foreign Key Constraint Errors

If you encounter the error `2BP01` about dependent objects:

1. **Option 1: Use CASCADE** (Already implemented)
   - The foreign key is configured with `onDelete: 'CASCADE'`
   - Deleting a producer automatically deletes associated farms

2. **Option 2: Manual cleanup**
   - Delete farms before deleting producers
   - Or use `DROP ... CASCADE` in PostgreSQL

3. **Option 3: Re-run migrations**
   ```bash
   npm run migration:revert
   npm run migration:run
   ```

### Database Connection Issues

1. Verify PostgreSQL is running:
```bash
psql -U postgres -c "SELECT version();"
```

2. Check database exists:
```bash
psql -U postgres -l | grep brain_agriculture
```

3. Verify credentials in `.env` file

## Project Structure

```
Brain-agriculture-api/
├── src/
│   ├── config/
│   │   ├── data-source.ts       # TypeORM configuration
│   │   └── database.ts          # Database connection class
│   ├── entities/
│   │   ├── Producer.ts          # Producer entity
│   │   └── ProducerFarm.ts      # ProducerFarm entity
│   ├── migrations/
│   │   └── 1700000000000-CreateProducerAndFarmTables.ts
│   └── index.ts                 # Express application
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## License

MIT