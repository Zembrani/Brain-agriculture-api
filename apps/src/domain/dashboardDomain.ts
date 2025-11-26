import { Crop } from './cropDomain';
import { Farm } from './farmDomain';

export class Dashboard extends Farm {
  crops: Crop[];
}
