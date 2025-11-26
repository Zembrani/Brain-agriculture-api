import { Crop } from './cropDomain';
import { Farm } from './farmDomain';

export class Dashboard extends Farm {
  crops: Crop[];
}

export class DashboardResponseDTO {
      totalArea: number
      productiveArea: number
      nonProductiveArea: number
      areaByState: { state: string; totalArea: number; productiveArea: number; nonProductiveArea: number }[]
      areaByCrop: { crop: string; totalArea: number; productiveArea: number; nonProductiveArea: number }[]
}