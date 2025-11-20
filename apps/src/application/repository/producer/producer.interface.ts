import {
  CreateProducerDTO,
  Producer,
  UpdateProducerDTO,
} from "../../../domain/producerDomain";

export interface IProducerRepository {
  getAll(): Promise<Producer[]>;
  getById(id: string): Promise<Producer | undefined>;
  create(data: CreateProducerDTO): Promise<Producer>;
  update(data: UpdateProducerDTO): Promise<Producer>;
  delete(id: string): Promise<void>;
}
