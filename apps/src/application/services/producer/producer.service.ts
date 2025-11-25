import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IProducerService } from "./producer.interface";
import {
  Producer,
  CreateProducerDTO,
  UpdateProducerDTO,
} from "../../../domain/producerDomain";
import type { IProducerRepository } from "../../repository/producer/producer.interface";
import type { IFarmService } from "../farm/farm.interface";

@Injectable()
export class ProducerService implements IProducerService {
  constructor(
    @Inject("IProducerRepository")
    private producerRepository: IProducerRepository,
    @Inject("IFarmService")
    private farmService: IFarmService,
  ) {}

  async getAll(): Promise<Producer[]> {
    return await this.producerRepository.getAll();
  }

  async getTotalArea(id: string): Promise<number> {
    const producerExists = await this.producerRepository.getById(id);

    if (!producerExists) {
      throw new NotFoundException("Producer not found.");
    }

    return await this.farmService.getTotalAreaByProducerId(id);
  }

  async create(data: CreateProducerDTO): Promise<Producer> {
    const createdProducer = await this.producerRepository.create(data);

    return createdProducer;
  }

  async update(id: string, data: UpdateProducerDTO): Promise<Producer> {
    const producerExists = await this.producerRepository.getById(id);

    if (!producerExists) {
      throw new NotFoundException("Producer not found.");
    }

    const producerToUpdate = Object.assign(producerExists, data);
    const updatedProducer =
      await this.producerRepository.update(producerToUpdate);

    return updatedProducer;
  }

  async delete(id: string): Promise<void> {
    const producerExists = await this.producerRepository.getById(id);

    if (!producerExists) {
      throw new NotFoundException("Producer not found.");
    }

    await this.producerRepository.delete(id);
  }
}
