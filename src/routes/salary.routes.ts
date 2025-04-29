import express from "express";
import {
  CreateSalaryHandler,
  deleteSalaryHandler,
  FilterSalaryHandler,
  findAllSalarysHandler,
  findSalaryHandler,
  SearchSalaryHandler,
  updateSalaryHandler,
} from "../controller/salary.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validate";
import { createSalarySchema } from "../schema/salary.schema";

const router = express.Router();
/**
 * QUERY ROUTES
 */
router.get("/api/salary", findAllSalarysHandler); //all salary
router.get("/api/salary/:id", findSalaryHandler); //Salary details
router.get("/api/salary/filter/keyword", FilterSalaryHandler); // Filter Salary
router.get("/api/salary/search/keyword", SearchSalaryHandler); //Search Salary
//all report

/**
 * INTERNAL MUTATION
 */

router.post(
  "/api/salary",
  [validateResource(createSalarySchema), requireUser],
  CreateSalaryHandler
);
router.put("/api/salary/:id", requireUser, updateSalaryHandler);
router.delete("/api/salary/:id", requireUser, deleteSalaryHandler);

export default router;
