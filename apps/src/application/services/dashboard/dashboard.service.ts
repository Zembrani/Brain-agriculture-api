import { Inject, Injectable } from '@nestjs/common';
import { IDashboardService } from './dashboard.interface';
import { Dashboard } from '../../../domain/dashboardDomain';
import type { IDashboardRepository } from '../../repository/dashboard/dashboard.interface';

@Injectable()
export class DashboardService implements IDashboardService {
  constructor(
    @Inject('IDashboardRepository') private dashboardRepository: IDashboardRepository,
  ) {}

  async getDashboard(): Promise<any> {
    const dashboardData = await this.dashboardRepository.getDashboard();
    let totalArea = 0;
    let productiveArea = 0;
    let nonProductiveArea = 0;
    const areaByState = new Map<string, { totalArea: number; productiveArea: number; nonProductiveArea: number }>();
    const areaByCrop = new Map<string, { totalArea: number; productiveArea: number; nonProductiveArea: number }>();

    dashboardData.forEach((farm) => {
      totalArea += farm.totalArea;
      productiveArea += farm.productiveArea;
      nonProductiveArea += farm.nonProductiveArea;

      areaByState.set(farm.state, {
        totalArea: (areaByState.get(farm.state)?.totalArea || 0) + farm.totalArea,
        productiveArea: (areaByState.get(farm.state)?.productiveArea || 0) + farm.productiveArea,
        nonProductiveArea: (areaByState.get(farm.state)?.nonProductiveArea || 0) + farm.nonProductiveArea,
      });

      areaByCrop.set(farm.crops.map(crop => crop.crop).join(', '), {
        totalArea: (areaByCrop.get(farm.crops.map(crop => crop.crop).join(', '))?.totalArea || 0) + farm.totalArea,
        productiveArea: (areaByCrop.get(farm.crops.map(crop => crop.crop).join(', '))?.productiveArea || 0) + farm.productiveArea,
        nonProductiveArea: (areaByCrop.get(farm.crops.map(crop => crop.crop).join(', '))?.nonProductiveArea || 0) + farm.nonProductiveArea,
      });
    });

    const dashboardReturnData = {
      totalArea,
      productiveArea,
      nonProductiveArea,
      areaByState: Array.from(areaByState, ([state, areas]) => ({ state, ...areas })),
      areaByCrop: Array.from(areaByCrop, ([crop, areas]) => ({ crop, ...areas })),
    }

    return dashboardReturnData;
  }
}
