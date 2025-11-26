import { IsDefined, IsNumber, IsString } from "class-validator";

export class Crop {
  id: string;
  farm_id: string;
  year: number;
  crop: string;
}

export class CreateCropDTO {
  @IsString()
  @IsDefined()
  farm_id;
  @IsNumber()
  @IsDefined()
  year;
  @IsString()
  @IsDefined()
  crop;
}
