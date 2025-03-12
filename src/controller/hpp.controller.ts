import { Request, Response } from "express";
import { createHPPInput } from "../schema/hpp.schema";
import {
  createHPPService,
  deleteHPPService,
  findHPPService,
  updateHPPService,
} from "../service/hpp.service";

export async function findHPPHandler(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const address = await findHPPService(id);
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

export async function CreateHPPHandler(
  req: Request<{}, {}, createHPPInput["body"]>,
  res: Response
) {
  try {
    const body = req.body;

    const address = await createHPPService({
      ...body,
    });

    res.status(201).json({
      status: true,
      message: `HHas probabtion information Successfully Created`,
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

export async function updateHPPHandler(
  req: Request<{ id: string }, {}, createHPPInput["body"]>,
  res: Response
) {
  try {
    const { id } = req.params;
    const body = req.body;
    const address = await findHPPService(id);
    if (!address) {
      res.sendStatus(400);
      return;
    }

    const updatedAddress = await updateHPPService(id, body);

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

export async function deleteHPPHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const address = await deleteHPPService(id);
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
