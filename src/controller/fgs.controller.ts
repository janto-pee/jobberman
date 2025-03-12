import { Request, Response } from "express";
import {
  createFGSService,
  deleteFGSService,
  findFGSService,
  updateFGSService,
} from "../service/fgs.service";
import { createFGSInput } from "../schema/fgs.schema";

export async function findFGSHandler(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const address = await findFGSService(id);
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

/**
 *
 * ! MUTATIONS
 *
 */

export async function CreateFGSHandler(
  req: Request<{}, {}, createFGSInput["body"]>,
  res: Response
) {
  try {
    const body = req.body;

    const address = await createFGSService({
      ...body,
    });

    res.status(201).json({
      status: true,
      message: `Fine grained salary type successfully created`,
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

export async function updateFGSHandler(
  req: Request<{ id: string }, {}, createFGSInput["body"]>,
  res: Response
) {
  try {
    const { id } = req.params;
    const body = req.body;
    const address = await findFGSService(id);
    if (!address) {
      res.sendStatus(400);
      return;
    }

    const updatedFGS = await updateFGSService(id, body);

    res.status(201).json({
      status: true,
      message: "password changed successfully",
      data: updatedFGS,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
    });
  }
}

export async function deleteFGSHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const address = await deleteFGSService(id);
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
