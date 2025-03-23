import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

let connectionString = `${process.env.DATABASE_URL}`;

export function connectionScript(arg: boolean) {
  if (arg) {
    connectionString = `${process.env.DATABASE_URL_TEST}`;
  }
  return connectionString;
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });
