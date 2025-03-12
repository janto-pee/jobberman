import { Request, Response } from "express";
import { createAddressInput } from "../schema/address.schema";
import {
  createAddressService,
  deleteAddressService,
  findAddressService,
  findAllAddressService,
  totalAddressCountService,
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
      res.send("Address not found");
      return;
    }

    res.status(200).json({
      status: true,
      message: "Address found",
      address: address,
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

export async function findAllAddressHandler(req: Request, res: Response) {
  try {
    let page =
      typeof req.query.page !== "undefined" ? Number(req.query.page) - 1 : 0;
    let limit =
      typeof req.query.lmino !== "undefined" ? Number(req.query.lmino) : 10;
    const address = await findAllAddressService(page, limit);
    const total = await totalAddressCountService();
    if (address.length == 0) {
      res.status(404).send("no address found");
      return;
    }

    res.status(200).json({
      status: true,
      total,
      "address limit per page": limit,
      page: page + 1,
      address: address,
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
