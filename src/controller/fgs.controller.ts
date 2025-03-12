import { Request, Response } from "express";
import {
  createFGSService,
  deleteFGSService,
  findAllFGSService,
  findFGSService,
  totalFGSCountService,
  updateFGSService,
} from "../service/fgs.service";
import { createFGSInput } from "../schema/fgs.schema";

export async function findFGSHandler(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const FGS = await findFGSService(id);
    if (!FGS) {
      res.send("FGS not found");
      return;
    }

    res.status(200).json({
      status: true,
      message: "FGS found",
      "Fixed Grain Salary": FGS,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
    });
  }
}

export async function findAllFGSHandler(req: Request, res: Response) {
  try {
    let page =
      typeof req.query.page !== "undefined" ? Number(req.query.page) - 1 : 0;
    let limit =
      typeof req.query.lmino !== "undefined" ? Number(req.query.lmino) : 10;
    const FGS = await findAllFGSService(page, limit);
    const total = await totalFGSCountService();
    if (FGS.length == 0) {
      res.status(404).send("FGS not found");
      return;
    }

    res.status(200).json({
      status: true,
      total,
      "FGS limit per page": limit,
      page: page + 1,
      FGS: FGS,
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

    const FGS = await createFGSService({
      ...body,
    });

    res.status(201).json({
      status: true,
      message: `Fine grained salary type successfully created`,
      data: FGS,
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
    const FGS = await findFGSService(id);
    if (!FGS) {
      res.sendStatus(400);
      return;
    }

    const updatedFGS = await updateFGSService(id, body);

    res.status(200).json({
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

    const FGS = await deleteFGSService(id);
    res.status(200).json({
      status: true,
      message: `FGS Successfully Deleted`,
      data: FGS,
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
