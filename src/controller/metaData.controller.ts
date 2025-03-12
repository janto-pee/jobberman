import { Request, Response } from "express";
import { createMetadataInput } from "../schema/metadata.schema";
import {
  createMetadataService,
  deleteMetadataService,
  findMetadataService,
  updateMetadataService,
} from "../service/metadata.service";

export async function findMetadataHandler(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const address = await findMetadataService(id);
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

export async function CreateMetadataHandler(
  req: Request<{}, {}, createMetadataInput["body"]>,
  res: Response
) {
  try {
    const body = req.body;

    const address = await createMetadataService({
      ...body,
    });

    res.status(201).json({
      status: true,
      message: `Job Metadata Successfully Created`,
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

export async function updateMetadataHandler(
  req: Request<{ id: string }, {}, createMetadataInput["body"]>,
  res: Response
) {
  try {
    const { id } = req.params;
    const body = req.body;
    const address = await findMetadataService(id);
    if (!address) {
      res.sendStatus(400);
      return;
    }

    const updatedAddress = await updateMetadataService(id, body);

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

export async function deleteMetadataHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const address = await deleteMetadataService(id);
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
