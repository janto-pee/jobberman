import { Request, Response } from "express";
import { createsalaryInput } from "../schema/salary.schema";
import {
  createSalaryService,
  deleteSalaryService,
  findSalaryService,
  updateSalaryService,
} from "../service/salary.service";

export async function CreateSalaryHandler(
  req: Request<{}, {}, createsalaryInput["body"]>,
  res: Response
) {
  try {
    const body = req.body;

    const address = await createSalaryService({
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

export async function findSalaryHandler(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const address = await findSalaryService(id);
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

export async function updateSalaryHandler(
  req: Request<{ id: string }, {}, createsalaryInput["body"]>,
  res: Response
) {
  try {
    const { id } = req.params;
    const body = req.body;
    const address = await findSalaryService(id);
    if (!address) {
      res.sendStatus(400);
      return;
    }

    const updatedAddress = await updateSalaryService(id, body);

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

export async function deleteSalaryHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const address = await deleteSalaryService(id);
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
