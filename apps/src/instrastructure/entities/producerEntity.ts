import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum PersonType {
  FISICA = "FISICA",
  JURIDICA = "JURIDICA",
}

@Entity("producer")
export class ProducerEntity {
  @PrimaryGeneratedColumn("identity")
  id: string;

  @Column({ name: "cpfcnpj" })
  cpfCnpj: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({
    name: "persontype",
    type: "enum",
    enum: PersonType,
    default: PersonType.FISICA,
  })
  personType: string;
}
