import express from "express";

import validateResource from "../middleware/validate";
import {
  CreateJobHandler,
  deleteJobHandler,
  findAllJobsHandler,
  findJobHandler,
  findJobsByLocationHandler,
  updateJobHandler,
} from "../controller/job.controller";

const router = express.Router();
/**
 * QUERY ROUTES
 */
router.get("/api/jobs/:id", findJobHandler); //Job Detail
router.get("/api/jobs", findAllJobsHandler); //Jobs
router.get("/api/jobs/location/:location", findJobsByLocationHandler); //Location
// Job filter
// search Job

/**
 * MUTATION ROUTES
 */

router.post("/api/job", CreateJobHandler);
router.put("/api/job/:id", updateJobHandler);
router.put("/api/job/:id/:companyId/:salaryId/:metadataId/:hppId");
router.delete("/api/job/:id", deleteJobHandler);

export default router;
