import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import type { IProducerService } from "../../application/services/producer/producer.interface";
import {
  CreateProducerDTO,
  ParamProducerDTO,
  Producer,
  UpdateProducerDTO,
} from "../../domain/producerDomain";

@Controller("producer")
export class ProducerController {
  constructor(
    @Inject("IProducerService") private producerService: IProducerService,
  ) {}

  @Get()
  async getAll(): Promise<Producer[]> {
    return await this.producerService.getAll();
  }

  @Get(":id/total-area")
  async getTotalArea(
    @Param() param: ParamProducerDTO,
  ): Promise<{ totalArea: number }> {
    const totalArea = await this.producerService.getTotalArea(param.id);
    return { totalArea };
  }

  @Post()
  async create(@Body() body: CreateProducerDTO): Promise<Producer> {
    return await this.producerService.create(body);
  }

  @Put(":id")
  async update(
    @Param() param: ParamProducerDTO,
    @Body() body: UpdateProducerDTO,
  ): Promise<Producer> {
    return await this.producerService.update(param.id, body);
  }

  @Delete(":id")
  async delete(
    @Param() param: ParamProducerDTO,
  ): Promise<{ message: string }> {
    await this.producerService.delete(param.id);

    return { message: `Producer id: ${param.id} deleted succesfully.` };
  }
}
