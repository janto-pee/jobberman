import express from "express";
import UserRouter from "./user.routes";
import SessionRouter from "./session.routes";
import JobRouter from "./job.routes";
import SalaryRouter from "./salary.routes";
import CompanyRouter from "./company.routes";
import AddressRouter from "./address.routes";
import FGSRouter from "./fgs.routes";
import HPPRouter from "./hpp.routes";
import MetadataRouter from "./metadata.routes";
import TBSRouter from "./tbs.routes";

const router = express.Router();

router.get("/healthcheck", (_, res) => {
  res.sendStatus(200);
});
/**
 * TOP QUERY
 */
router.use(JobRouter);
router.use(SalaryRouter);
router.use(CompanyRouter);

/**
 * INTERNAL
 */
router.use(UserRouter);
router.use(SessionRouter);
router.use(AddressRouter);
router.use(FGSRouter);
router.use(HPPRouter);
router.use(MetadataRouter);
router.use(TBSRouter);

export default router;
