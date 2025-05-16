import { Request, Response } from "express";
import {
  getCache,
  setCache,
  deleteCache,
  invalidatePattern,
} from "../utils/redis";
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
  name: "jobberman_address_requests_total",
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
  const timer = addressRequestDuration.startTimer({ operation: "findAddress" });
  try {
    const { id } = req.params;
    // Try to get from cache first
    const cacheKey = `address:${id}`;
    const cachedAddress = await getCache(cacheKey);

    if (cachedAddress) {
      logger.debug(`Cache hit for company ID: ${id}`);
      addressRequestCounter.inc({
        operation: "findAddress",
        status: "success",
      });
      timer({ operation: "findAddress" });
      res.status(200).json({
        status: true,
        message: "Address found successfully",
        company: cachedAddress,
        source: "cache",
      });
      return;
    }

    // Cache miss, fetch from database
    const address = await findAddressService(id);
    if (!address) {
      res.status(404).json({
        status: false,
        message: "Address not found",
      });
      return;
    }
    // Cache the result for future requests (1 hour TTL)
    await setCache(cacheKey, address, 3600);

    addressRequestCounter.inc({ operation: "findAddress", status: "success" });
    timer({ operation: "findCompany" });

    res.status(200).json({
      status: true,
      message: "Address retrieved successfully",
      data: address,
    });
    return;
  } catch (error) {
    logger.error("Error in findAddressHandler:", error);
    res.status(500).json({
      status: false,
      message: "Failed to retrieve address",
      error: error instanceof Error ? error.message : String(error),
    });
    return;
  }
}

/**
 * Get all addresses with pagination
 */
export async function findAllAddressHandler(req: Request, res: Response) {
  const timer = addressRequestDuration.startTimer({ operation: "findAddress" });
  try {
    const page =
      typeof req.query.page !== "undefined"
        ? Math.max(0, Number(req.query.page) - 1)
        : 0;
    const limit =
      typeof req.query.limit !== "undefined"
        ? Math.min(50, Math.max(1, Number(req.query.limit)))
        : 10;

    logger.info(`Fetching address page ${page + 1} with limit ${limit}`);

    // Create a cache key based on all query parameters
    const cacheKey = `address:page:${page}:limit:${limit}`;

    // Try to get from cache first
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      logger.debug(`Cache hit for address page ${page + 1}`);
      addressRequestCounter.inc({
        operation: "findAllCompanies",
        status: "success",
      });
      timer({ operation: "findAllCompanies" });
      res.status(200).json({
        ...cachedData,
        source: "cache",
      });
      return;
    }

    const addresses = await findAllAddressService(page, limit);
    const total = await totalAddressCountService();
    const responseData = {
      status: true,
      message: "Address retrieved successfully",
      total,
      page: page + 1,
      limit,
      data: addresses,
    };

    if (!addresses || addresses.length === 0) {
      res.status(200).json({
        status: true,
        message: "No addresses found",
        total: 0,
        page: page + 1,
        limit,
        data: [],
      });
      return;
    }
    // Cache the result for future requests (10 minutes TTL)
    await setCache(cacheKey, responseData, 600);

    addressRequestCounter.inc({
      operation: "findAllCompanies",
      status: "success",
    });
    timer({ operation: "findAllCompanies" });

    res.status(200).json(responseData);
    return;
  } catch (error) {
    logger.error("Error in findAllAddressHandler:", error);
    res.status(500).json({
      status: false,
      message: "Failed to retrieve addresses",
      error: error instanceof Error ? error.message : String(error),
    });
    return;
  }
}

/**
 * Create a new address
 */
export async function CreateAddressHandler(
  req: Request<{}, {}, createAddressInput["body"]>,
  res: Response
) {
  const timer = addressRequestDuration.startTimer({ operation: "findAddress" });
  try {
    const body = req.body;

    const user = res.locals.user;
    if (!user) {
      res.status(401).json({
        status: false,
        message: "Authentication required",
      });
      return;
    }

    if (user.addressId) {
      res.status(400).json({
        status: false,
        message:
          "User already has an address. Please update the existing address instead.",
      });
    }

    const address = await createAddressService({
      ...body,
    });

    await addUserToAddressService(user.id, address.id);

    res.status(201).json({
      status: true,
      message: "Address created successfully",
      data: address,
    });
    return;
  } catch (error) {
    logger.error("Error in CreateAddressHandler:", error);
    res.status(500).json({
      status: false,
      message: "Failed to create address",
      error: error instanceof Error ? error.message : String(error),
    });
    return;
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
      res.status(401).json({
        status: false,
        message: "Authentication required",
      });
      return;
    }

    const address = await findAddressService(id);
    if (!address) {
      addressRequestCounter.inc({ operation, status: "notFound" });
      res.status(404).json({
        status: false,
        message: "Address not found",
      });
      return;
    }

    // Check if the address belongs to the user
    if (user.addressId !== id) {
      addressRequestCounter.inc({ operation, status: "forbidden" });
      res.status(403).json({
        status: false,
        message: "You don't have permission to update this address",
      });
      return;
    }

    const updatedAddress = await updateAddressService(id, body);

    addressRequestCounter.inc({ operation, status: "success" });

    res.status(200).json({
      status: true,
      message: "Address updated successfully",
      data: updatedAddress,
    });
    return;
  } catch (error) {
    addressRequestCounter.inc({ operation, status: "error" });
    logger.error("Error in updateAddressHandler:", error);
    res.status(500).json({
      status: false,
      message: "Failed to update address",
      error: error instanceof Error ? error.message : String(error),
    });
    return;
  } finally {
    const duration = (Date.now() - start) / 1000;
    addressRequestDuration.observe({ operation }, duration);
  }
}

// const timer = addressRequestDuration.startTimer({ operation: "findAddress" });
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
    return;
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

    res.status(200).json({
      status: true,
      message: "Addresses retrieved successfully",
      searchTerm,
      total,
      page: page + 1,
      limit,
      data: addresses,
    });
    return;
  } catch (error) {
    addressRequestCounter.inc({ operation, status: "error" });
    logger.error("Error in searchAddressesHandler:", error);
    res.status(500).json({
      status: false,
      message: "Failed to search addresses",
      error: error instanceof Error ? error.message : String(error),
    });
    return;
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
      res.status(400).json({
        status: false,
        message: "Valid country code is required",
      });
      return;
    }

    const addresses = await getAddressesByCountryService(
      countryCode,
      page,
      limit
    );

    addressRequestCounter.inc({ operation, status: "success" });

    res.status(200).json({
      status: true,
      message: `Addresses in ${countryCode} retrieved successfully`,
      countryCode,
      page: page + 1,
      limit,
      count: addresses.length,
      data: addresses,
    });
    return;
  } catch (error) {
    addressRequestCounter.inc({ operation, status: "error" });
    logger.error("Error in getAddressesByCountryHandler:", error);
    res.status(500).json({
      status: false,
      message: "Failed to retrieve addresses by country",
      error: error instanceof Error ? error.message : String(error),
    });
    return;
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
      res.status(400).json({
        status: false,
        message: "Address validation failed",
        errors: validationResult.errors,
      });
      return;
    }

    addressRequestCounter.inc({ operation, status: "success" });

    res.status(200).json({
      status: true,
      message: "Address data is valid",
      data: body,
    });
    return;
  } catch (error) {
    addressRequestCounter.inc({ operation, status: "error" });
    logger.error("Error in validateAddressHandler:", error);
    res.status(500).json({
      status: false,
      message: "Failed to validate address",
      error: error instanceof Error ? error.message : String(error),
    });
    return;
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

    res.status(200).json({
      status: true,
      message: "Address statistics retrieved successfully",
      data: statistics,
    });
    return;
  } catch (error) {
    addressRequestCounter.inc({ operation, status: "error" });
    logger.error("Error in getAddressStatisticsHandler:", error);
    res.status(500).json({
      status: false,
      message: "Failed to retrieve address statistics",
      error: error instanceof Error ? error.message : String(error),
    });
    return;
  } finally {
    const duration = (Date.now() - start) / 1000;
    addressRequestDuration.observe({ operation }, duration);
  }
}
