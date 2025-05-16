import { Request, Response } from "express";
import { createTBS } from "../schema/tbs.schema";
import {
  createTBSService,
  deleteTBSService,
  findAllTBSService,
  findTBSService,
  totalTBSCountService,
  updateTBSService,
} from "../service/tbs.service";

export async function findTBSHandler(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const TBS = await findTBSService(id);
    if (!TBS) {
      res.send("could not find user's TBS");
      return;
    }

    res.status(200).json({
      status: true,
      message: "User TBS found",
      TBS: TBS,
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

export async function findAllTBSHandler(req: Request, res: Response) {
  try {
    const page =
      typeof req.query.page !== "undefined" ? Number(req.query.page) - 1 : 0;
    const limit =
      typeof req.query.lmino !== "undefined" ? Number(req.query.lmino) : 10;
    const TBS = await findAllTBSService(page, limit);
    const total = await totalTBSCountService();
    if (!TBS) {
      res.status(404).send("TBS not found");
      return;
    }

    res.status(200).json({
      status: true,
      total,
      "TBS limit per page": limit,
      page: page + 1,
      TBS: TBS,
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

export async function CreateTBSHandler(
  req: Request<{}, {}, createTBS["body"]>,
  res: Response
) {
  try {
    const body = req.body;

    const TBS = await createTBSService({
      ...body,
    });

    res.status(201).json({
      status: true,
      message: `TBS Successfully Created`,
      data: TBS,
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
    const TBS = await findTBSService(id);
    if (!TBS) {
      res.sendStatus(400);
      return;
    }

    const updatedAddress = await updateTBSService(id, body);

    res.status(200).json({
      status: true,
      message: "password changed successfully",
      data: updatedAddress,
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

export async function deleteTBSHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const TBS = await deleteTBSService(id);
    res.status(200).json({
      status: true,
      message: `Address Successfully Deleted`,
      data: TBS,
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
