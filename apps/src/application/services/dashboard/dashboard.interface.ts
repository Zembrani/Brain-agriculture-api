import { DashboardResponseDTO } from "../../../domain/dashboardDomain";

export interface IDashboardService {
  getDashboard(): Promise<DashboardResponseDTO>;
}
