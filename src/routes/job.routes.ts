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
  updateJobHandler,
} from "../controller/job.controller";

const router = express.Router();
/**
 * QUERY ROUTES
 */
router.get("/api/jobs", findAllJobsHandler); // All Jobs
router.get("/api/jobs/:id", findJobHandler); //Job Detail
router.get("/api/search/company/filter", FilterJobHandler); //Filter Company
router.get("/api/jobs/location/:location", findJobsByLocationHandler); //Location
router.get("/api/search/company/keyword", SearchJobHandler); //Search Job

/**
 * MUTATION ROUTES
 */

router.post("/api/jobs", CreateJobHandler);
router.put("/api/jobs/:id", updateJobHandler);
router.put("/api/jobs/:id/:companyId/:salaryId/:metadataId/:hppId");
router.delete("/api/jobs/:id", deleteJobHandler);

export default router;
