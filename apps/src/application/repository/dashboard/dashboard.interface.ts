import { Dashboard } from "../../../domain/dashboardDomain";

export interface IDashboardRepository {
  getDashboard(): Promise<Dashboard[]>;
}
