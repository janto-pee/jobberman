import { Request, Response } from "express";
import {
  getCache,
  setCache,
  deleteCache,
  invalidatePattern,
} from "../utils/redis";
import { createJobInput, FilterjobQuery } from "../schema/job.schema";
import {
  createJobService,
  deleteJobService,
  findAllJobsService,
  findJobService,
  findManyJobsService,
  SearchJobService,
  totalJobCountService,
  updateJobService,
} from "../service/job.service";
import { findCompanyService } from "../service/company.service";
import { findUserService } from "../service/user.service";
import { createJobSchema } from "../schema/job.schema";

// Create a utility function
function sendResponse(
  res: Response,
  status: boolean,
  statusCode: number,
  message: string,
  data?: any
) {
  res.status(statusCode).json({
    status,
    message,
    ...(data && { data }),
  });
  return;
}

function getPaginationParams(req: Request) {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.max(1, parseInt(req.query.lmino as string) || 10);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}

// Add this utility function
async function checkCompanyAuthorization(userId: string, companyId?: string) {
  const user = await findUserService(userId);

  if (!user?.companyId) {
    return {
      authorized: false,
      message: "User is not affiliated with any company",
    };
  }

  if (companyId && user.companyId !== companyId) {
    return {
      authorized: false,
      message: "Unauthorized: User does not belong to this company",
    };
  }

  return { authorized: true, user };
}

// For error responses
function sendErrorResponse(
  res: Response,
  statusCode: number,
  message: string,
  error?: any
) {
  res.status(statusCode).json({
    status: false,
    message,
    ...(error && { error }),
  });
  return;
}

/**
 *
 * QUERY END POINTS
 * EXPOSED
 *
 */

// Import at the top

// Then in your routes file:
// router.post('/jobs', validateRequest(createJobSchema), CreateJobHandler);

export async function findJobHandler(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const job = await findJobService(id);
    if (!job) {
      return sendResponse(res, false, 404, "Job not found");
    }

    return sendResponse(res, true, 200, "Job found", { job });
  } catch (error) {
    return sendErrorResponse(res, 500, "Server error", error);
  }
}

export async function findAllJobsHandler(req: Request, res: Response) {
  try {
    // Validate and parse query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.lmino as string) || 10;

    if (page < 1 || limit < 1) {
      return sendErrorResponse(res, 400, "Invalid pagination parameters");
    }

    const job = await findAllJobsService(page - 1, limit);
    const total = await totalJobCountService();

    if (!job) {
      return sendResponse(res, false, 404, "No jobs found");
    }

    return sendResponse(res, true, 200, "Jobs retrieved successfully", {
      total,
      limit,
      page,
      jobs: job,
      totalPages: Math.ceil(total / limit),
    });
    return;
  } catch (error) {
    return sendErrorResponse(res, 500, "Server error", error);
  }
}

export async function findJobsByLocationHandler(
  req: Request<{ location: string }, { page: number; lmino: number }, {}>,
  res: Response
) {
  try {
    const page =
      typeof req.query.page !== "undefined" ? Number(req.query.page) - 1 : 0;
    const limit =
      typeof req.query.lmino !== "undefined" ? Number(req.query.lmino) : 5;
    const location = req.params.location;
    const job = await findManyJobsService(
      {
        location: {
          contains: location,
        },
      },
      page,
      limit
    );
    if (!job) {
      res.send("No job for this location");
      return;
    }

    res.status(200).json({
      status: true,
      "job displayed": limit,
      page: page + 1,
      job: job,
    });
    return;
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
      error: error,
    });
    return;
  }
}

export async function FilterJobHandler(
  req: Request<{}, FilterjobQuery["query"], {}>,
  res: Response
) {
  try {
    const page =
      typeof req.query.page !== "undefined" ? Number(req.query.page) - 1 : 0;
    const limit =
      typeof req.query.lmino !== "undefined" ? Number(req.query.lmino) : 10;
    const company = req.query.company_id;
    const title = req.query.title;
    const qualification = req.query.qualification;
    const job_type = req.query.job_type;
    const visa_sponsorship = req.query.visa_sponsorship;
    const remote_posible = req.query.remote_posible;
    const location = req.query.location;
    const date = req.query.date_posted;
    const skills = req.query.skills;
    const probation = req.query.probationaryPeriod;
    const salary = req.query.minimumMinor;
    const currency = req.query.currency;
    const job = await findManyJobsService(
      {
        company,
        title,
        qualification,
        job_type,
        visa_sponsorship,
        remote_posible,
        location,
        skills,
        date,
        probation,
        salary,
        currency,
      },
      page,
      limit
    );
    if (!job) {
      res.send("Job not found");
      return;
    }
    res.status(200).json({
      status: true,
      "job displayed": limit,
      page: page + 1,
      job: job,
    });
    return;
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
      error: error,
    });
    return;
  }
}

/**
 * Search for jobs by title
 * @param req Express request object
 * @param res Express response object
 * @returns Jobs matching the search criteria
 */
export async function SearchJobHandler(req: Request, res: Response) {
  try {
    const pagination = getPaginationParams(req);
    const title = req.query.title as string;

    if (!title || title.trim() === "") {
      return sendErrorResponse(res, 400, "Search title is required");
    }

    const jobs = await SearchJobService(
      title,
      pagination.page - 1,
      pagination.limit
    );

    if (jobs.jobs.length === 0) {
      return sendResponse(
        res,
        false,
        404,
        "No jobs found matching your search criteria"
      );
    }

    return sendResponse(
      res,
      true,
      200,
      "Search results retrieved successfully",
      {
        total: jobs.jobs.length,
        page: pagination.page,
        limit: pagination.limit,
        jobs,
      }
    );
  } catch (error) {
    return sendErrorResponse(res, 500, "Server error", error);
  }
}

/**
 *
 *
 * MUTATIONS END POINT
 * NOT EXPOSED
 *
 */

export async function CreateJobHandler(
  req: Request<{}, {}, createJobInput["body"]>,
  res: Response
) {
  try {
    const body = req.body;
    // //get user
    const resUser = res.locals.user;
    const user = await findUserService(resUser.id);

    if (!user || user.companyId == null) {
      res
        .status(500)
        .json({ error: "this user is not affiliated with any company" });
      return;
    }

    const company = await findCompanyService(user.companyId);
    if (!company) {
      res.status(404).json({ error: "company not found" });
      return;
    }
    const job = await createJobService({
      ...body,
      company_id: company.id,
    });

    res.status(201).json({
      status: true,
      message: `Job Successfully Created`,
      data: job,
    });
    return;
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
      error: error,
    });
    return;
  }
}

// Then use it in handlers like:
export async function updateJobHandler(
  req: Request<{ id: string }, {}, createJobInput["body"]>,
  res: Response
) {
  try {
    const { id } = req.params;
    const body = req.body;

    const job = await findJobService(id);
    if (!job) {
      return sendResponse(res, false, 404, "Job not found");
    }

    const auth = await checkCompanyAuthorization(
      res.locals.user.id,
      job.company_id
    );
    if (!auth.authorized) {
      return sendErrorResponse(res, 403, "user not affiliated with company");
      // return sendErrorResponse(res, 403, auth.message);
    }

    const updatedJob = await updateJobService(id, body);
    return sendResponse(res, true, 200, "Job updated successfully", updatedJob);
  } catch (error) {
    return sendErrorResponse(res, 500, "Server error", error);
  }
}

export async function deleteJobHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    //get user
    const resUser = res.locals.user;
    const user = await findUserService(resUser.id);
    if (!user?.companyId) {
      res
        .status(500)
        .json({ error: "please create a company before you create a job" });
      return;
    }

    const company = await findCompanyService(user.companyId);

    if (!user || user.companyId !== company?.id) {
      res.status(500).json({ error: "unauthorised" });
      return;
    }

    const job = await deleteJobService(id);
    res.status(200).json({
      status: true,
      message: `Job Successfully Deleted`,
      data: job,
    });
    return;
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
      error: error,
    });
    return;
  }
}

// export async function updateJobFKHandler(
//   req: Request<
//     {
//       salaryId: string;
//       metadataId: string;
//       hppId: string;
//       id: string;
//     },
//     {},
//     createJobInput["body"]
//   >,
//   res: Response
// ) {
//   try {
//     const { salaryId, metadataId, hppId, id } = req.params;
//     const body = req.body;
//     const job = await findJobService(id);
//     if (!job) {
//       res.status(404).sendStatus(400);
//       return;
//     }

//     //get user
//     const resUser = res.locals.user;
//     const user = await findUserService(resUser.id);

//     if (!user || user.companyId !== job.company_id) {
//       res.status(500).json({ error: "unauthorised" });
//       return;
//     }

//     const updatedJob = await updateJobFkService(
//       salaryId,
//       metadataId,
//       hppId,
//       id,
//       { ...body, company_id: user.companyId }
//     );

//     res.status(200).json({
//       status: true,
//       message: "job updated successfully",
//       data: updatedJob,
//     });
//     return;
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: "server error",
//       error: error,
//     });
//     return;
//   }
// }
