import { Request, Response } from "express";
import { createJobInput } from "../schema/job.schema";
import {
  createJobService,
  deleteJobService,
  findAllJobsService,
  findJobService,
  findManyJobsService,
  totalJobCountService,
  updateJobFkService,
  updateJobService,
} from "../service/job.service";

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
    res.status(201).json({
      status: true,
      message: "job found",
      job: job,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
    });
  }
}

export async function findAllJobsHandler(req: Request, res: Response) {
  try {
    let page =
      typeof req.query.page !== "undefined" ? Number(req.query.page) - 1 : 0;
    let limit =
      typeof req.query.lmino !== "undefined" ? Number(req.query.lmino) : 10;
    const job = await findAllJobsService(page, limit);
    const total = await totalJobCountService();
    if (job.length == 0) {
      res.send("could not find user's job");
      return;
    }

    res.status(201).json({
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
    });
  }
}

export async function findJobsByLocationHandler(
  req: Request<{}, { page: number; lmino: number; location: string }, {}>,
  res: Response
) {
  try {
    let page =
      typeof req.query.page !== "undefined" ? Number(req.query.page) - 1 : 0;
    let limit =
      typeof req.query.lmino !== "undefined" ? Number(req.query.lmino) : 5;
    const location = req.query.location;
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

    res.status(201).json({
      status: true,
      "job displayed": limit,
      page: page + 1,
      job: job,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
    });
  }
}

export async function FilterJobHandler(
  req: Request<{}, createJobInput["query"], {}>,
  res: Response
) {
  try {
    let page =
      typeof req.query.page !== "undefined" ? Number(req.query.page) - 1 : 0;
    let limit =
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
      },
      page,
      limit
    );
    if (!job) {
      res.send("could not find user's job");
      return;
    }
    res.status(201).json({
      status: true,
      "job displayed": limit,
      page: page + 1,
      job: job,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
    });
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

    const updatedjob = await updateJobService(id, body);

    res.status(201).json({
      status: true,
      message: "password changed successfully",
      data: updatedjob,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
    });
  }
}

export async function CreateJobHandler(
  req: Request<{}, {}, createJobInput["body"]>,
  res: Response
) {
  try {
    const body = req.body;

    const job = await createJobService({
      ...body,
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
    const { companyId, salaryId, metadataId, hppId, id } = req.params;
    const body = req.body;
    const job = await findJobService(id);
    if (!job) {
      res.status(404).sendStatus(400);
      return;
    }

    const updatedJob = await updateJobFkService(
      companyId,
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
    });
    return;
  }
}

export async function deleteJobHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const job = await deleteJobService(id);
    res.status(201).json({
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
