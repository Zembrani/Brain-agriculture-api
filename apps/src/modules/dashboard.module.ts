import { Module } from "@nestjs/common";
import { DashboardController } from "../dashboard/dashboard.controller";
import { DashboardService } from "../application/services/dashboard/dashboard.service";
import { DashboardRepository } from "../instrastructure/repositories/dashboardRepository";

@Module({
  controllers: [DashboardController],
  providers: [
    DashboardService,
    { provide: "IDashboardService", useClass: DashboardService },
    DashboardRepository,
    { provide: "IDashboardRepository", useClass: DashboardRepository },
  ],
  imports: [],
  exports: [{ provide: "IDashboardService", useClass: DashboardService }],
})
export class DashboardModule {}
