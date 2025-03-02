import express from "express";
import UserRouter from "./user.routes";
import Sessionrouter from "./session.routes";

const router = express.Router();

router.get("/healthcheck", (_, res) => {
  res.sendStatus(200);
});

router.use(UserRouter);
router.use(Sessionrouter);

export default router;
