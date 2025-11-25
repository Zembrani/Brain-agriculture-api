import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IFarmService } from "./farm.interface";
import { Farm, CreateFarmDTO, UpdateFarmDTO } from "../../../domain/farmDomain";
import type { IFarmRepository } from "../../repository/farm/farm.interface";

@Injectable()
export class FarmService implements IFarmService {
  constructor(
    @Inject("IFarmRepository") private farmRepository: IFarmRepository,
  ) {}

  async getAll(): Promise<Farm[]> {
    return await this.farmRepository.getAll();
  }

  async getTotalAreaByProducerId(producerId: string): Promise<number> {
    const farms = await this.farmRepository.getFarmsByProducerId(producerId);

    if (!farms || farms.length === 0) {
      return 0;
    }

    return farms.reduce((sum, farm) => sum + Number(farm.totalArea), 0);
  }

  async create(data: CreateFarmDTO): Promise<Farm> {
    return await this.farmRepository.create(data);
  }

  async update(id: string, data: UpdateFarmDTO): Promise<Farm> {
    const farmExists = await this.farmRepository.getById(id);

    if (!farmExists) {
      throw new NotFoundException("Farm not found.");
    }

    const farmToUpdate = Object.assign(farmExists, data);
    const updatedFarm = await this.farmRepository.update(farmToUpdate);

    return updatedFarm;
  }

  async delete(id: string): Promise<void> {
    const farmExists = await this.farmRepository.getById(id);

    if (!farmExists) {
      throw new NotFoundException("Farm not found.");
    }

    await this.farmRepository.delete(id);
  }
}
