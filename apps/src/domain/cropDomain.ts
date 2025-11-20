import { IsDefined, IsNumber, IsOptional, IsString } from "class-validator";

export class Crop {
  id: string;
  year: number;
  crop: string;
}

export class CreateCropDTO {
  @IsNumber()
  @IsDefined()
  year;
  @IsString()
  @IsDefined()
  crop;
}
