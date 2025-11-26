import { Controller, Get, Inject } from '@nestjs/common';
import type { IDashboardService } from '../application/services/dashboard/dashboard.interface';

@Controller('dashboard')
export class DashboardController {
  constructor(@Inject("IDashboardService") private dashboardService: IDashboardService) {}

  @Get()
  async getDashboardData() {
    return await this.dashboardService.getDashboard();
  }
}
