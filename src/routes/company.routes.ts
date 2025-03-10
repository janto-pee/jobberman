import express from "express";
import {
  FilterCompanyHandler,
  findAllCompanysHandler,
  findCompanyByLocationHandler,
  findCompanyHandler,
} from "../controller/company.controller";
import { FilterSalaryHandler } from "../controller/salary.controller";

const router = express.Router();
router.get("/api/company/:id", findCompanyHandler);
router.get("/api/company", findAllCompanysHandler);
router.get("/api/company/filter", FilterCompanyHandler);
router.get("/api/company/location/:location", findCompanyByLocationHandler);

export default router;
