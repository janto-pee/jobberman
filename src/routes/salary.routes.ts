import express from "express";
import {
  autocompleteSalaryHandler,
  CreateFGSalaryHandler,
  deleteSalaryHandler,
  FilterSalaryHandler,
  findAllSalaryHandler,
  findSalaryHandler,
  searchSalaryHandler,
  updateSalaryFKHandler,
  updateSalaryHandler,
} from "../controller/salary.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validate";
import { createSalarySchema } from "../schema/salary.schema";

const router = express.Router();
/**
 * QUERY ROUTES
 */
router.get("/api/salary", findAllSalaryHandler); //all salary
router.get("/api/salary/:id", findSalaryHandler); //Salary details
router.get("/api/salary/currency/autocomplete", autocompleteSalaryHandler); //autocomplete
router.get("/api/salary/filter/keyword", FilterSalaryHandler); // Filter Salary
router.get("/api/salary/search/keyword", searchSalaryHandler); //Search Salary
//all report

/**
 * INTERNAL MUTATION
 */

router.post(
  "/api/salary",
  validateResource(createSalarySchema),
  requireUser,
  CreateFGSalaryHandler
);
router.put("/api/salary/:id", requireUser, updateSalaryHandler);
router.put(
  "/api/salary/:salaryId/:fgsId/:tbsId",
  requireUser,
  updateSalaryFKHandler
);
router.delete("/api/salary/:id", requireUser, deleteSalaryHandler);

export default router;
