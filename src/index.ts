import express from "express";
import config from "config";
import cors from "cors";
import helmet from "helmet";
import { prisma } from "./scripts";
import router from "./routes";
import deserializeUser from "./middleware/deserializeUser";
import { logger } from "./utils/logger";
import { requestLogger } from "./middleware/requestLogger";

async function main() {
  const app = express();

  // Security and middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logging middleware
  app.use(requestLogger);

  // Authentication middleware
  app.use(deserializeUser);

  // Routes
  app.use(router);

  const port = config.get<number>("port");

  app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
  });
}

// Error handling for the main function
main()
  .then(async () => {
    logger.info("Server started successfully");
  })
  .catch(async (error) => {
    logger.error(`Failed to start server: ${error}`);
    await prisma.$disconnect();
    process.exit(1);
  });

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully");
  await prisma.$disconnect();
  process.exit(0);
});
