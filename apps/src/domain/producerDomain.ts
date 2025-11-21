import { IsDefined, IsEnum, IsOptional, IsString } from "class-validator";

export class Producer {
  id: string;
  cpfCnpj: string;
  name: string;
  phone: string;
  personType: "FISICA" | "JURIDICA";
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
  @IsEnum(["FISICA", "JURIDICA"])
  @IsDefined()
  personType;
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
  @IsEnum(["FISICA", "JURIDICA"])
  @IsDefined()
  personType;
}
