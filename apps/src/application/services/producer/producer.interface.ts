import {
  CreateProducerDTO,
  Producer,
  UpdateProducerDTO,
} from "../../../domain/producerDomain";

export interface IProducerService {
  getAll(): Promise<Producer[]>;
  getTotalArea(id: string): Promise<number>;
  create(data: CreateProducerDTO): Promise<Producer>;
  update(id: string, data: UpdateProducerDTO): Promise<Producer>;
  delete(id: string): Promise<void>;
}
