import express from "express";
import {
  autocompleteSalaryHandler,
  CreateFGSalaryHandler,
  deleteSalaryHandler,
  FilterSalaryHandler,
  findAllSalaryHandler,
  findSalaryByLocationHandler,
  findSalaryHandler,
  searchSalaryHandler,
  updateSalaryFKHandler,
  updateSalaryHandler,
} from "../controller/salary.controller";

const router = express.Router();
/**
 * QUERY ROUTES
 */
router.get("/api/salary/:id", findSalaryHandler);
router.get("/api/salary", findAllSalaryHandler);
router.get("/api/salary/location/:location", findSalaryByLocationHandler);
router.get("/api/salary/filter", FilterSalaryHandler);
router.get("/api/salary/search", searchSalaryHandler);
router.get("/api/salary/location/:location", findSalaryByLocationHandler);
router.get("/api/salary/currency/autocomplete", autocompleteSalaryHandler);

/**
 * INTERNAL MUTATION
 */

router.post("/api/salary", CreateFGSalaryHandler);
router.put("/api/salary/:id", updateSalaryHandler);
router.put("/api/salary/:salaryId/:fgsId/:tbsId", updateSalaryFKHandler);
router.delete("/api/salary/:id", deleteSalaryHandler);

export default router;
