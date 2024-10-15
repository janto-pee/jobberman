import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSourceProd = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "root",
  password: "secret",
  database: "recruitmentplatform",
  synchronize: true,
  logging: false,
  entities: [],
  migrations: [],
  subscribers: [],
});
