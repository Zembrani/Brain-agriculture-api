import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProducerEntity } from "./producerEntity";

@Entity("farm")
export class FarmEntity {
  @PrimaryGeneratedColumn("identity")
  id: string;

  @ManyToOne(() => ProducerEntity, (producer) => producer.id, { onDelete: 'CASCADE' })
  producer_id: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalArea: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  productiveArea: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  nonProductiveArea: number;
}
