import { Request, Response } from "express";
import { createAddressInput } from "../schema/address.schema";
import {
  createAddressService,
  deleteAddressService,
  findAddressService,
  findAllAddressService,
  getAddressesByCountryService,
  getAddressStatisticsService,
  searchAddressesService,
  totalAddressCountService,
  updateAddressService,
  validateAddressService,
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

export async function updateAddressHandler(
  req: Request<{ id: string }, {}, createAddressInput["body"]>,
  res: Response
) {
  const start = Date.now();
  const operation = "update";

  try {
    const { id } = req.params;
    const body = req.body;

    addressRequestCounter.inc({ operation, status: "attempt" });

    // Get user
    const user = res.locals.user;
    if (!user) {
      addressRequestCounter.inc({ operation, status: "unauthorized" });
      return res.status(401).json({
        status: false,
        message: "Authentication required",
      });
    }

    const address = await findAddressService(id);
    if (!address) {
      addressRequestCounter.inc({ operation, status: "notFound" });
      return res.status(404).json({
        status: false,
        message: "Address not found",
      });
    }

    // Check if the address belongs to the user
    if (user.addressId !== id) {
      addressRequestCounter.inc({ operation, status: "forbidden" });
      return res.status(403).json({
        status: false,
        message: "You don't have permission to update this address",
      });
    }

    const updatedAddress = await updateAddressService(id, body);

    addressRequestCounter.inc({ operation, status: "success" });

    return res.status(200).json({
      status: true,
      message: "Address updated successfully",
      data: updatedAddress,
    });
  } catch (error) {
    addressRequestCounter.inc({ operation, status: "error" });
    logger.error("Error in updateAddressHandler:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to update address",
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    const duration = (Date.now() - start) / 1000;
    addressRequestDuration.observe({ operation }, duration);
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

/**
 * Search addresses by various criteria
 */
export async function searchAddressesHandler(req: Request, res: Response) {
  const start = Date.now();
  const operation = "search";

  try {
    const searchTerm = (req.query.q as string) || "";
    const page =
      typeof req.query.page !== "undefined"
        ? Math.max(0, Number(req.query.page) - 1)
        : 0;
    const limit =
      typeof req.query.limit !== "undefined"
        ? Math.min(50, Math.max(1, Number(req.query.limit)))
        : 10;

    addressRequestCounter.inc({ operation, status: "attempt" });

    const addresses = await searchAddressesService(searchTerm, page, limit);
    const total = await totalAddressCountService();

    addressRequestCounter.inc({ operation, status: "success" });

    return res.status(200).json({
      status: true,
      message: "Addresses retrieved successfully",
      searchTerm,
      total,
      page: page + 1,
      limit,
      data: addresses,
    });
  } catch (error) {
    addressRequestCounter.inc({ operation, status: "error" });
    logger.error("Error in searchAddressesHandler:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to search addresses",
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    const duration = (Date.now() - start) / 1000;
    addressRequestDuration.observe({ operation }, duration);
  }
}

/**
 * Get addresses by country
 */
export async function getAddressesByCountryHandler(
  req: Request,
  res: Response
) {
  const start = Date.now();
  const operation = "getByCountry";

  try {
    const { countryCode } = req.params;
    const page =
      typeof req.query.page !== "undefined"
        ? Math.max(0, Number(req.query.page) - 1)
        : 0;
    const limit =
      typeof req.query.limit !== "undefined"
        ? Math.min(50, Math.max(1, Number(req.query.limit)))
        : 10;

    addressRequestCounter.inc({ operation, status: "attempt" });

    if (!countryCode || countryCode.length < 2) {
      addressRequestCounter.inc({ operation, status: "invalid" });
      return res.status(400).json({
        status: false,
        message: "Valid country code is required",
      });
    }

    const addresses = await getAddressesByCountryService(
      countryCode,
      page,
      limit
    );

    addressRequestCounter.inc({ operation, status: "success" });

    return res.status(200).json({
      status: true,
      message: `Addresses in ${countryCode} retrieved successfully`,
      countryCode,
      page: page + 1,
      limit,
      count: addresses.length,
      data: addresses,
    });
  } catch (error) {
    addressRequestCounter.inc({ operation, status: "error" });
    logger.error("Error in getAddressesByCountryHandler:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to retrieve addresses by country",
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    const duration = (Date.now() - start) / 1000;
    addressRequestDuration.observe({ operation }, duration);
  }
}

/**
 * Validate address data
 */
export async function validateAddressHandler(
  req: Request<{}, {}, createAddressInput["body"]>,
  res: Response
) {
  const start = Date.now();
  const operation = "validate";

  try {
    const body = req.body;

    addressRequestCounter.inc({ operation, status: "attempt" });

    const validationResult = await validateAddressService(body);

    if (!validationResult.isValid) {
      addressRequestCounter.inc({ operation, status: "invalid" });
      return res.status(400).json({
        status: false,
        message: "Address validation failed",
        errors: validationResult.errors,
      });
    }

    addressRequestCounter.inc({ operation, status: "success" });

    return res.status(200).json({
      status: true,
      message: "Address data is valid",
      data: body,
    });
  } catch (error) {
    addressRequestCounter.inc({ operation, status: "error" });
    logger.error("Error in validateAddressHandler:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to validate address",
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    const duration = (Date.now() - start) / 1000;
    addressRequestDuration.observe({ operation }, duration);
  }
}

/**
 * Get address statistics
 */
export async function getAddressStatisticsHandler(req: Request, res: Response) {
  const start = Date.now();
  const operation = "statistics";

  try {
    addressRequestCounter.inc({ operation, status: "attempt" });

    const statistics = await getAddressStatisticsService();

    addressRequestCounter.inc({ operation, status: "success" });

    return res.status(200).json({
      status: true,
      message: "Address statistics retrieved successfully",
      data: statistics,
    });
  } catch (error) {
    addressRequestCounter.inc({ operation, status: "error" });
    logger.error("Error in getAddressStatisticsHandler:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to retrieve address statistics",
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    const duration = (Date.now() - start) / 1000;
    addressRequestDuration.observe({ operation }, duration);
  }
}
