import express from "express";
import {
  CreateMetadataHandler,
  deleteMetadataHandler,
  findAllMetadataHandler,
  findMetadataHandler,
  updateMetadataHandler,
} from "../controller/metaData.controller";

const router = express.Router();
router.get("/api/metadata/:id", findMetadataHandler);
router.get("/api/metadata", findAllMetadataHandler);

/**
 * MUTATION ROUTES
 */
router.post("/api/metadata", CreateMetadataHandler);
router.put("/api/metadata/:id", updateMetadataHandler);
router.delete("/api/metadata/:id", deleteMetadataHandler);

export default router;
