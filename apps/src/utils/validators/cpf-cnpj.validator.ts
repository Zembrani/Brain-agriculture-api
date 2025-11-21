import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { cpf, cnpj } from 'cpf-cnpj-validator';

@ValidatorConstraint({ async: false })
export class CpfCnpjConstraint implements ValidatorConstraintInterface {
  validate(documentValue: any, args: ValidationArguments) {
    if (typeof documentValue !== 'string') {
      return false;
    }

    const cleanedValue = documentValue.replace(/\D/g, '');

    return cpf.isValid(cleanedValue) || cnpj.isValid(cleanedValue);
  }

  defaultMessage(args: ValidationArguments) {
    return 'O CPF ou CNPJ informado é inválido';
  }
}

export function IsCpfCnpj(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: CpfCnpjConstraint,
    });
  };
}
