import express from "express";
import {
  CreateTBSHandler,
  deleteTBSHandler,
  findTBSHandler,
  updateTBSHandler,
} from "../controller/tbs.controller";

const router = express.Router();
router.get("/api/tbs/:id", findTBSHandler);

/**
 * MUTATION ROUTES
 */
router.post("/api/tbs", CreateTBSHandler);
router.put("/api/tbs/:id", updateTBSHandler);
router.delete("/api/tbs/:id", deleteTBSHandler);

export default router;
