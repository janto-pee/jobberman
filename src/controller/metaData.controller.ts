import { Request, Response } from "express";
import { createMetadataInput } from "../schema/metadata.schema";
import {
  createMetadataService,
  deleteMetadataService,
  findAllMetadataService,
  findMetadataService,
  totalMetadataCountService,
  updateMetadataService,
} from "../service/metadata.service";

export async function findMetadataHandler(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const metadata = await findMetadataService(id);
    if (!metadata) {
      res.send(" metadata not found");
      return;
    }

    res.status(200).json({
      status: true,
      message: "Metadata found",
      metadata: metadata,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "server error",
    });
  }
}
export async function findAllMetadataHandler(req: Request, res: Response) {
  try {
    let page =
      typeof req.query.page !== "undefined" ? Number(req.query.page) - 1 : 0;
    let limit =
      typeof req.query.lmino !== "undefined" ? Number(req.query.lmino) : 10;
    const FGS = await findAllMetadataService(page, limit);
    const total = await totalMetadataCountService();
    if (!FGS) {
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

export async function CreateMetadataHandler(
  req: Request<{}, {}, createMetadataInput["body"]>,
  res: Response
) {
  try {
    const body = req.body;

    const metadata = await createMetadataService({
      ...body,
    });

    res.status(201).json({
      status: true,
      message: `Job Metadata Successfully Created`,
      data: metadata,
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

export async function updateMetadataHandler(
  req: Request<{ id: string }, {}, createMetadataInput["body"]>,
  res: Response
) {
  try {
    const { id } = req.params;
    const body = req.body;

    const metadata = await findMetadataService(id);
    if (!metadata) {
      res.sendStatus(400);
      return;
    }
    //get user
    // const user = res.locals.user;
    // if (!user || user.companyId == null) {
    //   res.status(500).json({ error: "unauthorised" });
    //   return;
    // }

    const updatedAddress = await updateMetadataService(id, body);

    res.status(200).json({
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

export async function deleteMetadataHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    //get user
    // const user = res.locals.user;
    // if (!user || user.companyId == null) {
    //   res.status(500).json({ error: "unauthorised" });
    //   return;
    // }

    const metadata = await deleteMetadataService(id);
    res.status(200).json({
      status: true,
      message: `Address Successfully Deleted`,
      data: metadata,
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
