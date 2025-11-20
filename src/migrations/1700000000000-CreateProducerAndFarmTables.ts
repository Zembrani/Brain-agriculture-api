import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateProducerAndFarmTables1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create Producer table first
    await queryRunner.createTable(
      new Table({
        name: 'producer',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'cpfCnpj',
            type: 'varchar',
            length: '14',
            isUnique: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true
    );

    // Create ProducerFarm table
    await queryRunner.createTable(
      new Table({
        name: 'producerfarm',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'producerId',
            type: 'uuid',
          },
          {
            name: 'farmName',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'city',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'state',
            type: 'varchar',
            length: '2',
          },
          {
            name: 'totalArea',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'arableArea',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'vegetationArea',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'crops',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true
    );

    // Add foreign key with CASCADE delete
    await queryRunner.createForeignKey(
      'producerfarm',
      new TableForeignKey({
        name: 'producerfarm_producerid_fkey',
        columnNames: ['producerId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'producer',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key first
    await queryRunner.dropForeignKey('producerfarm', 'producerfarm_producerid_fkey');
    
    // Drop tables in reverse order
    await queryRunner.dropTable('producerfarm');
    await queryRunner.dropTable('producer');
  }
}
