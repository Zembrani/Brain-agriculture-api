import { Injectable } from "@nestjs/common";
import type { ICropRepository } from "../../application/repository/crop/crop.interface";
import { Crop, CreateCropDTO } from "../../domain/cropDomain";
import { InjectRepository } from "@nestjs/typeorm";
import { CropEntity } from "../entities/cropEntity";
import { Repository } from "typeorm";

@Injectable()
export class CropRepository implements ICropRepository {
  constructor(
    @InjectRepository(CropEntity)
    private readonly cropRepository: Repository<CropEntity>,
  ) {}

  async getAll(): Promise<Crop[]> {
    const crops = await this.cropRepository.find();

    return crops.map((crop) => ({
      id: crop.id,
      farm_id: crop.farm_id as string,
      year: crop.year,
      crop: crop.crop,
    }));
  }

  async create(data: CreateCropDTO): Promise<Crop> {
    return await this.cropRepository.save(data);
  }
}
