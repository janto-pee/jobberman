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
router.get("/api/salary/currency/autocomplete", autocompleteSalaryHandler); //autocomplete
router.get("/api/salary/location/:location", findSalaryByLocationHandler); //Salary by Location
router.get("/api/salary/filter", FilterSalaryHandler); // Filter Salary
router.get("/api/salary/search", searchSalaryHandler); //Search Salary
router.get("/api/salary/:id", findSalaryHandler); //Salary details
router.get("/api/salary", findAllSalaryHandler); //all report

/**
 * INTERNAL MUTATION
 */

router.post("/api/salary", CreateFGSalaryHandler);
router.put("/api/salary/:id", updateSalaryHandler);
router.put("/api/salary/:salaryId/:fgsId/:tbsId", updateSalaryFKHandler);
router.delete("/api/salary/:id", deleteSalaryHandler);

export default router;
