import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FarmEntity } from "./farmEntity";

@Entity("crop")
export class CropEntity {
  @PrimaryGeneratedColumn("identity")
  id: string;

  @ManyToOne(() => FarmEntity, (farm) => farm.id, { onDelete: 'CASCADE' })
  farm_id: string;

  @Column({ type: "int" })
  year: number;

  @Column()
  crop: string;
}
