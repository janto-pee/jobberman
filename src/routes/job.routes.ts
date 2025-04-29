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
  // updateJobFKHandler,
  updateJobHandler,
} from "../controller/Job.controller";
import requireUser from "../middleware/requireUser";
import { createJobSchema } from "../schema/job.schema";

const router = express.Router();

/**
 * QUERY ROUTES
 * All routes for retrieving job data
 */
router.get("/api/jobs", findAllJobsHandler); // All Jobs with pagination
router.get("/api/jobs/:id", findJobHandler); // Single Job Detail
router.get("/api/search/jobs/filter", FilterJobHandler); // Filter jobs by multiple criteria
router.get("/api/jobs/location/:location", findJobsByLocationHandler); // Jobs by Location
router.get("/api/search/jobs/keyword", SearchJobHandler); // Search Jobs by keyword

/**
 * MUTATION ROUTES
 * All routes for creating, updating, and deleting jobs
 */
router.post(
  "/api/jobs",
  [validateResource(createJobSchema), requireUser],
  CreateJobHandler
);

router.put(
  "/api/jobs/:id",
  [validateResource(createJobSchema), requireUser],
  updateJobHandler
);

// router.put(
//   "/api/jobs/:id/:salaryId/:metadataId/:hppId",
//   [validateResource(createJobSchema), requireUser],
//   updateJobFKHandler
// );

router.delete("/api/jobs/:id", requireUser, deleteJobHandler);

export default router;
