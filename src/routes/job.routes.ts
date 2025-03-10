import express from "express";

import validateResource from "../middleware/validate";
import {
  findAllJobsHandler,
  findJobHandler,
  findJobsByLocationHandler,
} from "../controller/job.controller";

const router = express.Router();
router.get("/api/jobs/:id", findJobHandler);
router.get("/api/jobs", findAllJobsHandler);
router.get("/api/jobs/location/:location", findJobsByLocationHandler);

export default router;
