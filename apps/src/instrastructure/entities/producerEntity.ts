import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("producer")
export class ProducerEntity {
  @PrimaryGeneratedColumn("identity")
  id: string;

  @Column()
  cpfCnpj: string;

  @Column()
  name: string;

  @Column()
  phone: string;
}
