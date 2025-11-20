import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("farm")
export class FarmEntity {
  @PrimaryGeneratedColumn("identity")
  id: string;

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
