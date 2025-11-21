import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProducerEntity } from "../entities/producerEntity";
import { IProducerRepository } from "apps/src/application/repository/producer/producer.interface";
import {
  CreateProducerDTO,
  Producer,
  UpdateProducerDTO,
} from "../../domain/producerDomain";

@Injectable()
export class ProducerRepository implements IProducerRepository {
  constructor(
    @InjectRepository(ProducerEntity)
    private readonly producerRepository: Repository<ProducerEntity>,
  ) {}

  async getAll(): Promise<Producer[]> {
    return await this.producerRepository.find() as Producer[];
  }

  async getById(id: string): Promise<Producer | undefined> {
    const producer = await this.producerRepository.findOne({ where: { id } });

    return producer ? producer as Producer : undefined;
  }

  async create(data: CreateProducerDTO): Promise<Producer> {
    return await this.producerRepository.save(data);
  }

  async update(data: UpdateProducerDTO): Promise<Producer> {
    return await this.producerRepository.save(data);
  }

  async delete(id: string): Promise<void> {
    await this.producerRepository.delete(id);
  }
}
