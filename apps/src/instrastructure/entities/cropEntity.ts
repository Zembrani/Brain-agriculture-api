import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { FarmEntity } from "./farmEntity";

@Entity("crop")
export class CropEntity {
  @PrimaryGeneratedColumn("identity")
  id: string;

  @ManyToOne(() => FarmEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "farm_id" })
  farm_id: FarmEntity;

  @Column({ type: "int" })
  year: number;

  @Column({ name: "crops" })
  crop: string;
}
