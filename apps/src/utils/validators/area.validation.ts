
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidationArea implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { totalArea, productiveArea, nonProductiveArea } = value;

    const sumAreas = (productiveArea || 0) + (nonProductiveArea || 0);

    if (totalArea !== undefined && sumAreas > totalArea) {
      throw new BadRequestException(
        'A soma da área produtiva e não produtiva não pode ser maior que a área total.',
      );
    }

    return value;
  }
}
