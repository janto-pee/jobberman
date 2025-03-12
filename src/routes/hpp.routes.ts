import express from "express";
import {
  CreateHPPHandler,
  deleteHPPHandler,
  findHPPHandler,
  updateHPPHandler,
} from "../controller/hpp.controller";

const router = express.Router();
router.get("/api/hpp/:id", findHPPHandler);

/**
 * MUTATION ROUTES
 */
router.post("/api/hpp", CreateHPPHandler);
router.put("/api/hpp/:id", updateHPPHandler);
router.delete("/api/hpp/:id", deleteHPPHandler);

export default router;
