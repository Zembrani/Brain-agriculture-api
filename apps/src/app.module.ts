import { Module } from "@nestjs/common";
import { ProducerModule } from "./modules/producer.module";
import { FarmModule } from "./modules/farm.module";
import { CropModule } from "./modules/crop.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DashboardModule } from "./modules/dashboard.module";

@Module({
  controllers: [],
  providers: [],
  imports: [
    ProducerModule,
    FarmModule,
    CropModule,
    DashboardModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "pguser",
      password: "secret123",
      database: process.env.POSTGRES_DATABASE || "agriculture",
      synchronize: false,
      autoLoadEntities: true,
    }),
  ],
})
export class AppModule {}
