import { Inject, Injectable } from "@nestjs/common";
import { ICropService } from "./crop.interface";
import { Crop, CreateCropDTO } from "../../../domain/cropDomain";
import type { ICropRepository } from "../../repository/crop/crop.interface";

@Injectable()
export class CropService implements ICropService {
  constructor(
    @Inject("ICropRepository") private cropRepository: ICropRepository,
  ) {}

  async getAll(): Promise<Crop[]> {
    return await this.cropRepository.getAll();
  }

  async create(data: CreateCropDTO): Promise<Crop> {
    return await this.cropRepository.create(data);
  }
}
