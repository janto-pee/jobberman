import express from "express";
import {
  CreateMetadataHandler,
  deleteMetadataHandler,
  findMetadataHandler,
  updateMetadataHandler,
} from "../controller/metadata.controller";

const router = express.Router();
router.get("/api/metadata/:id", findMetadataHandler);

/**
 * MUTATION ROUTES
 */
router.post("/api/metadata", CreateMetadataHandler);
router.put("/api/metadata/:id", updateMetadataHandler);
router.delete("/api/metadata/:id", deleteMetadataHandler);

export default router;
