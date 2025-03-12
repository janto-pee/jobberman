import express from "express";
import {
  CreateAddressHandler,
  deleteAddressHandler,
  findAddressHandler,
  updateAddressHandler,
} from "../controller/address.controller";
import { findAllCompanysHandler } from "../controller/company.controller";

const router = express.Router();
router.get("/api/address/:id", findAddressHandler);
router.get("/api/address", findAllCompanysHandler);

/**
 * MUTATION ROUTES
 */
router.post("/api/address", CreateAddressHandler);
router.put("/api/address/:id", updateAddressHandler);
router.delete("/api/address/:id", deleteAddressHandler);

export default router;
