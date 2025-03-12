import express from "express";
import {
  deleteAddressHandler,
  findAddressHandler,
} from "../controller/address.controller";

const router = express.Router();
router.get("/api/address/:id", findAddressHandler);
// router.get("/api/company", findCompanyHandler);
// router.get("/api/company/location/:location", findCompanyByLocationHandler);
// router.get("/api/search/company/filter", FilterCompanyHandler);

/**
 * MUTATION ROUTES
 */
// router.post("/api/company", CreateCompanyHandler);
// router.put("/api/company/:id", updateCompanyHandler);
// router.put("/api/company/:companyId/:addressId", updateCompanyAddressHandler);
router.delete("/api/address/:id", deleteAddressHandler);

export default router;
