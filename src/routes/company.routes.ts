import express from "express";
import {
  CreateCompanyHandler,
  deleteCompanyHandler,
  FilterCompanyHandler,
  findAllCompanysHandler,
  findCompanyByLocationHandler,
  findCompanyHandler,
  updateCompanyAddressHandler,
  updateCompanyHandler,
} from "../controller/company.controller";

const router = express.Router();

/**
 * QUERY ROUTES
 */
router.get("/api/company/:id", findCompanyHandler); // Company Details
router.get("/api/company", findAllCompanysHandler); // All Company
router.get("/api/company/location/:location", findCompanyByLocationHandler); //Company in Locations
router.get("/api/search/company/filter", FilterCompanyHandler); //Filter Company
//Search Company

/**
 * MUTATION ROUTES
 */
router.post("/api/company", CreateCompanyHandler);
router.put("/api/company/:id", updateCompanyHandler);
router.put("/api/company/:companyId/:addressId", updateCompanyAddressHandler);
router.delete("/api/company/:id", deleteCompanyHandler);

export default router;
