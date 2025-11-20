import { Module } from "@nestjs/common";
import { ProducerController } from "../presentation/producer/producer.controller";
import { ProducerService } from "../application/services/producer/producer.service";
import { ProducerRepository } from '../instrastructure/repositories/producerRespository';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProducerEntity } from "../instrastructure/entities/producerEntity";

@Module({
  controllers: [ProducerController],
  providers: [
    ProducerService,
    { provide: "IProducerService", useClass: ProducerService },
    ProducerRepository,
    { provide: "IProducerRepository", useClass: ProducerRepository },

  ],
  imports: [
    TypeOrmModule.forFeature([ProducerEntity])
  ],
})
export class ProducerModule {}
