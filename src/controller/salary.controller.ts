import { Request, Response } from "express";

import {
  getCache,
  setCache,
  deleteCache,
  invalidatePattern,
} from "../utils/redis";
import { createsalaryInput } from "../schema/salary.schema";
import {
  createSalaryService,
  deleteSalaryService,
  fiilterManySalaryService,
  findAllSalaryService,
  findSalaryService,
  findManySalaryService,
  getSalaryStatisticsService,
  SearchSalaryService,
  totalSalaryCountService,
  updateSalaryService,
} from "../service/salary.service";
import { logger } from "../utils/logger";
import { Counter, Histogram } from "prom-client";

// Define metrics for salary operations
const salaryRequestCounter = new Counter({
  name: "jobberman_salary_requests_total",
  help: "Total number of salary API requests",
  labelNames: ["operation", "status"],
});

const salaryRequestDuration = new Histogram({
  name: "jobberman_salary_request_duration_seconds",
  help: "Duration of salary API requests in seconds",
  labelNames: ["operation"],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
});

/**
 * Get a salary by ID with caching
 */
export async function findSalaryHandler(
  req: Request<{ id: string }>,
  res: Response
) {
  const timer = salaryRequestDuration.startTimer({ operation: "findSalary" });
  try {
    const { id } = req.params;
    logger.info(`Finding salary with ID: ${id}`);

    // Input validation
    if (!id || id.trim() === "") {
      salaryRequestCounter.inc({ operation: "findSalary", status: "error" });
      res.status(400).json({
        status: false,
        message: "Salary ID is required",
      });
      return;
    }

    // Try to get from cache first
    const cacheKey = `salary:${id}`;
    const cachedSalary = await getCache(cacheKey);

    if (cachedSalary) {
      logger.debug(`Cache hit for salary ID: ${id}`);
      salaryRequestCounter.inc({
        operation: "findSalary",
        status: "success",
      });
      timer({ operation: "findSalary" });
      res.status(200).json({
        status: true,
        message: "Salary found successfully",
        salary: cachedSalary,
        source: "cache",
      });
      return;
    }

    // Cache miss, fetch from database
    const salary = await findSalaryService(id);
    if (!salary) {
      logger.warn(`Salary not found with ID: ${id}`);
      salaryRequestCounter.inc({
        operation: "findSalary",
        status: "notFound",
      });
      timer({ operation: "findSalary" });
      res.status(404).json({
        status: false,
        message: "Salary not found",
      });
      return;
    }

    // Cache the result for future requests (1 hour TTL)
    await setCache(cacheKey, salary, 3600);

    salaryRequestCounter.inc({ operation: "findSalary", status: "success" });
    timer({ operation: "findSalary" });
    res.status(200).json({
      status: true,
      message: "Salary found successfully",
      salary,
      source: "database",
    });
    return;
  } catch (error) {
    logger.error(`Error finding salary: ${error}`);
    salaryRequestCounter.inc({ operation: "findSalary", status: "error" });
    timer({ operation: "findSalary" });
    res.status(500).json({
      status: false,
      message: "Failed to retrieve salary",
      error: error instanceof Error ? error.message : String(error),
    });
    return;
  }
}

/**
 * Get all companies with pagination, filtering, and caching
 */
export async function findAllSalarysHandler(req: Request, res: Response) {
  const timer = salaryRequestDuration.startTimer({
    operation: "findAllCompanies",
  });
  try {
    // Parse and validate pagination parameters
    const page =
      typeof req.query.page !== "undefined"
        ? Math.max(1, Number(req.query.page)) - 1
        : 0;

    const limit =
      typeof req.query.limit !== "undefined"
        ? Math.min(50, Math.max(1, Number(req.query.limit)))
        : 10;

    // Parse sorting parameters
    const sortBy =
      typeof req.query.sortBy === "string" ? req.query.sortBy : "created_at";

    const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";

    logger.info(
      `Fetching companies page ${page + 1} with limit ${limit}, sorted by ${sortBy} ${sortOrder}`
    );

    // Create a cache key based on all query parameters
    const cacheKey = `companies:page:${page}:limit:${limit}:sort:${sortBy}:${sortOrder}`;

    // Try to get from cache first
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      logger.debug(`Cache hit for companies page ${page + 1}`);
      salaryRequestCounter.inc({
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

    // Cache miss, fetch from database with sorting
    const [companies, total] = await Promise.all([
      findAllSalaryService(page, limit, sortBy, sortOrder),
      totalSalaryCountService(),
    ]);

    if (!companies || companies.length === 0) {
      salaryRequestCounter.inc({
        operation: "findAllCompanies",
        status: "notFound",
      });
      timer({ operation: "findAllCompanies" });
      res.status(404).json({
        status: false,
        message: "No companies found",
      });
      return;
    }

    const totalPages = Math.ceil(total / limit);

    const responseData = {
      status: true,
      pagination: {
        total,
        limit,
        currentPage: page + 1,
        totalPages,
        hasNextPage: page + 1 < totalPages,
        hasPrevPage: page > 0,
      },
      companies,
    };

    // Cache the result for future requests (10 minutes TTL)
    await setCache(cacheKey, responseData, 600);

    salaryRequestCounter.inc({
      operation: "findAllCompanies",
      status: "success",
    });
    timer({ operation: "findAllCompanies" });
    res.status(200).json({
      ...responseData,
      source: "database",
    });
    return;
  } catch (error) {
    logger.error(`Error fetching all companies: ${error}`);
    salaryRequestCounter.inc({
      operation: "findAllCompanies",
      status: "error",
    });
    timer({ operation: "findAllCompanies" });
    res.status(500).json({
      status: false,
      message: "Failed to retrieve companies",
      error: error instanceof Error ? error.message : String(error),
    });
    return;
  }
}

export async function findSalaryByLocationHandler(
  req: Request<{ location: string }, { page: number; lmino: number }, {}>,
  res: Response
) {
  try {
    const page =
      typeof req.query.page !== "undefined" ? Number(req.query.page) - 1 : 0;
    const limit =
      typeof req.query.lmino !== "undefined" ? Number(req.query.lmino) : 5;
    const location = req.params.location;

    // Create a cache key based on location and pagination
    const cacheKey = `companies:location:${location}:page:${page}:limit:${limit}`;

    // Try to get from cache first
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      logger.debug(
        `Cache hit for companies in location: ${location}, page ${page + 1}`
      );
      res.status(200).json({
        ...cachedData,
        source: "cache",
      });
      return;
    }

    // Cache miss, fetch from database
    const companies = await findManySalaryService(location, page, limit);

    if (companies.length === 0) {
      res.status(404).json({
        status: false,
        message: "No companies found for this location",
      });
      return;
    }

    const responseData = {
      status: true,
      total: companies.length,
      page: page + 1,
      limit,
      companies,
    };
    await setCache(cacheKey, responseData, 900);

    res.status(200).json({
      status: true,
      "salary result": companies.length,
      page: page + 1,
      salary: companies,
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

export async function FilterSalaryHandler(req: Request, res: Response) {
  try {
    const page =
      typeof req.query.page !== "undefined" ? Number(req.query.page) - 1 : 0;
    const limit =
      typeof req.query.lmino !== "undefined" ? Number(req.query.lmino) : 10;
    const city = req.query.city?.toString();
    const size = req.query.size?.toString();
    const country = req.query.country?.toString();
    const name = req.query.name?.toString();

    const salary = await fiilterManySalaryService(
      { city: city, size, country, name },
      page,
      limit
    );
    if (salary.length == 0) {
      res.status(404).send("No salary found");
      return;
    }
    res.status(200).json({
      status: true,
      "salary displayed per page": limit,
      page: page + 1,
      salary: salary,
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

export async function SearchSalaryHandler(req: Request, res: Response) {
  try {
    const page =
      typeof req.query.page !== "undefined" ? Number(req.query.page) - 1 : 0;
    const limit =
      typeof req.query.lmino !== "undefined" ? Number(req.query.lmino) : 10;
    const name = req.query.name;

    const salary = await SearchSalaryService(name?.toString(), page, limit);
    if (salary.length == 0) {
      res.status(404).send("No salary found");
      return;
    }
    res.status(200).json({
      status: true,
      "total result": salary.length,
      page: page + 1,
      salary: salary,
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
 * Get salary statistics
 */
export async function getSalaryStatisticsHandler(req: Request, res: Response) {
  const timer = salaryRequestDuration.startTimer({
    operation: "getSalaryStatistics",
  });
  try {
    logger.info("Fetching salary statistics");

    // Try to get from cache first
    const cacheKey = "salary:statistics";
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      logger.debug("Cache hit for salary statistics");
      salaryRequestCounter.inc({
        operation: "getSalaryStatistics",
        status: "success",
      });
      timer({ operation: "getSalaryStatistics" });
      res.status(200).json({
        status: true,
        data: cachedData,
        source: "cache",
      });
      return;
    }

    // Cache miss, fetch from database
    const statistics = await getSalaryStatisticsService();

    // Cache the result for future requests (1 hour TTL)
    await setCache(cacheKey, statistics, 3600);

    salaryRequestCounter.inc({
      operation: "getSalaryStatistics",
      status: "success",
    });
    timer({ operation: "getSalaryStatistics" });
    res.status(200).json({
      status: true,
      data: statistics,
      source: "database",
    });
    return;
  } catch (error) {
    logger.error(`Error fetching salary statistics: ${error}`);
    salaryRequestCounter.inc({
      operation: "getSalaryStatistics",
      status: "error",
    });
    timer({ operation: "getSalaryStatistics" });
    res.status(500).json({
      status: false,
      message: "Failed to retrieve salary statistics",
      error: error instanceof Error ? error.message : String(error),
    });
    return;
  }
}

/**
 *
 * MUTTIONS
 * NOT EXPOSED
 *
 */
/**
 * Create a new salary
 */
export async function CreateSalaryHandler(
  req: Request<{}, {}, createsalaryInput["body"]>,
  res: Response
) {
  try {
    const body = req.body;
    const user = res.locals.user;

    if (!user) {
      logger.warn("Unauthorized attempt to create salary");
      res.status(401).json({
        status: false,
        message: "Authentication required",
      });
      return;
    }

    logger.info(`Creating salary for user: ${user.id}`);

    // Transaction to ensure both operations succeed or fail together
    const salary = await createSalaryService({
      ...body,
      // createdBy: user.id, // Track who created the salary
    });

    res.status(201).json({
      status: true,
      message: "Salary successfully created",
      data: {
        salary,
      },
    });
    return;
  } catch (error) {
    logger.error(`Error creating salary: ${error}`);
    res.status(500).json({
      status: false,
      message: "Failed to create salary",
      error: error instanceof Error ? error.message : String(error),
    });
    return;
  }
}

export async function updateSalaryHandler(
  req: Request<{ id: string }, {}, createsalaryInput["body"]>,
  res: Response
) {
  try {
    const { id } = req.params;
    const body = req.body;

    //get user
    const user = res.locals.user;
    if (!user) {
      res.status(500).json({ error: "unauthorised" });
      return;
    }

    const salary = await findSalaryService(id);
    if (!salary) {
      res.status(404).sendStatus(400);
      return;
    }
    const updatedSalary = await updateSalaryService(id, body);

    res.status(200).json({
      status: true,
      message: "salary updated successfully",
      data: updatedSalary,
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

export async function deleteSalaryHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    //get user
    const user = res.locals.user;
    if (!user) {
      res.status(500).json({ error: "unauthorised" });
      return;
    }

    const salary = await deleteSalaryService(id);
    res.status(200).json({
      status: true,
      message: `salary Successfully Deleted`,
      data: salary,
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
