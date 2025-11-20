import { CreateFarmDTO, Farm, UpdateFarmDTO } from "../../../domain/farmDomain";

export interface IFarmRepository {
  getAll(): Promise<Farm[]>;
  getById(id: string): Promise<Farm | undefined>;
  create(data: CreateFarmDTO): Promise<Farm>;
  update(data: UpdateFarmDTO): Promise<Farm>;
  delete(id: string): Promise<void>;
}
