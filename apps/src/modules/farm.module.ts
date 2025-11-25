import { Module } from "@nestjs/common";
import { FarmController } from "../presentation/farm/farm.controller";
import { FarmService } from "../application/services/farm/farm.service";
import { FarmRepository } from "../instrastructure/repositories/farmRepository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FarmEntity } from "../instrastructure/entities/farmEntity";

@Module({
  controllers: [FarmController],
  providers: [
    FarmService,
    { provide: "IFarmService", useClass: FarmService },
    FarmRepository,
    { provide: "IFarmRepository", useClass: FarmRepository },
  ],
  imports: [TypeOrmModule.forFeature([FarmEntity])],
  exports: [{ provide: "IFarmService", useClass: FarmService }],
})
export class FarmModule {}
