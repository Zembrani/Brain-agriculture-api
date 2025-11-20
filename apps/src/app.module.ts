import { Module } from "@nestjs/common";
import { ProducerModule } from "./modules/producer.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { FarmModule } from "./modules/farm.module";
import { CropModule } from "./modules/crop.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProducerEntity } from "./instrastructure/entities/producerEntity";
import { FarmEntity } from "./instrastructure/entities/farmEntity";
import { CropEntity } from "./instrastructure/entities/cropEntity";

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ProducerModule,
    FarmModule,
    CropModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "pguser",
      password: "secret123",
      database: process.env.POSTGRES_DATABASE || "agriculture",
      synchronize: true,
      autoLoadEntities: true,
    }),
  ],
})
export class AppModule {}
