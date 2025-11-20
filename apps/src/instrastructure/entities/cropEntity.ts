import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("crop")
export class CropEntity {
  @PrimaryGeneratedColumn("identity")
  id: string;

  @Column({ type: "int" })
  year: number;

  @Column()
  crop: string;
}
