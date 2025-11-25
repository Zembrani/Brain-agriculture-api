import { BadRequestException } from "@nestjs/common";
import { ValidationArea } from "./area.validation";

describe("ValidationArea", () => {
  let pipe: ValidationArea;

  beforeEach(() => {
    pipe = new ValidationArea();
  });

  it("should be defined", () => {
    expect(pipe).toBeDefined();
  });

  it("should pass when sum of areas equals total area", () => {
    const value = {
      totalArea: 1000,
      productiveArea: 700,
      nonProductiveArea: 300,
    };

    const result = pipe.transform(value, {} as any);

    expect(result).toEqual(value);
  });

  it("should pass when sum of areas is less than total area", () => {
    const value = {
      totalArea: 1000,
      productiveArea: 600,
      nonProductiveArea: 200,
    };

    const result = pipe.transform(value, {} as any);

    expect(result).toEqual(value);
  });

  it("should throw BadRequestException when sum of areas exceeds total area", () => {
    const value = {
      totalArea: 1000,
      productiveArea: 700,
      nonProductiveArea: 400,
    };

    expect(() => pipe.transform(value, {} as any)).toThrow(BadRequestException);
    expect(() => pipe.transform(value, {} as any)).toThrow(
      "A soma da área produtiva e não produtiva não pode ser maior que a área total.",
    );
  });

  it("should pass when totalArea is undefined", () => {
    const value = {
      productiveArea: 700,
      nonProductiveArea: 300,
    };

    const result = pipe.transform(value, {} as any);

    expect(result).toEqual(value);
  });

  it("should handle missing productiveArea as 0", () => {
    const value = {
      totalArea: 1000,
      nonProductiveArea: 300,
    };

    const result = pipe.transform(value, {} as any);

    expect(result).toEqual(value);
  });

  it("should handle missing nonProductiveArea as 0", () => {
    const value = {
      totalArea: 1000,
      productiveArea: 700,
    };

    const result = pipe.transform(value, {} as any);

    expect(result).toEqual(value);
  });
});
