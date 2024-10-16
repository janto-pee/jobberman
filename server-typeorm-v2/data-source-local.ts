import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './src/entity/User';
import { Auth } from './src/entity/Auth';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'root',
  password: 'secret',
  database: 'recruitmentplatform',
  synchronize: true,
  logging: false,
  entities: [User, Auth],
  migrations: ['src/migrations/*{.ts,.js}'],
  subscribers: [],
});
