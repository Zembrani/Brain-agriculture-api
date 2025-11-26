import { Injectable } from '@nestjs/common';
import { IDashboardRepository } from '../../application/repository/dashboard/dashboard.interface';
import { Dashboard } from '../../domain/dashboardDomain';
import { DataSource } from 'typeorm';

@Injectable()
export class DashboardRepository implements IDashboardRepository {
  constructor(
    private readonly dashboardRepository: DataSource
  ) {}

  async getDashboard(): Promise<Dashboard[]> {
    const result = await this.dashboardRepository.query(`
      SELECT
        f.id,
        f.state,
        f.totalarea,
        f.productivearea,
        f.nonproductivearea,
        COALESCE(json_agg(
          json_build_object(
            'id', c.id,
            'year', c.year,
            'crop', c.crops
          )
        ) FILTER (WHERE c.id IS NOT NULL), '[]') as crops
      FROM farm f
      LEFT JOIN crop c ON f.id = c.farm_id
      GROUP BY f.id
      ORDER BY f.id
    `);

    return result.map((row) => ({
      id: row.id,
      state: row.state,
      totalArea: parseFloat(row.totalarea),
      productiveArea: parseFloat(row.productivearea),
      nonProductiveArea: parseFloat(row.nonproductivearea),
      crops: row.crops,
    }));
  }
}
