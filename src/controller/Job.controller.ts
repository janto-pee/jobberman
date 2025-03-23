import { Request, Response } from "express";
import { createJobInput } from "../schema/job.schema";
import {
  createJobService,
  deleteJobService,
  findAllJobsService,
  findJobService,
  findManyJobsService,
  SearchJobService,
  totalJobCountService,
  updateJobFkService,
  updateJobService,
} from "../service/job.service";
import { findCompanyService } from "../service/company.service";

/**
 *
 * QUERY END POINTS
 * EXPOSED
 *
 */
export async function findJobHandler(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const job = await findJobService(id);
    if (!job) {
      res.send("could not find user's job");
      return;
    }
    res.status(200).json({
      status: true,
      message: "job found",
      job: job,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
      error: error,
    });
    return;
  }
}

export async function findAllJobsHandler(req: Request, res: Response) {
  try {
    const page =
      typeof req.query.page !== "undefined" ? Number(req.query.page) - 1 : 0;
    const limit =
      typeof req.query.lmino !== "undefined" ? Number(req.query.lmino) : 10;
    const job = await findAllJobsService(page, limit);
    const total = await totalJobCountService();
    if (!job) {
      res.send("could not find user's job");
      return;
    }

    res.status(200).json({
      status: true,
      total,
      "job limit per page": limit,
      page: page + 1,
      job: job,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
      error: error,
    });
    return;
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
  req: Request<{}, createJobInput["query"], {}>,
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
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
      error: error,
    });
    return;
  }
}

export async function SearchJobHandler(req: Request, res: Response) {
  try {
    const page =
      typeof req.query.page !== "undefined" ? Number(req.query.page) - 1 : 0;
    const limit =
      typeof req.query.lmino !== "undefined" ? Number(req.query.lmino) : 10;
    const title = req.query.title;

    const job = await SearchJobService(title, page, limit);
    if (job.length == 0) {
      res.status(404).send("No job found");
      return;
    }
    res.status(200).json({
      status: true,
      "total result": job.length,
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
 *
 *
 * MUTATIONS END POINT
 * NOT EXPOSED
 *
 */

export async function updateJobHandler(
  req: Request<{ id: string }, {}, createJobInput["body"]>,
  res: Response
) {
  try {
    const { id } = req.params;
    const body = req.body;

    const job = await findJobService(id);
    if (!job) {
      res.sendStatus(400);
      return;
    }

    //get user
    const user = res.locals.user;
    if (!user || user.companyId !== job.company_id) {
      res.status(500).json({ error: "unauthorised" });
      return;
    }

    const updatedjob = await updateJobService(id, body);

    res.status(200).json({
      status: true,
      message: "password changed successfully",
      data: updatedjob,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
      error: error,
    });
    return;
  }
}

export async function CreateJobHandler(
  req: Request<{}, {}, createJobInput["body"]>,
  res: Response
) {
  try {
    const body = req.body;

    //get user
    const user = res.locals.user;
    if (!user || user.companyId == null) {
      res
        .status(500)
        .json({ error: "this user is not affiliated with any company" });
      return;
    }

    const company = await findCompanyService(body.company_id);
    if (!company) {
      res.status(404).json({ error: "company not found" });
      return;
    }
    const job = await createJobService({
      ...body,
      // company_id: company.id,
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

export async function updateJobFKHandler(
  req: Request<
    {
      companyId: string;
      salaryId: string;
      metadataId: string;
      hppId: string;
      id: string;
    },
    {},
    createJobInput["body"]
  >,
  res: Response
) {
  try {
    const { salaryId, metadataId, hppId, id } = req.params;
    const body = req.body;
    const job = await findJobService(id);
    if (!job) {
      res.status(404).sendStatus(400);
      return;
    }

    //get user
    const user = res.locals.user;
    if (!user || user.companyId !== job.company_id) {
      res.status(500).json({ error: "unauthorised" });
      return;
    }

    const updatedJob = await updateJobFkService(
      salaryId,
      metadataId,
      hppId,
      id,
      { ...body }
    );

    res.status(200).json({
      status: true,
      message: "job updated successfully",
      data: updatedJob,
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

export async function deleteJobHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    //get user
    const user = res.locals.user;
    if (!user || user.companyId !== id) {
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
  }
}
