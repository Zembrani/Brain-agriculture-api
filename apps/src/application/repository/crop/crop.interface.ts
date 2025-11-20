import { CreateCropDTO, Crop } from "../../../domain/cropDomain";

export interface ICropRepository {
  getAll(): Promise<Crop[]>;
  create(data: CreateCropDTO): Promise<Crop>;
}
