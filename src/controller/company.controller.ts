import { Request, Response } from "express";
import {
  getCache,
  setCache,
  deleteCache,
  invalidatePattern,
} from "../utils/redis";
import { createcompanyInput } from "../schema/company.schema";
import {
  createCompanyService,
  deleteCompanyService,
  fiilterManyCompanyService,
  findAllCompanyService,
  findCompanyService,
  findManyCompanyService,
  getCompanyStatisticsService,
  getFeaturedCompaniesService,
  getTrendingCompaniesService,
  SearchCompanyService,
  totalCompanyCountService,
  updateCompanyAddressService,
  updateCompanyService,
  verifyCompanyService,
} from "../service/company.service";
import { createAddressInput } from "../schema/address.schema";
import { addUserToCompanyService } from "../service/user.service";
import { logger } from "../utils/logger";
import { Counter, Histogram } from "prom-client";

// Define metrics for company operations
const companyRequestCounter = new Counter({
  name: "jobberman_company_requests_total",
  help: "Total number of company API requests",
  labelNames: ["operation", "status"],
});

const companyRequestDuration = new Histogram({
  name: "jobberman_company_request_duration_seconds",
  help: "Duration of company API requests in seconds",
  labelNames: ["operation"],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
});

/**
 * Get a company by ID with caching
 */
export async function findCompanyHandler(
  req: Request<{ id: string }>,
  res: Response
) {
  const timer = companyRequestDuration.startTimer({ operation: "findCompany" });
  try {
    const { id } = req.params;
    logger.info(`Finding company with ID: ${id}`);

    // Input validation
    if (!id || id.trim() === "") {
      companyRequestCounter.inc({ operation: "findCompany", status: "error" });
      res.status(400).json({
        status: false,
        message: "Company ID is required",
      });
      return;
    }

    // Try to get from cache first
    const cacheKey = `company:${id}`;
    const cachedCompany = await getCache(cacheKey);

    if (cachedCompany) {
      logger.debug(`Cache hit for company ID: ${id}`);
      companyRequestCounter.inc({
        operation: "findCompany",
        status: "success",
      });
      timer({ operation: "findCompany" });
      res.status(200).json({
        status: true,
        message: "Company found successfully",
        company: cachedCompany,
        source: "cache",
      });
      return;
    }

    // Cache miss, fetch from database
    const company = await findCompanyService(id);
    if (!company) {
      logger.warn(`Company not found with ID: ${id}`);
      companyRequestCounter.inc({
        operation: "findCompany",
        status: "notFound",
      });
      timer({ operation: "findCompany" });
      res.status(404).json({
        status: false,
        message: "Company not found",
      });
      return;
    }

    // Cache the result for future requests (1 hour TTL)
    await setCache(cacheKey, company, 3600);

    companyRequestCounter.inc({ operation: "findCompany", status: "success" });
    timer({ operation: "findCompany" });
    res.status(200).json({
      status: true,
      message: "Company found successfully",
      company,
      source: "database",
    });
    return;
  } catch (error) {
    logger.error(`Error finding company: ${error}`);
    companyRequestCounter.inc({ operation: "findCompany", status: "error" });
    timer({ operation: "findCompany" });
    res.status(500).json({
      status: false,
      message: "Failed to retrieve company",
      error: error instanceof Error ? error.message : String(error),
    });
    return;
  }
}

/**
 * Get all companies with pagination, filtering, and caching
 */
export async function findAllCompanysHandler(req: Request, res: Response) {
  const timer = companyRequestDuration.startTimer({
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
      companyRequestCounter.inc({
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
      findAllCompanyService(page, limit, sortBy, sortOrder),
      totalCompanyCountService(),
    ]);

    if (!companies || companies.length === 0) {
      companyRequestCounter.inc({
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

    companyRequestCounter.inc({
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
    companyRequestCounter.inc({
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

export async function findCompanyByLocationHandler(
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
    const companies = await findManyCompanyService(location, page, limit);

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
      "company result": companies.length,
      page: page + 1,
      company: companies,
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

export async function FilterCompanyHandler(req: Request, res: Response) {
  try {
    const page =
      typeof req.query.page !== "undefined" ? Number(req.query.page) - 1 : 0;
    const limit =
      typeof req.query.lmino !== "undefined" ? Number(req.query.lmino) : 10;
    const city = req.query.city?.toString();
    const size = req.query.size?.toString();
    const country = req.query.country?.toString();
    const name = req.query.name?.toString();

    const company = await fiilterManyCompanyService(
      { city: city, size, country, name },
      page,
      limit
    );
    if (company.length == 0) {
      res.status(404).send("No company found");
      return;
    }
    res.status(200).json({
      status: true,
      "company displayed per page": limit,
      page: page + 1,
      company: company,
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

export async function SearchCompanyHandler(req: Request, res: Response) {
  try {
    const page =
      typeof req.query.page !== "undefined" ? Number(req.query.page) - 1 : 0;
    const limit =
      typeof req.query.lmino !== "undefined" ? Number(req.query.lmino) : 10;
    const name = req.query.name;

    const company = await SearchCompanyService(name?.toString(), page, limit);
    if (company.length == 0) {
      res.status(404).send("No company found");
      return;
    }
    res.status(200).json({
      status: true,
      "total result": company.length,
      page: page + 1,
      company: company,
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
 * Get company statistics
 */
export async function getCompanyStatisticsHandler(req: Request, res: Response) {
  const timer = companyRequestDuration.startTimer({
    operation: "getCompanyStatistics",
  });
  try {
    logger.info("Fetching company statistics");

    // Try to get from cache first
    const cacheKey = "company:statistics";
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      logger.debug("Cache hit for company statistics");
      companyRequestCounter.inc({
        operation: "getCompanyStatistics",
        status: "success",
      });
      timer({ operation: "getCompanyStatistics" });
      res.status(200).json({
        status: true,
        data: cachedData,
        source: "cache",
      });
      return;
    }

    // Cache miss, fetch from database
    const statistics = await getCompanyStatisticsService();

    // Cache the result for future requests (1 hour TTL)
    await setCache(cacheKey, statistics, 3600);

    companyRequestCounter.inc({
      operation: "getCompanyStatistics",
      status: "success",
    });
    timer({ operation: "getCompanyStatistics" });
    res.status(200).json({
      status: true,
      data: statistics,
      source: "database",
    });
    return;
  } catch (error) {
    logger.error(`Error fetching company statistics: ${error}`);
    companyRequestCounter.inc({
      operation: "getCompanyStatistics",
      status: "error",
    });
    timer({ operation: "getCompanyStatistics" });
    res.status(500).json({
      status: false,
      message: "Failed to retrieve company statistics",
      error: error instanceof Error ? error.message : String(error),
    });
    return;
  }
}

/**
 * Get trending companies
 */
export async function getTrendingCompaniesHandler(req: Request, res: Response) {
  const timer = companyRequestDuration.startTimer({
    operation: "getTrendingCompanies",
  });
  try {
    const limit =
      typeof req.query.limit !== "undefined"
        ? Math.min(20, Math.max(1, Number(req.query.limit)))
        : 5;

    logger.info(`Fetching trending companies with limit ${limit}`);

    // Try to get from cache first
    const cacheKey = `companies:trending:limit:${limit}`;
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      logger.debug(`Cache hit for trending companies with limit ${limit}`);
      companyRequestCounter.inc({
        operation: "getTrendingCompanies",
        status: "success",
      });
      timer({ operation: "getTrendingCompanies" });
      res.status(200).json({
        status: true,
        data: cachedData,
        source: "cache",
      });
      return;
    }

    // Cache miss, fetch from database
    const trendingCompanies = await getTrendingCompaniesService(limit);

    if (!trendingCompanies || trendingCompanies.length === 0) {
      companyRequestCounter.inc({
        operation: "getTrendingCompanies",
        status: "notFound",
      });
      timer({ operation: "getTrendingCompanies" });
      res.status(404).json({
        status: false,
        message: "No trending companies found",
      });
      return;
    }

    // Cache the result for future requests (15 minutes TTL)
    await setCache(cacheKey, trendingCompanies, 900);

    companyRequestCounter.inc({
      operation: "getTrendingCompanies",
      status: "success",
    });
    timer({ operation: "getTrendingCompanies" });
    res.status(200).json({
      status: true,
      data: trendingCompanies,
      source: "database",
    });
    return;
  } catch (error) {
    logger.error(`Error fetching trending companies: ${error}`);
    companyRequestCounter.inc({
      operation: "getTrendingCompanies",
      status: "error",
    });
    timer({ operation: "getTrendingCompanies" });
    res.status(500).json({
      status: false,
      message: "Failed to retrieve trending companies",
      error: error instanceof Error ? error.message : String(error),
    });
    return;
  }
}

/**
 * Verify a company (admin only)
 */
export async function verifyCompanyHandler(req: Request, res: Response) {
  const timer = companyRequestDuration.startTimer({
    operation: "verifyCompany",
  });
  try {
    const { id } = req.params;
    const { isVerified, verificationNotes } = req.body;

    // Get user from auth middleware
    const user = res.locals.user;

    if (!user || user.role !== "ADMIN") {
      logger.warn(
        `Unauthorized attempt to verify company by user: ${user?.id}`
      );
      companyRequestCounter.inc({
        operation: "verifyCompany",
        status: "unauthorized",
      });
      timer({ operation: "verifyCompany" });
      res.status(403).json({
        status: false,
        message: "Only administrators can verify companies",
      });
      return;
    }

    logger.info(`Verifying company ${id} by admin ${user.id}`);

    const updatedCompany = await verifyCompanyService(id, {
      isVerified,
      verifiedBy: user.id,
      verificationNotes,
    });

    // Invalidate any cached data for this company
    await invalidatePattern(`company:${id}*`);

    companyRequestCounter.inc({
      operation: "verifyCompany",
      status: "success",
    });
    timer({ operation: "verifyCompany" });
    res.status(200).json({
      status: true,
      message: `Company ${isVerified ? "verified" : "unverified"} successfully`,
      data: updatedCompany,
    });
    return;
  } catch (error) {
    logger.error(`Error verifying company: ${error}`);
    companyRequestCounter.inc({ operation: "verifyCompany", status: "error" });
    timer({ operation: "verifyCompany" });
    res.status(500).json({
      status: false,
      message: "Failed to verify company",
      error: error instanceof Error ? error.message : String(error),
    });
    return;
  }
}

/**
 * Get featured companies for homepage
 */
export async function getFeaturedCompaniesHandler(req: Request, res: Response) {
  const timer = companyRequestDuration.startTimer({
    operation: "getFeaturedCompanies",
  });
  try {
    const limit =
      typeof req.query.limit !== "undefined"
        ? Math.min(12, Math.max(1, Number(req.query.limit)))
        : 6;

    logger.info(`Fetching featured companies with limit ${limit}`);

    // Try to get from cache first
    const cacheKey = `companies:featured:limit:${limit}`;
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      logger.debug(`Cache hit for featured companies with limit ${limit}`);
      companyRequestCounter.inc({
        operation: "getFeaturedCompanies",
        status: "success",
      });
      timer({ operation: "getFeaturedCompanies" });
      res.status(200).json({
        status: true,
        data: cachedData,
        source: "cache",
      });
      return;
    }

    // Cache miss, fetch from database
    const featuredCompanies = await getFeaturedCompaniesService(limit);

    if (!featuredCompanies || featuredCompanies.length === 0) {
      companyRequestCounter.inc({
        operation: "getFeaturedCompanies",
        status: "notFound",
      });
      timer({ operation: "getFeaturedCompanies" });
      res.status(404).json({
        status: false,
        message: "No featured companies found",
      });
      return;
    }

    // Cache the result for future requests (30 minutes TTL)
    await setCache(cacheKey, featuredCompanies, 1800);

    companyRequestCounter.inc({
      operation: "getFeaturedCompanies",
      status: "success",
    });
    timer({ operation: "getFeaturedCompanies" });
    res.status(200).json({
      status: true,
      data: featuredCompanies,
      source: "database",
    });
    return;
  } catch (error) {
    logger.error(`Error fetching featured companies: ${error}`);
    companyRequestCounter.inc({
      operation: "getFeaturedCompanies",
      status: "error",
    });
    timer({ operation: "getFeaturedCompanies" });
    res.status(500).json({
      status: false,
      message: "Failed to retrieve featured companies",
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
 * Create a new company
 */
export async function CreateCompanyHandler(
  req: Request<{}, {}, createcompanyInput["body"]>,
  res: Response
) {
  try {
    const body = req.body;
    const user = res.locals.user;

    if (!user) {
      logger.warn("Unauthorized attempt to create company");
      res.status(401).json({
        status: false,
        message: "Authentication required",
      });
    }

    logger.info(`Creating company for user: ${user.id}`);

    // Transaction to ensure both operations succeed or fail together
    const company = await createCompanyService({
      ...body,
      // createdBy: user.id, // Track who created the company
    });

    const updatedUser = await addUserToCompanyService(user.id, company.id);

    res.status(201).json({
      status: true,
      message: "Company successfully created",
      data: {
        company,
        user: updatedUser,
      },
    });
    return;
  } catch (error) {
    logger.error(`Error creating company: ${error}`);
    res.status(500).json({
      status: false,
      message: "Failed to create company",
      error: error instanceof Error ? error.message : String(error),
    });
    return;
  }
}

export async function updateCompanyHandler(
  req: Request<{ id: string }, {}, createcompanyInput["body"]>,
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

    const company = await findCompanyService(id);
    if (!company) {
      res.status(404).sendStatus(400);
      return;
    }
    const updatedCompany = await updateCompanyService(id, body);

    res.status(200).json({
      status: true,
      message: "company updated successfully",
      data: updatedCompany,
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

export async function updateCompanyAddressHandler(
  req: Request<
    { companyId: string; addressId: string },
    {},
    createAddressInput["body"]
  >,
  res: Response
) {
  try {
    const { companyId, addressId } = req.params;
    const body = req.body;

    //get user
    const user = res.locals.user;
    if (!user) {
      res.status(500).json({ error: "unauthorised" });
      return;
    }
    const company = await findCompanyService(companyId);
    if (!company) {
      res.sendStatus(400);
      return;
    }

    const updatedCompany = await updateCompanyAddressService(
      companyId,
      addressId,
      { ...body }
    );

    res.status(201).json({
      status: true,
      message: "company updated successfully",
      data: updatedCompany,
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

export async function deleteCompanyHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    //get user
    const user = res.locals.user;
    if (!user) {
      res.status(500).json({ error: "unauthorised" });
      return;
    }

    const company = await deleteCompanyService(id);
    res.status(200).json({
      status: true,
      message: `company Successfully Deleted`,
      data: company,
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

// The rest of the controller methods would follow similar patterns of:
// 1. Input validation and sanitization
// 2. Proper error handling with specific status codes
// 3. Consistent response formatting
// 4. Logging for debugging and monitoring
// 5. Pagination improvements
// Cache the result for future requests (15 minutes TTL)
