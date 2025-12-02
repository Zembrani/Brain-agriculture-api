import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("farm")
export class FarmEntity {
  @PrimaryGeneratedColumn("identity")
  id: string;

  @Column({ name: "producer_id" })
  producer_id: string;

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
