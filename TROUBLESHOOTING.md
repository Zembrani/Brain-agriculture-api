# PostgreSQL Foreign Key Error - Complete Guide

## Understanding the Error

The error you encountered:
```
code: '2BP01'
detail: 'constraint producerfarm_producerid_fkey on table producerfarm depends on index producer_pkey'
hint: 'Use DROP ... CASCADE to drop the dependent objects too.'
```

This error (`2BP01` - dependent objects still exist) occurs when:
1. Trying to drop a table that has dependent foreign keys
2. Trying to drop a column referenced by a foreign key
3. Trying to modify a primary key that foreign keys depend on

## Root Causes

1. **Improper Table Deletion Order**: Attempting to delete the parent table (producer) before its dependent child tables (producerfarm)
2. **Missing CASCADE Options**: Foreign keys without proper CASCADE configuration
3. **Migration Issues**: Incorrect order of operations in database migrations

## Solutions Implemented in This Project

### 1. CASCADE Delete Configuration

In the entities:
```typescript
// Producer.ts
@OneToMany(() => ProducerFarm, (farm) => farm.producer, {
  cascade: true,
  onDelete: 'CASCADE'
})
farms: ProducerFarm[];

// ProducerFarm.ts
@ManyToOne(() => Producer, (producer) => producer.farms, {
  onDelete: 'CASCADE'
})
producer: Producer;
```

### 2. Proper Migration Order

In migrations:
```typescript
// UP: Create parent first, then child
1. Create producer table
2. Create producerfarm table
3. Add foreign key constraint

// DOWN: Drop in reverse order
1. Drop foreign key constraint
2. Drop producerfarm table
3. Drop producer table
```

### 3. Safe Deletion Patterns

The API automatically handles cascade deletions:
```typescript
// Deleting a producer automatically deletes all associated farms
DELETE /producers/:id
```

## Manual Database Operations

If you need to manually fix the database:

### Option 1: Drop with CASCADE
```sql
-- Drop tables with CASCADE
DROP TABLE IF EXISTS producerfarm CASCADE;
DROP TABLE IF EXISTS producer CASCADE;
```

### Option 2: Drop Foreign Key First
```sql
-- Drop foreign key constraint
ALTER TABLE producerfarm DROP CONSTRAINT producerfarm_producerid_fkey;

-- Now you can drop tables independently
DROP TABLE producerfarm;
DROP TABLE producer;
```

### Option 3: Delete Data First
```sql
-- Delete child records first
DELETE FROM producerfarm;

-- Then delete parent records
DELETE FROM producer;
```

## Best Practices

### 1. Always Use Migrations
- Never modify database schema directly
- Use TypeORM migrations for all schema changes
- Test migrations in development before production

### 2. Define Relationships Properly
```typescript
// Parent entity
@OneToMany(() => Child, child => child.parent, {
  cascade: true,      // Propagate operations
  onDelete: 'CASCADE' // Auto-delete children
})
children: Child[];

// Child entity
@ManyToOne(() => Parent, parent => parent.children, {
  onDelete: 'CASCADE' // Delete when parent is deleted
})
parent: Parent;
```

### 3. Use TypeORM's QueryRunner for Complex Operations
```typescript
const queryRunner = dataSource.createQueryRunner();
await queryRunner.connect();
await queryRunner.startTransaction();

try {
  // Your database operations
  await queryRunner.commitTransaction();
} catch (err) {
  await queryRunner.rollbackTransaction();
  throw err;
} finally {
  await queryRunner.release();
}
```

### 4. Test Cascade Operations
```typescript
// Test that deleting a producer deletes farms
const producer = await producerRepo.save({ name: 'Test' });
const farm = await farmRepo.save({ producerId: producer.id, /* ... */ });

await producerRepo.delete(producer.id);

const remainingFarms = await farmRepo.find({ where: { producerId: producer.id } });
// Should be empty due to CASCADE delete
```

## Common Scenarios

### Scenario 1: Changing Primary Key Type
If you need to change a primary key that's referenced:

```typescript
// Migration
export class ChangePrimaryKeyType implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Drop foreign key
    await queryRunner.dropForeignKey('producerfarm', 'producerfarm_producerid_fkey');
    
    // 2. Alter both tables
    await queryRunner.query(`ALTER TABLE producer ALTER COLUMN id TYPE varchar USING id::varchar`);
    await queryRunner.query(`ALTER TABLE producerfarm ALTER COLUMN producerId TYPE varchar USING producerId::varchar`);
    
    // 3. Recreate foreign key
    await queryRunner.createForeignKey('producerfarm', new TableForeignKey({
      columnNames: ['producerId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'producer',
      onDelete: 'CASCADE'
    }));
  }
}
```

### Scenario 2: Renaming a Referenced Column
```typescript
// Migration
export class RenameReferencedColumn implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Drop foreign key
    await queryRunner.dropForeignKey('producerfarm', 'producerfarm_producerid_fkey');
    
    // 2. Rename columns
    await queryRunner.renameColumn('producer', 'id', 'producerId');
    
    // 3. Recreate foreign key
    await queryRunner.createForeignKey('producerfarm', new TableForeignKey({
      columnNames: ['producerId'],
      referencedColumnNames: ['producerId'],
      referencedTableName: 'producer',
      onDelete: 'CASCADE'
    }));
  }
}
```

### Scenario 3: Adding a New Dependent Table
```typescript
// Always create parent tables first
export class AddCropTable implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create the new table
    await queryRunner.createTable(new Table({
      name: 'crop',
      columns: [/* ... */]
    }));
    
    // 2. Add foreign key to existing table
    await queryRunner.createForeignKey('producerfarm', new TableForeignKey({
      columnNames: ['cropId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'crop',
      onDelete: 'SET NULL' // Or CASCADE depending on requirements
    }));
  }
}
```

## Verifying Your Setup

Run these commands to verify the foreign key configuration:

```sql
-- Check foreign key constraints
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  rc.delete_rule,
  rc.update_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
  ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'producerfarm';
```

Expected output should show:
- `delete_rule`: CASCADE
- `update_rule`: CASCADE

## Additional Resources

- [PostgreSQL Foreign Keys Documentation](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK)
- [TypeORM Relations Documentation](https://typeorm.io/relations)
- [TypeORM Cascade Options](https://typeorm.io/relations#cascades)

## Support

If you encounter issues:
1. Check the error logs for specific constraint names
2. Verify your entity relationships match the database schema
3. Review migration order
4. Test in development before applying to production
