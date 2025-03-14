import express from "express";
import {
  CreateSessionHandler,
  deleteSessionHandler,
  findSessionHandler,
} from "../controller/session.controller";

import validateResource from "../middleware/validate";
import { createSessionSchema } from "../schema/session.schema";
import requireUser from "../middleware/requireUser";

const router = express.Router();

router.post(
  "/api/auth",
  validateResource(createSessionSchema),
  CreateSessionHandler,
);
router.get("/api/auth", requireUser, findSessionHandler);
router.put("/api/auth", requireUser, deleteSessionHandler);

export default router;
