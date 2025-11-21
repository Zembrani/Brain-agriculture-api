import { IsDefined, IsEnum, IsOptional, IsString } from "class-validator";
import { IsCpfCnpj } from "../utils/validators/cpf-cnpj.validator";

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
  @IsCpfCnpj({ message: 'O documento precisa ser um CPF ou CNPJ válido' })
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
