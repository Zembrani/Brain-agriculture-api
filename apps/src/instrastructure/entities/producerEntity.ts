import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FarmEntity } from './farmEntity';

export enum PersonType {
  FISICA = 'FISICA',
  JURIDICA = 'JURIDICA',
}

@Entity('producer')
export class ProducerEntity {
  @PrimaryGeneratedColumn('identity')
  id: string;

  @Column()
  cpfCnpj: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({
    type: 'enum',
    enum: PersonType,
    default: PersonType.FISICA,
  })
  personType: string;
}
