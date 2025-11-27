import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ProducerModule } from "./modules/producer.module";
import { FarmModule } from "./modules/farm.module";
import { CropModule } from "./modules/crop.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DashboardModule } from "./modules/dashboard.module";
import { LoggerModule } from 'nestjs-pino';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
      ignoreEnvFile: process.env.NODE_ENV === "test",
    }),
    ProducerModule,
    FarmModule,
    CropModule,
    DashboardModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isTestEnvironment = configService.get("NODE_ENV") === "test";

        return {
          type: "postgres",
          host: configService.get<string>("POSTGRES_HOST"),
          port: isTestEnvironment
            ? configService.get<number>("POSTGRES_PORT")
            : configService.get<number>("POSTGRES_PORT"),
          username: configService.get<string>("POSTGRES_USER"),
          password: configService.get<string>("POSTGRES_PASSWORD"),
          database: isTestEnvironment
            ? configService.get<string>("POSTGRES_DATABASE")
            : configService.get<string>("POSTGRES_DATABASE"),
          synchronize: false,
          autoLoadEntities: true,
        };
      },
    }),
    LoggerModule.forRoot(),
  ],
})
export class AppModule {}
