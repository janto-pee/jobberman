import express from "express";
import {
  CreateFGSHandler,
  deleteFGSHandler,
  findFGSHandler,
  updateFGSHandler,
} from "../controller/fgs.controller";

const router = express.Router();
router.get("/api/fgs/:id", findFGSHandler);

/**
 * MUTATION ROUTES
 */
router.post("/api/fgs", CreateFGSHandler);
router.put("/api/fgs/:id", updateFGSHandler);
router.delete("/api/fgs/:id", deleteFGSHandler);

export default router;
