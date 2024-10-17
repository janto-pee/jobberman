import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './src/entity/User.entity';
import { Auth } from './src/entity/Auth.entity';
import config from 'config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: config.get<number>('dbPort'),
  username: config.get<string>('dbUsername'),
  password: config.get<string>('dbPassword'),
  database: config.get<string>('database'),
  synchronize: true,
  logging: false,
  entities: [User, Auth],
  migrations: ['src/migrations/*{.ts,.js}'],
  subscribers: [],
});
