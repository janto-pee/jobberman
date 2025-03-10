import express from "express";
import UserRouter from "./user.routes";
import SessionRouter from "./session.routes";
import JobRouter from "./job.routes";
import SalaryRouter from "./salary.routes";

const router = express.Router();

router.get("/healthcheck", (_, res) => {
  res.sendStatus(200);
});

router.use(UserRouter);
router.use(SessionRouter);
router.use(JobRouter);
router.use(SalaryRouter);

export default router;
