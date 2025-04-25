import { Prisma } from "@prisma/client";
import { prisma } from "../scripts";
import { companyInput, companyUpdate } from "../schema/company.schema";
import { addressInput } from "../schema/address.schema";
import { logger } from "../utils/logger";

/**
 * Find a company by ID with related data
 * @param id - Company ID
 * @returns Company with address information
 */
export async function findCompanyService(id: string) {
  try {
    if (!id) {
      throw new Error("Company ID is required");
    }

    const company = await prisma.company.findUnique({
      where: {
        id,
      },
      include: {
        address: true,
        jobs: {
          take: 5,
          orderBy: {
            created_at: "desc",
          },
          select: {
            id: true,
            title: true,
            status: true,
            created_at: true,
          },
        },
        _count: {
          select: {
            jobs: true,
            users: true,
          },
        },
      },
    });

    return company;
  } catch (error) {
    logger.error(`Error in findCompanyService: ${error}`);
    throw error;
  }
}

/**
 * Find all companies with pagination and sorting
 * @param page - Page number (0-based)
 * @param limit - Number of items per page
 * @param sortBy - Field to sort by
 * @param sortOrder - Sort direction (asc/desc)
 * @returns Array of companies
 */
export async function findAllCompanyService(
  page: number = 0,
  limit: number = 10,
  sortBy: string = "created_at",
  sortOrder: "asc" | "desc" = "desc"
) {
  try {
    // Validate sort field to prevent injection
    const validSortFields = ["name", "created_at", "size", "email"];

    const actualSortField = validSortFields.includes(sortBy)
      ? sortBy
      : "created_at";

    // Create dynamic sort object
    const orderBy: Prisma.CompanyOrderByWithRelationInput = {
      [actualSortField]: sortOrder,
    };

    const companies = await prisma.company.findMany({
      skip: page * limit,
      take: limit,
      orderBy,
      include: {
        address: true,
        _count: {
          select: {
            jobs: true,
            users: true,
          },
        },
      },
    });

    return companies;
  } catch (error) {
    logger.error(`Error in findAllCompanyService: ${error}`);
    throw error;
  }
}

/**
 * Find companies by location with pagination
 * @param location - Location to search for
 * @param page - Page number (0-based)
 * @param limit - Number of items per page
 * @returns Array of companies matching the location
 */
export async function findManyCompanyService(
  location: string,
  page: number = 0,
  limit: number = 10
) {
  try {
    if (!location) {
      throw new Error("Location parameter is required");
    }

    const normalizedLocation = location.trim().toLowerCase();

    const companies = await prisma.company.findMany({
      where: {
        address: {
          OR: [
            {
              city: {
                contains: normalizedLocation,
                mode: "insensitive",
              },
            },
            {
              street: {
                contains: normalizedLocation,
                mode: "insensitive",
              },
            },
            {
              country: {
                contains: normalizedLocation,
                mode: "insensitive",
              },
            },
            {
              state_province_name: {
                contains: normalizedLocation,
                mode: "insensitive",
              },
            },
          ],
        },
      },
      include: {
        address: true,
        _count: {
          select: {
            jobs: true,
          },
        },
      },
      skip: page * limit,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
    });

    return companies;
  } catch (error) {
    logger.error(`Error in findManyCompanyService: ${error}`);
    throw error;
  }
}

/**
 * Filter companies by multiple criteria
 * @param searchParams - Object containing filter criteria
 * @param page - Page number (0-based)
 * @param limit - Number of items per page
 * @returns Array of filtered companies
 */
export async function fiilterManyCompanyService(
  searchParam: {
    city?: string | undefined;
    size?: string | undefined;
    country?: string | undefined;
    name?: string | undefined;
  },
  page: number = 0,
  limit: number = 10
) {
  try {
    // Build dynamic where clause based on provided parameters
    const whereClause: any = {
      AND: [],
    };

    if (searchParam.name) {
      whereClause.AND.push({
        name: {
          contains: searchParam.name,
          mode: "insensitive",
        },
      });
    }

    if (searchParam.size) {
      whereClause.AND.push({
        size: {
          contains: searchParam.size,
          mode: "insensitive",
        },
      });
    }

    if (searchParam.city || searchParam.country) {
      const addressConditions: Prisma.AddressWhereInput = { OR: [] };

      if (searchParam.city) {
        addressConditions.OR &&
          addressConditions.OR.push({
            city: {
              contains: searchParam.city,
              mode: "insensitive",
            },
          });
      }

      if (searchParam.country) {
        addressConditions.OR &&
          addressConditions.OR.push({
            country: {
              contains: searchParam.country,
              mode: "insensitive",
            },
          });
      }

      whereClause.AND.push({
        address: addressConditions,
      });
    }

    // If no filters were provided, remove the AND clause
    if (whereClause.AND.length === 0) {
      delete whereClause.AND;
    }

    const companies = await prisma.company.findMany({
      where: whereClause,
      include: {
        address: true,
        _count: {
          select: {
            jobs: true,
            users: true,
          },
        },
      },
      skip: page * limit,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
    });

    return companies;
  } catch (error) {
    logger.error(`Error in fiilterManyCompanyService: ${error}`);
    throw error;
  }
}

/**
 * Get total count of companies
 * @returns Total number of companies
 */
export async function totalCompanyCountService() {
  try {
    const count = await prisma.company.count();
    return count;
  } catch (error) {
    logger.error(`Error in totalCompanyCountService: ${error}`);
    throw error;
  }
}

/**
 * Search companies by name
 * @param name - Name to search for
 * @param page - Page number (0-based)
 * @param limit - Number of items per page
 * @returns Array of companies matching the search
 */
export async function SearchCompanyService(
  name: string | undefined,
  page: number = 0,
  limit: number = 10
) {
  try {
    if (!name) {
      throw new Error("Search name parameter is required");
    }

    const companies = await prisma.company.findMany({
      where: {
        OR: [
          {
            name: {
              contains: name,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: name,
              mode: "insensitive",
            },
          },
          {
            industry: {
              contains: name,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        address: true,
      },
      skip: page * limit,
      take: limit,
      orderBy: {
        name: "asc",
      },
    });

    return companies;
  } catch (error) {
    logger.error(`Error in SearchCompanyService: ${error}`);
    throw error;
  }
}

/**
 * Create a new company with address
 * @param input - Company data including address
 * @returns Created company with address
 */
export async function createCompanyService(input: companyInput) {
  try {
    // Validate required fields
    if (!input.name || !input.email) {
      throw new Error("Company name and email are required");
    }

    // Check if company with same email already exists
    const existingCompany = await prisma.company.findUnique({
      where: {
        email: input.email,
      },
    });

    if (existingCompany) {
      throw new Error("A company with this email already exists");
    }

    // Use transaction to ensure both company and address are created
    const company = await prisma.$transaction(async (tx) => {
      const createdCompany = await tx.company.create({
        data: {
          name: input.name,
          email: input.email,
          website: input.website,
          size: input.size,
          industry: input.industry,
          description: input.description,
          logo: input.logo,
          address: {
            create: {
              street: input.street,
              street2: input.street2 || null,
              city: input.city,
              state_province_code: input.state_province_code,
              state_province_name: input.state_province_name,
              postal_code: input.postal_code,
              country_code: input.country_code,
              latitude: input.latitude || null,
              longitude: input.longitude || null,
              country: input.country,
            },
          },
        },
        include: {
          address: true,
        },
      });

      return createdCompany;
    });

    logger.info(`Company created successfully: ${company.id}`);
    return company;
  } catch (error) {
    logger.error(`Error in createCompanyService: ${error}`);
    throw error;
  }
}

/**
 * Update company information
 * @param id - Company ID
 * @param update - Updated company data
 * @returns Updated company
 */
export async function updateCompanyService(id: string, update: companyUpdate) {
  try {
    if (!id) {
      throw new Error("Company ID is required");
    }

    // Check if company exists
    const existingCompany = await prisma.company.findUnique({
      where: { id },
    });

    if (!existingCompany) {
      throw new Error("Company not found");
    }

    // Update company
    const updatedCompany = await prisma.company.update({
      where: {
        id,
      },
      data: {
        ...update,
        updated_at: new Date(),
      },
      include: {
        address: true,
      },
    });

    logger.info(`Company updated successfully: ${id}`);
    return updatedCompany;
  } catch (error) {
    logger.error(`Error in updateCompanyService: ${error}`);
    throw error;
  }
}

/**
 * Update company address
 * @param companyId - Company ID
 * @param addressId - Address ID
 * @param update - Updated address data
 * @returns Updated company with address
 */
export async function updateCompanyAddressService(
  companyId: string,
  addressId: string,
  update: addressInput
) {
  try {
    if (!companyId || !addressId) {
      throw new Error("Company ID and Address ID are required");
    }

    // Use transaction to ensure data consistency
    const updatedCompany = await prisma.$transaction(async (tx) => {
      // Verify company exists and owns this address
      const company = await tx.company.findFirst({
        where: {
          id: companyId,
          address: {
            id: addressId,
          },
        },
      });

      if (!company) {
        throw new Error("Company not found or does not own this address");
      }

      // Update the company with the new address data
      return await tx.company.update({
        where: {
          id: companyId,
        },
        data: {
          updated_at: new Date(),
          address: {
            update: {
              where: {
                id: addressId,
              },
              data: {
                street: update.street,
                street2: update.street2 || null,
                city: update.city,
                state_province_code: update.state_province_code,
                state_province_name: update.state_province_name,
                postal_code: update.postal_code,
                country_code: update.country_code,
                latitude: update.latitude || null,
                longitude: update.longitude || null,
                country: update.country,
                updated_at: new Date(),
              },
            },
          },
        },
        include: {
          address: true,
        },
      });
    });

    logger.info(
      `Company address updated successfully: Company ${companyId}, Address ${addressId}`
    );
    return updatedCompany;
  } catch (error) {
    logger.error(`Error in updateCompanyAddressService: ${error}`);
    throw error;
  }
}

/**
 * Delete a company
 * @param id - Company ID
 * @returns Deleted company
 */
export async function deleteCompanyService(id: string) {
  try {
    if (!id) {
      throw new Error("Company ID is required");
    }

    // Check if company exists
    const existingCompany = await prisma.company.findUnique({
      where: { id },
      include: {
        jobs: true,
        users: true,
      },
    });

    if (!existingCompany) {
      throw new Error("Company not found");
    }

    // Use transaction to handle cascading deletes properly
    const deletedCompany = await prisma.$transaction(async (tx) => {
      // Update users to remove company association
      if (existingCompany.users.length > 0) {
        await tx.user.updateMany({
          where: {
            companyId: id,
          },
          data: {
            companyId: null,
          },
        });
      }

      // Delete jobs associated with the company
      if (existingCompany.jobs.length > 0) {
        await tx.job.deleteMany({
          where: {
            company_id: id,
          },
        });
      }

      // Delete the company and cascade to address
      const deleted = await tx.company.delete({
        where: {
          id,
        },
        include: {
          address: true,
        },
      });

      return deleted;
    });

    logger.info(`Company deleted successfully: ${id}`);
    return deletedCompany;
  } catch (error) {
    logger.error(`Error in deleteCompanyService: ${error}`);
    throw error;
  }
}

/**
 * Get company statistics
 * @returns Object with company statistics
 */
export async function getCompanyStatisticsService() {
  try {
    const [
      totalCompanies,
      companiesByIndustry,
      companiesBySize,
      companiesByCountry,
      recentlyAddedCompanies,
    ] = await Promise.all([
      prisma.company.count(),
      prisma.$queryRaw`
        SELECT industry, COUNT(*) as count 
        FROM "Company" 
        WHERE industry IS NOT NULL 
        GROUP BY industry 
        ORDER BY count DESC
      `,
      prisma.$queryRaw`
        SELECT size, COUNT(*) as count 
        FROM "Company" 
        WHERE size IS NOT NULL 
        GROUP BY size 
        ORDER BY count DESC
      `,
      prisma.$queryRaw`
        SELECT a.country, COUNT(*) as count 
        FROM "Company" c
        JOIN "Address" a ON c.id = a.company_id
        WHERE a.country IS NOT NULL 
        GROUP BY a.country 
        ORDER BY count DESC
        LIMIT 10
      `,
      prisma.company.findMany({
        take: 5,
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          name: true,
          industry: true,
          created_at: true,
          logo: true,
        },
      }),
    ]);

    return {
      totalCompanies,
      companiesByIndustry,
      companiesBySize,
      companiesByCountry,
      recentlyAddedCompanies,
    };
  } catch (error) {
    logger.error(`Error in getCompanyStatisticsService: ${error}`);
    throw error;
  }
}

/**
 * Get trending companies based on job postings and user interactions
 * @param limit - Number of trending companies to return
 * @returns Array of trending companies
 */
export async function getTrendingCompaniesService(limit: number = 5) {
  try {
    // Get companies with the most recent job postings
    const companies = await prisma.company.findMany({
      where: {
        jobs: {
          some: {
            created_at: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
        },
      },
      include: {
        address: true,
        _count: {
          select: {
            jobs: true,
            users: true,
          },
        },
        jobs: {
          take: 3,
          orderBy: {
            created_at: "desc",
          },
          select: {
            id: true,
            title: true,
            created_at: true,
          },
        },
      },
      orderBy: [
        {
          jobs: {
            _count: "desc",
          },
        },
        {
          users: {
            _count: "desc",
          },
        },
      ],
      take: limit,
    });

    return companies;
  } catch (error) {
    logger.error(`Error in getTrendingCompaniesService: ${error}`);
    throw error;
  }
}

/**
 * Verify a company
 * @param id - Company ID
 * @param verificationData - Verification data
 * @returns Updated company with verification status
 */
export async function verifyCompanyService(
  id: string,
  verificationData: {
    isVerified: boolean;
    verifiedBy?: string;
    verificationNotes?: string;
  }
) {
  try {
    if (!id) {
      throw new Error("Company ID is required");
    }

    // Check if company exists
    const existingCompany = await prisma.company.findUnique({
      where: { id },
    });

    if (!existingCompany) {
      throw new Error("Company not found");
    }

    // Update company verification status
    const updatedCompany = await prisma.company.update({
      where: {
        id,
      },
      data: {
        verified: verificationData.isVerified,
        // verified_by: verificationData.verifiedBy || null,
        // verification_notes: verificationData.verificationNotes || null,
        // verification_date: verificationData.isVerified ? new Date() : null,
        updated_at: new Date(),
      },
      include: {
        address: true,
      },
    });

    logger.info(
      `Company verification status updated: ${id}, isVerified: ${verificationData.isVerified}`
    );
    return updatedCompany;
  } catch (error) {
    logger.error(`Error in verifyCompanyService: ${error}`);
    throw error;
  }
}

/**
 * Get featured companies
 * @param limit - Number of featured companies to return
 * @returns Array of featured companies
 */
export async function getFeaturedCompaniesService(limit: number = 6) {
  try {
    // Get verified companies with the most jobs
    const companies = await prisma.company.findMany({
      where: {
        verified: true,
      },
      include: {
        address: true,
        _count: {
          select: {
            jobs: true,
          },
        },
      },
      orderBy: [
        {
          jobs: {
            _count: "desc",
          },
        },
      ],
      take: limit,
    });

    return companies;
  } catch (error) {
    logger.error(`Error in getFeaturedCompaniesService: ${error}`);
    throw error;
  }
}
