import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Producer } from './Producer';

@Entity('producerfarm')
export class ProducerFarm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  producerId: string;

  @ManyToOne(() => Producer, (producer) => producer.farms, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'producerId' })
  producer: Producer;

  @Column({ type: 'varchar', length: 255 })
  farmName: string;

  @Column({ type: 'varchar', length: 255 })
  city: string;

  @Column({ type: 'varchar', length: 2 })
  state: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalArea: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  arableArea: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  vegetationArea: number;

  @Column({ type: 'simple-array', nullable: true })
  crops: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
