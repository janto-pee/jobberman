import { Request, Response } from "express";
import { createHPPInput } from "../schema/hpp.schema";
import {
  createHPPService,
  deleteHPPService,
  findAllHPPService,
  findHPPService,
  totalHPPCountService,
  updateHPPService,
} from "../service/hpp.service";

export async function findHPPHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const { id } = req.params;

    const HPP = await findHPPService(id);
    if (!HPP) {
      res.send("HPP not found");
      return;
    }

    res.status(200).json({
      status: true,
      message: "HPP found",
      HPP: HPP,
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
export async function findAllHPPHandler(req: Request, res: Response) {
  try {
    const page =
      typeof req.query.page !== "undefined" ? Number(req.query.page) - 1 : 0;
    const limit =
      typeof req.query.lmino !== "undefined" ? Number(req.query.lmino) : 10;
    const HPP = await findAllHPPService(page, limit);
    const total = await totalHPPCountService();
    if (!HPP) {
      res.status(404).send("HPP not found");
      return;
    }

    res.status(200).json({
      status: true,
      total,
      "HPP limit per page": limit,
      page: page + 1,
      HPP: HPP,
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
 * ! MUTATIONS
 *
 */

export async function CreateHPPHandler(
  req: Request<{}, {}, createHPPInput["body"]>,
  res: Response,
) {
  try {
    const body = req.body;

    const HPP = await createHPPService({
      ...body,
    });

    res.status(201).json({
      status: true,
      message: `Has probabtion information Successfully Created`,
      data: HPP,
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
  res: Response,
) {
  try {
    const { id } = req.params;
    const body = req.body;
    const HPP = await findHPPService(id);
    if (!HPP) {
      res.sendStatus(400);
      return;
    }

    const updatedAddress = await updateHPPService(id, body);

    res.status(200).json({
      status: true,
      message: "password changed successfully",
      data: updatedAddress,
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

export async function deleteHPPHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const HPP = await deleteHPPService(id);
    res.status(200).json({
      status: true,
      message: `Address Successfully Deleted`,
      data: HPP,
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
