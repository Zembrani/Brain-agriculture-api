import { Crop } from "./cropDomain";

export class Dashboard {
  id: string;
  state: string;
  totalArea: number;
  productiveArea: number;
  nonProductiveArea: number;
  crops: Crop[] | null;
}

export class DashboardResponseDTO {
  totalArea: number;
  productiveArea: number;
  nonProductiveArea: number;
  areaByState: {
    state: string;
    totalArea: number;
    productiveArea: number;
    nonProductiveArea: number;
  }[];
  areaByCrop: {
    crop: string;
    totalArea: number;
    productiveArea: number;
    nonProductiveArea: number;
  }[];
}
