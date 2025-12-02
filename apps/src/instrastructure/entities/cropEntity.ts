import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("crop")
export class CropEntity {
  @PrimaryGeneratedColumn("identity")
  id: string;

  @Column({ name: "farm_id" })
  farm_id: string;

  @Column({ type: "int" })
  year: number;

  @Column({ name: "crops" })
  crop: string;
}
