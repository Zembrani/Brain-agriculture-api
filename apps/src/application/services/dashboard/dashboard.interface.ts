import { Dashboard } from "../../../domain/dashboardDomain";

export interface IDashboardService {
  getDashboard(): Promise<Dashboard[]>;
}
