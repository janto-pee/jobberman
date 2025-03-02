import express from "express";
import config from "config";
import { prisma } from "./scripts";
import router from "./routes";
import deserializeUser from "./middleware/deserializeUser";

async function main() {
  const app = express();

  app.use(express.json());
  app.use(deserializeUser);
  app.use(router);

  const port = config.get<number>("port");

  app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
