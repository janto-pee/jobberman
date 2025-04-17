import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { logger } from "./utils/logger";
import { Histogram } from "prom-client";

// Load environment variables
dotenv.config();

// Create Prometheus metrics for database operations
const dbQueryDurationHistogram = new Histogram({
  name: "jobberman_db_query_duration_seconds",
  help: "Duration of database queries in seconds",
  labelNames: ["model", "operation"],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2],
});

const dbQueryTotalCounter = new Histogram({
  name: "jobberman_db_query_total",
  help: "Total number of database queries",
  labelNames: ["model", "operation", "success"],
});

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
export function connectionScript(isTestEnvironment: boolean) {
  if (isTestEnvironment) {
    const testConnectionString = process.env.DATABASE_URL_TEST;

    if (!testConnectionString) {
      logger.warn(
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
pool.on("connect", () => logger.info("Connected to PostgreSQL database"));
pool.on("error", (err) => logger.error(`PostgreSQL pool error: ${err}`));

// Create Prisma adapter and client
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({
  // adapter,
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "event",
      level: "info",
    },
    {
      emit: "event",
      level: "warn",
    },
  ],
});

// Track database query metrics
prisma.$on("query", (e) => {
  const startTime = process.hrtime();

  // Extract model and operation from the query
  const queryParts = e.query.split(" ");
  const operation = queryParts[0].toLowerCase(); // SELECT, INSERT, UPDATE, DELETE

  // Try to extract the model name from the query
  let model = "unknown";
  if (e.query.includes("FROM")) {
    const fromIndex = e.query.indexOf("FROM");
    const nextSpace = e.query.indexOf(" ", fromIndex + 5);
    if (nextSpace > -1) {
      model = e.query.substring(fromIndex + 5, nextSpace).replace(/["`]/g, "");
    } else {
      model = e.query.substring(fromIndex + 5).replace(/["`]/g, "");
    }
  } else if (e.query.includes("INTO")) {
    const intoIndex = e.query.indexOf("INTO");
    const nextSpace = e.query.indexOf(" ", intoIndex + 5);
    if (nextSpace > -1) {
      model = e.query.substring(intoIndex + 5, nextSpace).replace(/["`]/g, "");
    }
  } else if (e.query.includes("UPDATE")) {
    const updateIndex = e.query.indexOf("UPDATE");
    const nextSpace = e.query.indexOf(" ", updateIndex + 7);
    if (nextSpace > -1) {
      model = e.query
        .substring(updateIndex + 7, nextSpace)
        .replace(/["`]/g, "");
    }
  }

  // When the query completes
  e.query.endsWith(";") &&
    process.nextTick(() => {
      const [seconds, nanoseconds] = process.hrtime(startTime);
      const duration = seconds + nanoseconds / 1e9;

      // Record metrics
      dbQueryDurationHistogram.labels(model, operation).observe(duration);
      dbQueryTotalCounter.labels(model, operation, "true"); //.inc();

      // Log slow queries (over 100ms)
      if (duration > 0.1) {
        logger.warn(`Slow query (${duration.toFixed(3)}s): ${e.query}`);
      }
    });
});

// Track database errors
prisma.$on("error", (e) => {
  logger.error(`Prisma error: ${e.message}`);

  // Extract model and operation for the error metric
  const queryParts = e.target?.split(" ") || ["unknown"];
  const operation = queryParts[0].toLowerCase();
  const model = "unknown"; // It's harder to reliably extract the model from error

  // Record error metric
  dbQueryTotalCounter.labels(model, operation, "false"); //.inc();
});

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, closing database connections");
  await prisma.$disconnect();
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received, closing database connections");
  await prisma.$disconnect();
});
