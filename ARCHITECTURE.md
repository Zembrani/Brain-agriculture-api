# Architecture Diagram

## Database Schema with CASCADE Relationships

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PostgreSQL Database                           │
│                         brain_agriculture                            │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐              ┌──────────────────────────┐
│   Producer Table         │              │  ProducerFarm Table      │
├──────────────────────────┤              ├──────────────────────────┤
│ id (UUID, PK)           │◄─────────────┤ id (UUID, PK)            │
│ name                     │   CASCADE    │ producerId (UUID, FK)    │
│ cpfCnpj (unique)        │   DELETE &   │ farmName                 │
│ email                    │   UPDATE     │ city                     │
│ phone                    │              │ state                    │
│ createdAt               │              │ totalArea                │
│ updatedAt               │              │ arableArea               │
└──────────────────────────┘              │ vegetationArea           │
                                          │ crops                    │
     When deleted →                       │ createdAt               │
     Automatically deletes                │ updatedAt               │
     all associated farms                 └──────────────────────────┘
```

## API Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Express REST API                              │
│                     http://localhost:3000                            │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                 ┌────────────────┼────────────────┐
                 │                │                │
        ┌────────▼───────┐ ┌────▼──────┐ ┌───────▼────────┐
        │  GET /health   │ │ Producers │ │     Farms      │
        │                │ │ Endpoints │ │   Endpoints    │
        └────────────────┘ └───────────┘ └────────────────┘
                                  │                │
                         ┌────────▼────────────────▼────────┐
                         │     TypeORM Repository Layer     │
                         └────────┬─────────────────────────┘
                                  │
                         ┌────────▼────────┐
                         │ Database Layer  │
                         │   (TypeORM)     │
                         └────────┬────────┘
                                  │
                         ┌────────▼────────┐
                         │   PostgreSQL    │
                         └─────────────────┘
```

## Request Flow: Delete Producer with CASCADE

```
┌──────────────────────────────────────────────────────────────────────┐
│ 1. Client Request: DELETE /producers/{id}                            │
└───────────────────────────┬──────────────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────────────┐
│ 2. Express API Handler                                                │
│    - Validates request                                                │
│    - Gets producer repository                                         │
└───────────────────────────┬──────────────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────────────┐
│ 3. TypeORM Repository                                                 │
│    - Executes: producerRepository.delete(id)                         │
└───────────────────────────┬──────────────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────────────┐
│ 4. PostgreSQL Database                                                │
│    - Deletes producer record                                          │
│    - CASCADE automatically deletes all producerfarm records          │
│      where producerId = {id}                                         │
└───────────────────────────┬──────────────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────────────┐
│ 5. Response: Success                                                  │
│    - Producer deleted                                                 │
│    - All associated farms deleted automatically                       │
└──────────────────────────────────────────────────────────────────────┘
```

## Error 2BP01: Before vs After

### BEFORE (Causes Error)
```
Without CASCADE configuration:

Producer Table                 ProducerFarm Table
┌──────────────┐              ┌──────────────┐
│ id: 123      │◄─────────────┤ producerId   │
│ name: John   │  FK without  │ farmName     │
└──────────────┘  CASCADE     └──────────────┘

DELETE producer WHERE id = 123
              ▼
         ❌ ERROR 2BP01
    Dependent objects exist!
    Cannot delete producer
    because farms reference it
```

### AFTER (Works Correctly)
```
With CASCADE configuration:

Producer Table                 ProducerFarm Table
┌──────────────┐              ┌──────────────┐
│ id: 123      │◄─────────────┤ producerId   │
│ name: John   │ FK CASCADE   │ farmName     │
└──────────────┘   DELETE     └──────────────┘

DELETE producer WHERE id = 123
              ▼
         ✅ SUCCESS
    1. Producer deleted
    2. All farms automatically deleted
    3. No constraint violation
```

## TypeORM Entity Relationships

```typescript
// Producer.ts
@Entity('producer')
class Producer {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @OneToMany(() => ProducerFarm, farm => farm.producer, {
    cascade: true,      // ← Enables cascade operations
    onDelete: 'CASCADE' // ← Auto-delete children
  })
  farms: ProducerFarm[];
}

// ProducerFarm.ts
@Entity('producerfarm')
class ProducerFarm {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @ManyToOne(() => Producer, producer => producer.farms, {
    onDelete: 'CASCADE' // ← Delete this if parent is deleted
  })
  @JoinColumn({ name: 'producerId' })
  producer: Producer;
}
```

## Migration Flow

```
Migration: CreateProducerAndFarmTables
│
├─ UP (Create schema)
│  ├─ 1. Create producer table (parent)
│  ├─ 2. Create producerfarm table (child)
│  └─ 3. Add foreign key with CASCADE:
│        producerfarm_producerid_fkey
│        ON DELETE CASCADE
│        ON UPDATE CASCADE
│
└─ DOWN (Rollback)
   ├─ 1. Drop foreign key constraint
   ├─ 2. Drop producerfarm table
   └─ 3. Drop producer table
```

## File Structure Visualization

```
Brain-agriculture-api/
│
├─ 📄 Configuration Files
│  ├─ package.json           ← Dependencies
│  ├─ tsconfig.json          ← TypeScript config
│  ├─ .env.example           ← Environment template
│  └─ .gitignore             ← Ignore node_modules, dist, .env
│
├─ 📁 src/
│  │
│  ├─ 📁 config/
│  │  ├─ data-source.ts      ← TypeORM DataSource
│  │  └─ database.ts         ← Connection manager
│  │
│  ├─ 📁 entities/
│  │  ├─ Producer.ts         ← Parent entity with CASCADE
│  │  └─ ProducerFarm.ts     ← Child entity with FK
│  │
│  ├─ 📁 migrations/
│  │  └─ 1700000000000-CreateProducerAndFarmTables.ts
│  │
│  └─ index.ts               ← Express app & API routes
│
├─ 📁 dist/                   ← Compiled JavaScript (generated)
│
└─ 📚 Documentation
   ├─ README.md              ← Main documentation
   ├─ SOLUTION_SUMMARY.md   ← This solution overview
   ├─ TROUBLESHOOTING.md    ← Error solutions
   ├─ QUICK_REFERENCE.md    ← Command reference
   ├─ ARCHITECTURE.md       ← This file
   └─ setup.sh              ← Setup automation script
```

## Data Flow Example

### Creating a Producer with Farms

```
POST /producers
{
  "name": "João Silva",
  "cpfCnpj": "12345678901",
  "farms": [
    {
      "farmName": "Fazenda A",
      "city": "São Paulo",
      ...
    }
  ]
}
       │
       ▼
  TypeORM saves Producer
       │
       ▼
  CASCADE: TypeORM saves Farms
       │
       ▼
  Database commits transaction
       │
       ▼
  Returns complete Producer with Farms
```

### Deleting a Producer (CASCADE in action)

```
DELETE /producers/123
       │
       ▼
  TypeORM: delete(123)
       │
       ▼
  PostgreSQL executes:
    DELETE FROM producer WHERE id = 123
       │
       ▼
  CASCADE triggers automatically:
    DELETE FROM producerfarm WHERE producerId = 123
       │
       ▼
  Both operations succeed
       │
       ▼
  Returns: { message: "Success" }
```

## Technology Stack

```
┌─────────────────────────────────────────┐
│         Application Layer               │
│  Node.js + TypeScript + Express         │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         ORM Layer                       │
│  TypeORM (Entities, Repositories)       │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         Database Driver                 │
│  pg (node-postgres)                     │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         Database                        │
│  PostgreSQL 12+                         │
└─────────────────────────────────────────┘
```

## Key Components

| Component | Purpose | Key Feature |
|-----------|---------|-------------|
| Express | HTTP Server | RESTful API endpoints |
| TypeScript | Type Safety | Compile-time checking |
| TypeORM | ORM | Entity relationships & migrations |
| PostgreSQL | Database | CASCADE constraints |
| UUID | Primary Keys | Distributed-safe IDs |

## Security Measures

✅ **Environment Variables**: Secrets in .env (not committed)
✅ **TypeORM Protection**: ORM prevents SQL injection
✅ **Type Safety**: TypeScript catches errors at compile time
✅ **Migration Control**: Schema changes are versioned
✅ **CodeQL Scan**: Zero vulnerabilities detected

---

This architecture ensures that the PostgreSQL foreign key error (2BP01) never occurs by implementing CASCADE operations at every level of the stack.
