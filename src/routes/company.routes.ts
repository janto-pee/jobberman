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
router.get("/api/company/:id", findCompanyHandler);
router.get("/api/company", findAllCompanysHandler);
router.get("/api/company/location/:location", findCompanyByLocationHandler);
router.get("/api/search/company/filter", FilterCompanyHandler);

/**
 * MUTATION ROUTES
 */
router.post("/api/company", CreateCompanyHandler);
router.put("/api/company/:id", updateCompanyHandler);
router.put("/api/company/:companyId/:addressId", updateCompanyAddressHandler);
router.delete("/api/company/:id", deleteCompanyHandler);

export default router;
