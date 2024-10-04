import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Person } from "./entity/Person";

export const AppDataSourceProd = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "root",
  password: "secret",
  database: "recruitmentplatform",
  synchronize: true,
  logging: false,
  entities: [User, Person],
  migrations: [],
  subscribers: [],
});
