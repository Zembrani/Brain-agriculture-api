import { Injectable } from "@nestjs/common";
import { IDashboardRepository } from "../../application/repository/dashboard/dashboard.interface";
import { Dashboard } from "../../domain/dashboardDomain";
import { DataSource } from "typeorm";

@Injectable()
export class DashboardRepository implements IDashboardRepository {
  constructor(private readonly dashboardRepository: DataSource) {}

  async getDashboard(): Promise<Dashboard[]> {
    const result = await this.dashboardRepository.query<Dashboard[]>(`
      SELECT
        f.id,
        f.state,
        f.totalarea as "totalArea",
        f.productivearea as "productiveArea",
        f.nonproductivearea as "nonProductiveArea",
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

    return result.map((farm) => ({
      id: farm.id,
      state: farm.state,
      totalArea: Number(farm.totalArea),
      productiveArea: Number(farm.productiveArea),
      nonProductiveArea: Number(farm.nonProductiveArea),
      crops: farm.crops.map((crop) => ({
        id: crop.id,
        farm_id: farm.id,
        year: Number(crop.year),
        crop: crop.crop,
      })),
    }));
  }
}
