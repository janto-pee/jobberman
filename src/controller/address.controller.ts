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
import { addUserToAddressService } from "../service/user.service";
import { logger } from "../utils/logger";
import { Counter, Histogram } from "prom-client";

// Define metrics for address operations
const addressRequestCounter = new Counter({
  name: "jobberman_ddress_requests_total",
  help: "Total number of address API requests",
  labelNames: ["operation", "status"],
});

const addressRequestDuration = new Histogram({
  name: "jobberman_address_request_duration_seconds",
  help: "Duration of address API requests in seconds",
  labelNames: ["operation"],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
});

/**
 * Get address by ID
 */
export async function findAddressHandler(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const address = await findAddressService(id);
    if (!address) {
      return res.status(404).json({
        status: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Address retrieved successfully",
      data: address,
    });
  } catch (error) {
    logger.error("Error in findAddressHandler:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to retrieve address",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Get all addresses with pagination
 */
export async function findAllAddressHandler(req: Request, res: Response) {
  try {
    const page =
      typeof req.query.page !== "undefined"
        ? Math.max(0, Number(req.query.page) - 1)
        : 0;
    const limit =
      typeof req.query.limit !== "undefined"
        ? Math.min(50, Math.max(1, Number(req.query.limit)))
        : 10;

    const addresses = await findAllAddressService(page, limit);
    const total = await totalAddressCountService();

    if (!addresses || addresses.length === 0) {
      return res.status(200).json({
        status: true,
        message: "No addresses found",
        total: 0,
        page: page + 1,
        limit,
        data: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "Addresses retrieved successfully",
      total,
      page: page + 1,
      limit,
      data: addresses,
    });
  } catch (error) {
    logger.error("Error in findAllAddressHandler:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to retrieve addresses",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Create a new address
 */
export async function CreateAddressHandler(
  req: Request<{}, {}, createAddressInput["body"]>,
  res: Response
) {
  try {
    const body = req.body;

    const user = res.locals.user;
    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Authentication required",
      });
    }

    if (user.addressId) {
      return res.status(400).json({
        status: false,
        message:
          "User already has an address. Please update the existing address instead.",
      });
    }

    const address = await createAddressService({
      ...body,
    });

    await addUserToAddressService(user.id, address.id);

    return res.status(201).json({
      status: true,
      message: "Address created successfully",
      data: address,
    });
  } catch (error) {
    logger.error("Error in CreateAddressHandler:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to create address",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Update an existing address
 */
// export async function updateAddressHandler(
//   req: Request<{ id: string }, {}, createAddressInput["body"]>,
//   res: Response,
// ) {
//   try {
//     const { id } = req.params;
//     const body = req.body;

//     const user = res.locals.user;
//     if (!user) {
//       return res.status(401).json({
//         status: false,
//         message: "Authentication required"
//       });
//     }

//     const address = await findAddressService(id);
//     if (!address) {
//       return res.status(404).json({
//         status: false,
//         message: "Address not found"
//       });
//     }

//     // Check if the address belongs to the user
//     if (user.addressId !== id) {
//       return res.status(403).json({
//         status: false,
//         message: "You don't have permission to update this address"
//       });
//     }
export async function updateAddressHandler(
  req: Request<{ id: string }, {}, createAddressInput["body"]>,
  res: Response
) {
  const { id } = req.params;
  const body = req.body;

  //get user
  const user = res.locals.user;
  if (!user) {
    res.status(500).json({ error: "unauthorised" });
    return;
  }

  const address = await findAddressService(id);
  if (!address) {
    res.sendStatus(400);
    return;
  }

  try {
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
      error: error,
    });
    return;
  }
}

export async function deleteAddressHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    //get user
    const user = res.locals.user;
    if (!user) {
      res.status(500).json({ error: "unauthorised" });
      return;
    }

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
