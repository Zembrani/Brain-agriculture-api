import { CreateCropDTO, Crop } from "../../../domain/cropDomain";

export interface ICropService {
  getAll(): Promise<Crop[]>;
  create(data: CreateCropDTO): Promise<Crop>;
}
