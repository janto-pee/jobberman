import express from "express";
import config from "config";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { prisma } from "./scripts";
import deserializeUser from "./middleware/deserializeUser";

async function main() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(deserializeUser);

  const port = config.get<number>("port");

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

// Error handling for the main function
main()
  .then(async () => {
    console.log("Server started successfully");
  })
  .catch(async (error) => {
    console.error("Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  });

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  await prisma.$disconnect();
  process.exit(0);
});
