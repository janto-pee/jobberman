import { Request, Response } from "express";
import { createAddressInput } from "../schema/address.schema";
import {
  createAddressService,
  deleteAddressService,
  findAddressService,
  updateAddressService,
} from "../service/address.service";

export async function findAddressHandler(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const address = await findAddressService(id);
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

export async function CreateAddressHandler(
  req: Request<{}, {}, createAddressInput["body"]>,
  res: Response
) {
  try {
    const body = req.body;

    const address = await createAddressService({
      ...body,
    });

    res.status(201).json({
      status: true,
      message: `Address Successfully Created`,
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

export async function updateAddressHandler(
  req: Request<{ id: string }, {}, createAddressInput["body"]>,
  res: Response
) {
  try {
    const { id } = req.params;
    const body = req.body;
    const address = await findAddressService(id);
    if (!address) {
      res.sendStatus(400);
      return;
    }

    const updatedAddress = await updateAddressService(id, body);

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

export async function deleteAddressHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const address = await deleteAddressService(id);
    res.status(200).json({
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
