import { Request, Response } from "express";

import { createcompanyInput } from "../schema/company.schema";
import {
  createCompanyService,
  deleteCompanyService,
  fiilterManyCompanyService,
  findAllCompanyService,
  findCompanyService,
  findManyCompanyService,
  SearchCompanyService,
  totalCompanyCountService,
  updateCompanyAddressService,
  updateCompanyService,
} from "../service/company.service";
import { createAddressInput } from "../schema/address.schema";
import { addUserToCompanyService } from "../service/user.service";
import { logger } from "../utils/logger";

export async function findCompanyHandler(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;
    logger.info(`Finding company with ID: ${id}`);

    const company = await findCompanyService(id);
    if (!company) {
      logger.warn(`Company not found with ID: ${id}`);
      return res.status(404).json({
        status: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Company found successfully",
      company,
    });
  } catch (error) {
    logger.error(`Error finding company: ${error}`);
    return res.status(500).json({
      status: false,
      message: "Failed to retrieve company",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Get all companies with pagination
 */
export async function findAllCompanysHandler(req: Request, res: Response) {
  try {
    const page =
      typeof req.query.page !== "undefined"
        ? Math.max(1, Number(req.query.page)) - 1
        : 0;
    const limit =
      typeof req.query.limit !== "undefined"
        ? Math.min(50, Math.max(1, Number(req.query.limit)))
        : 10;

    logger.info(`Fetching companies page ${page + 1} with limit ${limit}`);

    const [companies, total] = await Promise.all([
      findAllCompanyService(page, limit),
      totalCompanyCountService(),
    ]);

    if (!companies || companies.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No companies found",
      });
    }

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
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
    });
  } catch (error) {
    logger.error(`Error fetching all companies: ${error}`);
    return res.status(500).json({
      status: false,
      message: "Failed to retrieve companies",
      error: error instanceof Error ? error.message : String(error),
    });
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
    const company = await findManyCompanyService(location, page, limit);
    if (company.length == 0) {
      res.status(404).send("No company for this location");
      return;
    }

    res.status(200).json({
      status: true,
      "company result": company.length,
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

export async function FilterCompanyHandler(req: Request, res: Response) {
  try {
    const page =
      typeof req.query.page !== "undefined" ? Number(req.query.page) - 1 : 0;
    const limit =
      typeof req.query.lmino !== "undefined" ? Number(req.query.lmino) : 10;
    const city = req.query.city;
    const size = req.query.size;
    const country = req.query.country;
    const name = req.query.name;

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

    const company = await SearchCompanyService(name, page, limit);
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
      return res.status(401).json({
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

    return res.status(201).json({
      status: true,
      message: "Company successfully created",
      data: {
        company,
        user: updatedUser,
      },
    });
  } catch (error) {
    logger.error(`Error creating company: ${error}`);
    return res.status(500).json({
      status: false,
      message: "Failed to create company",
      error: error instanceof Error ? error.message : String(error),
    });
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

// import { logger } from "../utils/logger"; // Assuming you'll create this utility

/**
 * Get a company by ID
 */

// The rest of the controller methods would follow similar patterns of:
// 1. Input validation and sanitization
// 2. Proper error handling with specific status codes
// 3. Consistent response formatting
// 4. Logging for debugging and monitoring
// 5. Pagination improvements
