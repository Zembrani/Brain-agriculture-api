import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import type { ICropService } from "../../application/services/crop/crop.interface";
import { CreateCropDTO, Crop } from "../../domain/cropDomain";

@Controller("crop")
export class CropController {
  constructor(@Inject("ICropService") private cropService: ICropService) {}

  @Get()
  async getAll(): Promise<Crop[]> {
    return await this.cropService.getAll();
  }

  @Post()
  async create(@Body() body: CreateCropDTO): Promise<Crop> {
    return await this.cropService.create(body);
  }
}
