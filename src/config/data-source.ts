import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Producer } from '../entities/Producer';
import { ProducerFarm } from '../entities/ProducerFarm';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'brain_agriculture',
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [Producer, ProducerFarm],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
});
