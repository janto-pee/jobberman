import express from "express";
import {
  CreateCompanyHandler,
  deleteCompanyHandler,
  FilterCompanyHandler,
  findAllCompanysHandler,
  findCompanyByLocationHandler,
  findCompanyHandler,
  SearchCompanyHandler,
  updateCompanyAddressHandler,
  updateCompanyHandler,
} from "../controller/company.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validate";
import { createCompanySchema } from "../schema/company.schema";

const router = express.Router();

/**
 * QUERY ROUTES
 */
router.get("/api/company", findAllCompanysHandler); // All Company
router.get("/api/company/:id", findCompanyHandler); // Company Details
router.get("/api/company/location/:location", findCompanyByLocationHandler); //Company in city
router.get("/api/search/company/filter", FilterCompanyHandler); //Filter Company
router.get("/api/search/company/keyword", SearchCompanyHandler); //Search Company

/**
 * MUTATION ROUTES
 */
router.post(
  "/api/company",
  validateResource(createCompanySchema),
  CreateCompanyHandler,
);
router.put("/api/company/:id", requireUser, updateCompanyHandler);
router.put(
  "/api/company/:companyId/:addressId",
  requireUser,
  updateCompanyAddressHandler,
);
router.delete("/api/company/:id", requireUser, deleteCompanyHandler);

export default router;
