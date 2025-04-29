import { Request, Response } from "express";
import {
  getCache,
  setCache,
  deleteCache,
  invalidatePattern,
} from "../utils/redis";
import { createHPPInput } from "../schema/hpp.schema";
import {
  createHPPService,
  deleteHPPService,
  findHPPService,
  findAllHPPService,
  totalHPPCountService,
  updateHPPService,
} from "../service/hpp.service";
import { logger } from "../utils/logger";
import { Counter, Histogram } from "prom-client";

// Define metrics for hpp operations
const hppRequestCounter = new Counter({
  name: "jobberman_hpp_requests_total",
  help: "Total number of hpp API requests",
  labelNames: ["operation", "status"],
});

const hppRequestDuration = new Histogram({
  name: "jobberman_hpp_request_duration_seconds",
  help: "Duration of hpp API requests in seconds",
  labelNames: ["operation"],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
});

/**
 * Get hpp by ID
 */
export async function findHPPHandler(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const hpp = await findHPPService(id);
    if (!hpp) {
      return res.status(404).json({
        status: false,
        message: "HPP not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "HPP retrieved successfully",
      data: hpp,
    });
  } catch (error) {
    logger.error("Error in findHPPHandler:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to retrieve hpp",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Get all hpp with pagination
 */
export async function findAllHPPHandler(req: Request, res: Response) {
  try {
    const page =
      typeof req.query.page !== "undefined"
        ? Math.max(0, Number(req.query.page) - 1)
        : 0;
    const limit =
      typeof req.query.limit !== "undefined"
        ? Math.min(50, Math.max(1, Number(req.query.limit)))
        : 10;

    const hpp = await findAllHPPService(page, limit);
    const total = await totalHPPCountService();

    if (!hpp || hpp.length === 0) {
      return res.status(200).json({
        status: true,
        message: "No hpp found",
        total: 0,
        page: page + 1,
        limit,
        data: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "HPPes retrieved successfully",
      total,
      page: page + 1,
      limit,
      data: hpp,
    });
  } catch (error) {
    logger.error("Error in findAllHPPHandler:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to retrieve hpp",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Create a new hpp
 */
export async function CreateHPPHandler(
  req: Request<{}, {}, createHPPInput["body"]>,
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

    const hpp = await createHPPService({
      ...body,
    });

    return res.status(201).json({
      status: true,
      message: "HPP created successfully",
      data: hpp,
    });
  } catch (error) {
    logger.error("Error in CreateHPPHandler:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to create hpp",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function updateHPPHandler(
  req: Request<{ id: string }, {}, createHPPInput["body"]>,
  res: Response
) {
  const start = Date.now();
  const operation = "update";

  try {
    const { id } = req.params;
    const body = req.body;

    hppRequestCounter.inc({ operation, status: "attempt" });

    // Get user
    const user = res.locals.user;
    if (!user) {
      hppRequestCounter.inc({ operation, status: "unauthorized" });
      return res.status(401).json({
        status: false,
        message: "Authentication required",
      });
    }

    const hpp = await findHPPService(id);
    if (!hpp) {
      hppRequestCounter.inc({ operation, status: "notFound" });
      return res.status(404).json({
        status: false,
        message: "HPP not found",
      });
    }

    const updatedHPP = await updateHPPService(id, body);

    hppRequestCounter.inc({ operation, status: "success" });

    return res.status(200).json({
      status: true,
      message: "HPP updated successfully",
      data: updatedHPP,
    });
  } catch (error) {
    hppRequestCounter.inc({ operation, status: "error" });
    logger.error("Error in updateHPPHandler:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to update hpp",
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    const duration = (Date.now() - start) / 1000;
    hppRequestDuration.observe({ operation }, duration);
  }
}

export async function deleteHPPHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    //get user
    const user = res.locals.user;
    if (!user) {
      res.status(500).json({ error: "unauthorised" });
      return;
    }

    const hpp = await deleteHPPService(id);
    res.status(200).json({
      status: true,
      message: `HPP Successfully Deleted`,
      data: hpp,
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
