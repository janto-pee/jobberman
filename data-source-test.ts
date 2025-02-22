import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from 'config';
import { User } from './src/entity/User.entity';
import { Auth } from './src/entity/Auth.entity';
import { Address } from './src/entity/Address.entity';
import { serverSetup } from './src';

export const TestDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: config.get<number>('dbPort'),
  username: config.get<string>('dbUsername'),
  password: config.get<string>('dbPassword'),
  database: config.get<string>('testDatabase'),
  synchronize: true,
  logging: false,
  entities: [User, Auth, Address],
  migrations: ['src/migrations/*{.ts,.js}'],
  subscribers: [],
});

TestDataSource.initialize()
  .then()
  .catch((error) => console.log(error));
