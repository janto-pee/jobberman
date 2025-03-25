import express from "express";

import validateResource from "../middleware/validate";
import {
  CreateJobHandler,
  deleteJobHandler,
  FilterJobHandler,
  findAllJobsHandler,
  findJobHandler,
  findJobsByLocationHandler,
  SearchJobHandler,
  updateJobFKHandler,
  updateJobHandler,
} from "../controller/Job.controller";
import requireUser from "../middleware/requireUser";
import { createJobSchema } from "../schema/job.schema";

const router = express.Router();
/**
 * QUERY ROUTES
 */
router.get("/api/jobs", findAllJobsHandler); // All Jobs
router.get("/api/jobs/:id", findJobHandler); //Job Detail
router.get("/api/search/jobs/filter", FilterJobHandler); //Filter jobs
router.get("/api/jobs/location/:location", findJobsByLocationHandler); //Location
router.get("/api/search/jobs/keyword", SearchJobHandler); //Search Job

/**
 * MUTATION ROUTES
 */

router.post(
  "/api/jobs",
  validateResource(createJobSchema),
  requireUser,
  CreateJobHandler,
);
router.put("/api/jobs/:id", requireUser, updateJobHandler);
router.put(
  "/api/jobs/:id/:salaryId/:metadataId/:hppId",
  requireUser,
  updateJobFKHandler,
);
router.delete("/api/jobs/:id", requireUser, deleteJobHandler);

export default router;
