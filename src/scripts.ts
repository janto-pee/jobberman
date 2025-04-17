import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Default to production database URL
let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not defined in environment variables");
  process.exit(1);
}

/**
 * Sets the database connection string based on environment
 * @param isTestEnvironment - Whether to use test database
 * @returns The selected connection string
 */
export function connectionScript(
  isTestEnvironment: boolean
): string | undefined {
  if (isTestEnvironment) {
    const testConnectionString = process.env.DATABASE_URL_TEST;

    if (!testConnectionString) {
      console.warn(
        "DATABASE_URL_TEST is not defined, falling back to DATABASE_URL"
      );
      return connectionString;
    }

    return testConnectionString;
  }
  return connectionString;
}

// Create connection pool with configurable options
const pool = new Pool({
  connectionString,
  max: 20, // Maximum number of clients
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection not established
});

// Log connection events
pool.on("connect", () => console.log("Connected to PostgreSQL database"));
pool.on("error", (err) => console.error("PostgreSQL pool error:", err));

// Create Prisma adapter and client
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({
  adapter,
  log: ["error", "warn"],
});
