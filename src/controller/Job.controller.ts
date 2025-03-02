import { Request, Response } from "express";
import { createJobInput } from "../schema/job.schema";
import {
  createJobService,
  deleteJobService,
  findJobService,
  updateJobService,
} from "../service/job.service";

export async function CreateJobHandler(
  req: Request<{}, {}, createJobInput["body"]>,
  res: Response
) {
  try {
    const body = req.body;

    const address = await createJobService({
      ...body,
    });

    res.status(201).json({
      status: true,
      message: `ddress Successfully Created`,
      data: address,
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

export async function findJobHandler(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const address = await findJobService(id);
    if (!address) {
      res.send("could not find user's address");
      return;
    }

    res.status(201).json({
      status: true,
      message: "User address found",
      address: address,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
    });
  }
}

export async function updateJobHandler(
  req: Request<{ id: string }, {}, createJobInput["body"]>,
  res: Response
) {
  try {
    const { id } = req.params;
    const body = req.body;
    const address = await findJobService(id);
    if (!address) {
      res.sendStatus(400);
      return;
    }

    const updatedAddress = await updateJobService(id, body);

    res.status(201).json({
      status: true,
      message: "password changed successfully",
      data: updatedAddress,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
    });
  }
}

export async function deleteJobHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const address = await deleteJobService(id);
    res.status(201).json({
      status: true,
      message: `Address Successfully Deleted`,
      data: address,
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
