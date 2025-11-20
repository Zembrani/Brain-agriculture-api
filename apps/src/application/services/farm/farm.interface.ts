import { CreateFarmDTO, Farm, UpdateFarmDTO } from "../../../domain/farmDomain";

export interface IFarmService {
  getAll(): Promise<Farm[]>;
  create(data: CreateFarmDTO): Promise<Farm>;
  update(id: string, data: UpdateFarmDTO): Promise<Farm>;
  delete(id: string): Promise<void>;
}
