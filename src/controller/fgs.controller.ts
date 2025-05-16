import { Request, Response } from "express";
import {
  getCache,
  setCache,
  deleteCache,
  invalidatePattern,
} from "../utils/redis";
import { createFGSInput } from "../schema/fgs.schema";
import {
  createFGSService,
  deleteFGSService,
  findFGSService,
  findAllFGSService,
  totalFGSCountService,
  updateFGSService,
} from "../service/fgs.service";
import { logger } from "../utils/logger";
import { Counter, Histogram } from "prom-client";

// Define metrics for fgs operations
const fgsRequestCounter = new Counter({
  name: "jobberman_fgs_requests_total",
  help: "Total number of fgs API requests",
  labelNames: ["operation", "status"],
});

const fgsRequestDuration = new Histogram({
  name: "jobberman_fgs_request_duration_seconds",
  help: "Duration of fgs API requests in seconds",
  labelNames: ["operation"],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
});

/**
 * Get fgs by ID
 */
export async function findFGSHandler(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const fgs = await findFGSService(id);
    if (!fgs) {
      res.status(404).json({
        status: false,
        message: "FGS not found",
      });
      return;
    }

    res.status(200).json({
      status: true,
      message: "FGS retrieved successfully",
      data: fgs,
    });
    return;
  } catch (error) {
    logger.error("Error in findFGSHandler:", error);
    res.status(500).json({
      status: false,
      message: "Failed to retrieve fgs",
      error: error instanceof Error ? error.message : String(error),
    });
    return;
  }
}

/**
 * Get all fgs with pagination
 */
export async function findAllFGSHandler(req: Request, res: Response) {
  try {
    const page =
      typeof req.query.page !== "undefined"
        ? Math.max(0, Number(req.query.page) - 1)
        : 0;
    const limit =
      typeof req.query.limit !== "undefined"
        ? Math.min(50, Math.max(1, Number(req.query.limit)))
        : 10;

    const fgs = await findAllFGSService(page, limit);
    const total = await totalFGSCountService();

    if (!fgs || fgs.length === 0) {
      res.status(200).json({
        status: true,
        message: "No fgs found",
        total: 0,
        page: page + 1,
        limit,
        data: [],
      });
      return;
    }

    res.status(200).json({
      status: true,
      message: "FGSes retrieved successfully",
      total,
      page: page + 1,
      limit,
      data: fgs,
    });
    return;
  } catch (error) {
    logger.error("Error in findAllFGSHandler:", error);
    res.status(500).json({
      status: false,
      message: "Failed to retrieve fgs",
      error: error instanceof Error ? error.message : String(error),
    });
    return;
  }
}

/**
 * Create a new fgs
 */
export async function CreateFGSHandler(
  req: Request<{}, {}, createFGSInput["body"]>,
  res: Response
) {
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

    const fgs = await createFGSService({
      ...body,
    });

    res.status(201).json({
      status: true,
      message: "FGS created successfully",
      data: fgs,
    });
    return;
  } catch (error) {
    logger.error("Error in CreateFGSHandler:", error);
    res.status(500).json({
      status: false,
      message: "Failed to create fgs",
      error: error instanceof Error ? error.message : String(error),
    });
    return;
  }
}

export async function updateFGSHandler(
  req: Request<{ id: string }, {}, createFGSInput["body"]>,
  res: Response
) {
  const start = Date.now();
  const operation = "update";

  try {
    const { id } = req.params;
    const body = req.body;

    fgsRequestCounter.inc({ operation, status: "attempt" });

    // Get user
    const user = res.locals.user;
    if (!user) {
      fgsRequestCounter.inc({ operation, status: "unauthorized" });
      res.status(401).json({
        status: false,
        message: "Authentication required",
      });
      return;
    }

    const fgs = await findFGSService(id);
    if (!fgs) {
      fgsRequestCounter.inc({ operation, status: "notFound" });
      res.status(404).json({
        status: false,
        message: "FGS not found",
      });
      return;
    }

    // Check if the fgs belongs to the user
    // if (user.fgsId !== id) {
    //   fgsRequestCounter.inc({ operation, status: "forbidden" });
    //  res.status(403).json({
    //     status: false,
    //     message: "You don't have permission to update this fgs",
    //   });
    // }

    const updatedFGS = await updateFGSService(id, body);

    fgsRequestCounter.inc({ operation, status: "success" });

    res.status(200).json({
      status: true,
      message: "FGS updated successfully",
      data: updatedFGS,
    });
    return;
  } catch (error) {
    fgsRequestCounter.inc({ operation, status: "error" });
    logger.error("Error in updateFGSHandler:", error);
    res.status(500).json({
      status: false,
      message: "Failed to update fgs",
      error: error instanceof Error ? error.message : String(error),
    });
    return;
  } finally {
    const duration = (Date.now() - start) / 1000;
    fgsRequestDuration.observe({ operation }, duration);
  }
}

export async function deleteFGSHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    //get user
    const user = res.locals.user;
    if (!user) {
      res.status(500).json({ error: "unauthorised" });
      return;
    }

    const fgs = await deleteFGSService(id);
    res.status(200).json({
      status: true,
      message: `FGS Successfully Deleted`,
      data: fgs,
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
