import { Request, Response } from "express";
import { createTBS } from "../schema/tbs.schema";
import {
  createTBSService,
  deleteTBSService,
  findTBSService,
  updateTBSService,
} from "../service/tbs.service";

export async function findTBSHandler(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const address = await findTBSService(id);
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

export async function CreateTBSHandler(
  req: Request<{}, {}, createTBS["body"]>,
  res: Response
) {
  try {
    const body = req.body;

    const address = await createTBSService({
      ...body,
    });

    res.status(201).json({
      status: true,
      message: `TBS Successfully Created`,
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

export async function updateTBSHandler(
  req: Request<{ id: string }, {}, createTBS["body"]>,
  res: Response
) {
  try {
    const { id } = req.params;
    const body = req.body;
    const address = await findTBSService(id);
    if (!address) {
      res.sendStatus(400);
      return;
    }

    const updatedAddress = await updateTBSService(id, body);

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

export async function deleteTBSHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const address = await deleteTBSService(id);
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
