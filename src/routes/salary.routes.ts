import express from "express";
import {
  autocompleteSalaryHandler,
  FilterSalaryHandler,
  findAllSalaryHandler,
  findSalaryByLocationHandler,
  findSalaryHandler,
  searchSalaryHandler,
} from "../controller/salary.controller";

const router = express.Router();
router.get("/api/salary/:id", findSalaryHandler);
router.get("/api/salary", findAllSalaryHandler);
router.get("/api/salary/location/:location", findSalaryByLocationHandler);
router.get("/api/company/filter", FilterSalaryHandler);
router.get("/api/salary/search", searchSalaryHandler);
router.get("/api/salary/location/:location", findSalaryByLocationHandler);
router.get("/api/salary/currency/autocomplete", autocompleteSalaryHandler);

export default router;
