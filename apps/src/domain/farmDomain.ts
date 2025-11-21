import { IsDefined, IsNumber, IsOptional, IsString, NotContains } from "class-validator";

export class Farm {
  id: string;
  producer_id: string;
  name: string;
  city: string;
  state: string;
  totalArea: number;
  productiveArea: number;
  nonProductiveArea: number;
}

export class FarmParamDTO {
  @IsString()
  @IsDefined()
  id: string;
}

export class CreateFarmDTO {
  @IsString()
  @IsDefined()
  producer_id;
  @IsString()
  @IsDefined()
  name;
  @IsString()
  @IsDefined()
  city;
  @IsString()
  @IsDefined()
  state;
  @IsNumber()
  @IsDefined()
  totalArea;
  @IsNumber()
  @IsDefined()
  productiveArea;
  @IsNumber()
  @IsDefined()
  nonProductiveArea;
}

export class UpdateFarmDTO {
  @IsString()
  @IsOptional()
  name;
  @IsNumber()
  @IsOptional()
  totalArea;
  @IsNumber()
  @IsOptional()
  productiveArea;
  @IsNumber()
  @IsOptional()
  nonProductiveArea;
}
