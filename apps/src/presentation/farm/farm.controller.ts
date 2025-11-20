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
import type { IFarmService } from "../../application/services/farm/farm.interface";
import {
  CreateFarmDTO,
  Farm,
  FarmParamDTO,
  UpdateFarmDTO,
} from "../../domain/farmDomain";

@Controller("farm")
export class FarmController {
  constructor(@Inject("IFarmService") private farmService: IFarmService) {}

  @Get()
  async getAll(): Promise<Farm[]> {
    return await this.farmService.getAll();
  }

  @Post()
  async create(@Body() body: CreateFarmDTO): Promise<Farm> {
    return await this.farmService.create(body);
  }

  @Put(":id")
  async update(
    @Param() param: FarmParamDTO,
    @Body() body: UpdateFarmDTO,
  ): Promise<Farm> {
    return await this.farmService.update(param.id, body);
  }

  @Delete(":id")
  async delete(@Param() param: FarmParamDTO): Promise<string> {
    await this.farmService.delete(param.id);

    return `Farm id: ${param.id} deleted succesfully.`;
  }
}
