import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IFarmRepository } from "../../application/repository/farm/farm.interface";
import { FarmEntity } from "../entities/farmEntity";
import { CreateFarmDTO, Farm, UpdateFarmDTO } from "../../domain/farmDomain";

@Injectable()
export class FarmRepository implements IFarmRepository {
  constructor(
    @InjectRepository(FarmEntity)
    private readonly farmRepository: Repository<FarmEntity>,
  ) {}

  async getAll(): Promise<Farm[]> {
    return await this.farmRepository.find();
  }

  async getById(id: string): Promise<Farm | undefined> {
    const farm = await this.farmRepository.findOne({ where: { id } });

    return farm ? farm : undefined;
  }

  async create(data: CreateFarmDTO): Promise<Farm> {
    return await this.farmRepository.save(data);
  }

  async update(data: UpdateFarmDTO): Promise<Farm> {
    return await this.farmRepository.save(data);
  }

  async delete(id: string): Promise<void> {
    await this.farmRepository.delete(id);
  }

  async getFarmsByProducerId(producerId: string): Promise<Farm[]> {
    return await this.farmRepository.find({
      where: {
        producer_id: { id: producerId } as any,
      },
    });
  }
}
