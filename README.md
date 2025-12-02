# Brain Agriculture API

A REST API for managing rural producers, farms, and crop data, built as part of the Brain Agriculture technical challenge. This application provides comprehensive farm management capabilities with data validation, area calculations, and analytical dashboards.

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Running Tests](#running-tests)
- [Database Schema](#database-schema)

## 🌾 About the Project

This application manages the registration of rural producers and their properties, enabling tracking of farm data including areas, locations, and planted crops. It implements robust business validations and provides analytical insights through a comprehensive dashboard.

### Business Requirements Implemented

- ✅ Complete CRUD operations for rural producers
- ✅ CPF and CNPJ validation
- ✅ Area validation (ensuring productive + non-productive areas don't exceed total area)
- ✅ Multi-farm support per producer (0 to many relationship)
- ✅ Multi-crop tracking per farm with harvest year
- ✅ Analytical dashboard with aggregated data by state, crop, and land use

## 🚀 Features

### Producer Management
- Create, read, update, and delete rural producers
- Validate CPF/CNPJ using official validation algorithms
- Track producer type (Physical Person or Legal Entity)
- Calculate total area across all producer's farms

### Farm Management
- Register farms with location and area details
- Validate that productive + non-productive areas don't exceed total area
- Associate farms with producers
- Track city, state, and area metrics

### Crop Management
- Register multiple crops per farm
- Track crops by harvest year
- Support for various crop types (Soy, Corn, Coffee, Cotton, etc.)

### Dashboard & Analytics
- Total area registered across all farms
- Area breakdown by state
- Area breakdown by crop type
- Productive vs. non-productive area analysis

## 🛠 Tech Stack

### Core Technologies
- **Node.js** - JavaScript runtime
- **TypeScript** - Type-safe JavaScript
- **NestJS** - Progressive Node.js framework
- **PostgreSQL** - Relational database
- **TypeORM** - ORM for database management

### Development & Testing
- **Jest** - Testing framework
- **class-validator** - DTO validation
- **class-transformer** - Object transformation
- **cpf-cnpj-validator** - Brazilian document validation

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 🏗 Architecture

The project follows a clean, layered architecture pattern:

```
apps/src/
├── domain/              # Domain entities and DTOs
│   ├── producerDomain.ts
│   ├── farmDomain.ts
│   ├── cropDomain.ts
│   └── dashboardDomain.ts
├── application/         # Business logic layer
│   ├── services/        # Service implementations
│   └── repository/      # Repository interfaces
├── infrastructure/      # Data access layer
│   ├── entities/        # TypeORM entities
│   └── repositories/    # Repository implementations
├── presentation/        # API layer
│   ├── producer/        # Producer controller
│   ├── farm/           # Farm controller
│   ├── crop/           # Crop controller
│   └── dashboard/      # Dashboard controller
└── utils/              # Shared utilities
    └── validators/      # Custom validators
```

### Design Principles
- **SOLID** principles for maintainable code
- **Dependency Injection** for loose coupling
- **Repository Pattern** for data access abstraction
- **DTO Pattern** for data transfer and validation
- **Clean Architecture** for separation of concerns

## 🎯 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker and Docker Compose

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Brain-agriculture-api
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
# The default values work with the Docker setup
```

**Environment Variables:**
```env
NODE_ENV=development
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=pguser
POSTGRES_PASSWORD=secret123
POSTGRES_DATABASE=agriculture
POSTGRES_PORT_TEST=5433
POSTGRES_DATABASE_TEST=agriculture_test
```

> **Security Note:** 
> - The `.env` file is gitignored and will not be committed
> - Docker Compose automatically reads from `.env` file
> - Never commit sensitive credentials to version control
> - For production, use strong passwords and secure secrets management

4. Start the PostgreSQL database
```bash
# Docker Compose will automatically read variables from .env file
docker-compose up -d

# Check if containers are running
docker-compose ps
```

5. Initialize the database schema
```bash
# The init.sql script runs automatically on first container startup
# To re-initialize, remove the volumes and restart:
docker-compose down -v
docker-compose up -d
```

6. Run the application
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

The database will be initialized with sample data automatically.

4. Start the application
```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

## 📡 API Endpoints

### Producers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/producer` | List all producers |
| POST | `/producer` | Create a new producer |
| PUT | `/producer/:id` | Update a producer |
| DELETE | `/producer/:id` | Delete a producer |
| GET | `/producer/:id/total-area` | Get total area of producer's farms |

**Example Request Body (POST/PUT):**
```json
{
  "cpfCnpj": "470.332.457-18",
  "name": "João Silva",
  "phone": "(11) 98765-4321",
  "personType": "FISICA"
}
```

### Farms

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/farm` | List all farms |
| POST | `/farm` | Create a new farm |
| PUT | `/farm/:id` | Update a farm |
| DELETE | `/farm/:id` | Delete a farm |

**Example Request Body (POST/PUT):**
```json
{
  "producer_id": "1",
  "name": "Fazenda Santa Rita",
  "city": "Campinas",
  "state": "SP",
  "totalArea": 1500,
  "productiveArea": 1200,
  "nonProductiveArea": 300
}
```

### Crops

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/crop` | List all crops |
| POST | `/crop` | Register a new crop |

**Example Request Body (POST):**
```json
{
  "farm_id": "1",
  "year": 2024,
  "crop": "Soja"
}
```

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Get dashboard analytics |

**Example Response:**
```json
{
  "totalArea": 17500,
  "productiveArea": 14950,
  "nonProductiveArea": 2550,
  "areaByState": [
    {
      "state": "SP",
      "totalArea": 7300,
      "productiveArea": 6300,
      "nonProductiveArea": 1000
    }
  ],
  "areaByCrop": [
    {
      "crop": "Soja",
      "totalArea": 6500,
      "productiveArea": 5700,
      "nonProductiveArea": 800
    }
  ]
}
```

## 🧪 Running Tests

The project includes comprehensive unit tests with high coverage:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:cov
```

**Test Coverage:**
- 115 unit tests
- ~95% code coverage
- Tests for all services, repositories, and controllers

## 🗄 Database Schema

### Producer Table
- `id` - Primary key
- `cpfCnpj` - CPF or CNPJ (validated)
- `name` - Producer name
- `phone` - Contact phone
- `personType` - FISICA or JURIDICA

### Farm Table
- `id` - Primary key
- `producer_id` - Foreign key to Producer
- `name` - Farm name
- `city` - City location
- `state` - State (UF)
- `totalArea` - Total area in hectares
- `productiveArea` - Productive area in hectares
- `nonProductiveArea` - Non-productive area in hectares

### Crop Table
- `id` - Primary key
- `farm_id` - Foreign key to Farm
- `year` - Harvest year
- `crops` - Crop type (Soja, Milho, Café, etc.)

### Relationships
- One Producer can have many Farms (1:N)
- One Farm can have many Crops (1:N)
- Cascade delete enabled

## 📊 Code Quality

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Class-validator** for runtime validation
- **Jest** for comprehensive testing

## 🔒 Validations

### Business Rules
1. CPF/CNPJ must be valid according to Brazilian standards
2. Productive Area + Non-Productive Area ≤ Total Area
3. All required fields validated with class-validator
4. Cascade deletion to maintain referential integrity

### Custom Validators
- `IsCpfCnpj` - Validates Brazilian CPF and CNPJ documents
- `ValidationArea` - Ensures area sum doesn't exceed total

## 📝 Sample Data

The database is initialized with sample data including:
- 5 producers (both physical and legal persons)
- 7 farms across different Brazilian states
- 15 crop records with various types and years

## 🚧 Future Enhancements

- Metrics for observability
- Authentication and authorization
- API rate limiting
- Pagination for list endpoints

## 📄 License

This project was developed as part of a technical challenge for Brain Agriculture.

---

Built with ❤️ using NestJS and TypeScript
