import { IsDefined, IsOptional, IsString } from "class-validator";

export class Producer {
  id: string;
  cpfCnpj: string;
  name: string;
  phone: string;
}

export class ParamProducerDTO {
  @IsString()
  @IsDefined()
  id: string;
}

export class CreateProducerDTO {
  @IsString()
  @IsDefined()
  cpfCnpj;
  @IsString()
  @IsDefined()
  name;
  @IsString()
  @IsDefined()
  phone;
}

export class UpdateProducerDTO {
  @IsString()
  @IsOptional()
  cpfCnpj;
  @IsString()
  @IsOptional()
  name;
  @IsString()
  @IsOptional()
  phone;
}
