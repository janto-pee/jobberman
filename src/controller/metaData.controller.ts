import { Request, Response } from "express";
import { createMetadataInput } from "../schema/metadata.schema";
import {
  createMetadataService,
  deleteMetadataService,
  findMetadataService,
  findAllMetadataService,
  totalMetadataCountService,
  updateMetadataService,
} from "../service/metadata.service";
import { logger } from "../utils/logger";
import { Counter, Histogram } from "prom-client";

// Define metrics for metadata operations
const metadataRequestCounter = new Counter({
  name: "jobberman_metadata_requests_total",
  help: "Total number of metadata API requests",
  labelNames: ["operation", "status"],
});

const metadataRequestDuration = new Histogram({
  name: "jobberman_metadata_request_duration_seconds",
  help: "Duration of metadata API requests in seconds",
  labelNames: ["operation"],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
});

/**
 * Get metadata by ID
 */
export async function findMetadataHandler(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const metadata = await findMetadataService(id);
    if (!metadata) {
      return res.status(404).json({
        status: false,
        message: "Metadata not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Metadata retrieved successfully",
      data: metadata,
    });
  } catch (error) {
    logger.error("Error in findMetadataHandler:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to retrieve metadata",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Get all metadata with pagination
 */
export async function findAllMetadataHandler(req: Request, res: Response) {
  try {
    const page =
      typeof req.query.page !== "undefined"
        ? Math.max(0, Number(req.query.page) - 1)
        : 0;
    const limit =
      typeof req.query.limit !== "undefined"
        ? Math.min(50, Math.max(1, Number(req.query.limit)))
        : 10;

    const metadata = await findAllMetadataService(page, limit);
    const total = await totalMetadataCountService();

    if (!metadata || metadata.length === 0) {
      return res.status(200).json({
        status: true,
        message: "No metadata found",
        total: 0,
        page: page + 1,
        limit,
        data: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "Metadataes retrieved successfully",
      total,
      page: page + 1,
      limit,
      data: metadata,
    });
  } catch (error) {
    logger.error("Error in findAllMetadataHandler:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to retrieve metadata",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Create a new metadata
 */
export async function CreateMetadataHandler(
  req: Request<{}, {}, createMetadataInput["body"]>,
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

    const metadata = await createMetadataService({
      ...body,
    });

    return res.status(201).json({
      status: true,
      message: "Metadata created successfully",
      data: metadata,
    });
  } catch (error) {
    logger.error("Error in CreateMetadataHandler:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to create metadata",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function updateMetadataHandler(
  req: Request<{ id: string }, {}, createMetadataInput["body"]>,
  res: Response
) {
  const start = Date.now();
  const operation = "update";

  try {
    const { id } = req.params;
    const body = req.body;

    metadataRequestCounter.inc({ operation, status: "attempt" });

    // Get user
    const user = res.locals.user;
    if (!user) {
      metadataRequestCounter.inc({ operation, status: "unauthorized" });
      return res.status(401).json({
        status: false,
        message: "Authentication required",
      });
    }

    const metadata = await findMetadataService(id);
    if (!metadata) {
      metadataRequestCounter.inc({ operation, status: "notFound" });
      return res.status(404).json({
        status: false,
        message: "Metadata not found",
      });
    }

    const updatedMetadata = await updateMetadataService(id, body);

    metadataRequestCounter.inc({ operation, status: "success" });

    return res.status(200).json({
      status: true,
      message: "Metadata updated successfully",
      data: updatedMetadata,
    });
  } catch (error) {
    metadataRequestCounter.inc({ operation, status: "error" });
    logger.error("Error in updateMetadataHandler:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to update metadata",
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    const duration = (Date.now() - start) / 1000;
    metadataRequestDuration.observe({ operation }, duration);
  }
}

export async function deleteMetadataHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    //get user
    const user = res.locals.user;
    if (!user) {
      res.status(500).json({ error: "unauthorised" });
      return;
    }

    const metadata = await deleteMetadataService(id);
    res.status(200).json({
      status: true,
      message: `Metadata Successfully Deleted`,
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
