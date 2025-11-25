import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ProducerEntity } from "./producerEntity";

@Entity("farm")
export class FarmEntity {
  @PrimaryGeneratedColumn("identity")
  id: string;

  @ManyToOne(() => ProducerEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "producer_id" })
  producer_id: ProducerEntity;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column({ name: "totalarea", type: "decimal", precision: 10, scale: 2 })
  totalArea: number;

  @Column({ name: "productivearea", type: "decimal", precision: 10, scale: 2 })
  productiveArea: number;

  @Column({
    name: "nonproductivearea",
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  nonProductiveArea: number;
}
