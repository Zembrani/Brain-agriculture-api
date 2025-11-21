import { CpfCnpjConstraint } from './cpf-cnpj.validator';
import { ValidationArguments } from 'class-validator';

describe('CpfCnpjConstraint', () => {
  let constraint: CpfCnpjConstraint;

  beforeEach(() => {
    constraint = new CpfCnpjConstraint();
  });

  it('should be defined', () => {
    expect(constraint).toBeDefined();
  });

  describe('validate', () => {
    it('should return true for valid CPF', () => {
      const validCpf = '470.332.457-18';
      const result = constraint.validate(validCpf, {} as ValidationArguments);

      expect(result).toBe(true);
    });

    it('should return true for valid CPF without formatting', () => {
      const validCpf = '47033245718';
      const result = constraint.validate(validCpf, {} as ValidationArguments);

      expect(result).toBe(true);
    });

    it('should return true for valid CNPJ', () => {
      const validCnpj = '66.995.915/0001-92';
      const result = constraint.validate(validCnpj, {} as ValidationArguments);

      expect(result).toBe(true);
    });

    it('should return true for valid CNPJ without formatting', () => {
      const validCnpj = '66995915000192';
      const result = constraint.validate(validCnpj, {} as ValidationArguments);

      expect(result).toBe(true);
    });

    it('should return false for invalid CPF', () => {
      const invalidCpf = '123.456.789-00';
      const result = constraint.validate(invalidCpf, {} as ValidationArguments);

      expect(result).toBe(false);
    });

    it('should return false for invalid CNPJ', () => {
      const invalidCnpj = '11.222.333/0001-00';
      const result = constraint.validate(invalidCnpj, {} as ValidationArguments);

      expect(result).toBe(false);
    });

    it('should return false for non-string value', () => {
      const result = constraint.validate(12345678909, {} as ValidationArguments);

      expect(result).toBe(false);
    });

    it('should return false for null value', () => {
      const result = constraint.validate(null, {} as ValidationArguments);

      expect(result).toBe(false);
    });

    it('should return false for undefined value', () => {
      const result = constraint.validate(undefined, {} as ValidationArguments);

      expect(result).toBe(false);
    });

    it('should return false for empty string', () => {
      const result = constraint.validate('', {} as ValidationArguments);

      expect(result).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return the default error message', () => {
      const message = constraint.defaultMessage({} as ValidationArguments);

      expect(message).toBe('O CPF ou CNPJ informado é inválido');
    });
  });
});
