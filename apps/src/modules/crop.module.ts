import { Module } from '@nestjs/common';
import { CropController } from '../presentation/crop/crop.controller';
import { CropService } from '../application/services/crop/crop.service';
import { CropRepository } from '../instrastructure/repositories/cropRepository';
import { CropEntity } from '../instrastructure/entities/cropEntity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [CropController],
  providers: [
    CropService,
    { provide: 'ICropService', useClass: CropService },
    CropRepository,
    { provide: 'ICropRepository', useClass: CropRepository },
  ],
  imports: [TypeOrmModule.forFeature([CropEntity])],
})
export class CropModule {}
