import { Prisma } from "@prisma/client";
import { prisma } from "../scripts";
import { salaryInput } from "../schema/salary.schema";
import { logger } from "../utils/logger";

/**
 * Find a salary by ID with related data
 * @param id - Salary ID
 * @returns Salary with fineGrainedSalaryInformation information
 */
export async function findSalaryService(id: string) {
  try {
    if (!id) {
      throw new Error("Salary ID is required");
    }

    const salary = await prisma.salary.findUnique({
      where: {
        id,
      },
      include: {
        fineGrainedSalaryInformation: true,
        taskBasedSalaryInformation: true,
      },
    });

    return salary;
  } catch (error) {
    logger.error(`Error in findSalaryService: ${error}`);
    throw error;
  }
}

/**
 * Find all salaries with pagination and sorting
 * @param page - Page number (0-based)
 * @param limit - Number of items per page
 * @param sortBy - Field to sort by
 * @param sortOrder - Sort direction (asc/desc)
 * @returns Array of salaries
 */
export async function findAllSalaryService(
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
    const orderBy: Prisma.SalaryOrderByWithRelationInput = {
      [actualSortField]: sortOrder,
    };

    const salaries = await prisma.salary.findMany({
      skip: page * limit,
      take: limit,
      orderBy,
      include: {
        fineGrainedSalaryInformation: true,
        // _count: {
        //   select: {
        //     jobs: true,
        //     users: true,
        //   },
        // },
      },
    });

    return salaries;
  } catch (error) {
    logger.error(`Error in findAllSalaryService: ${error}`);
    throw error;
  }
}

/**
 * Find salaries by location with pagination
 * @param location - Location to search for
 * @param page - Page number (0-based)
 * @param limit - Number of items per page
 * @returns Array of salaries matching the location
 */
export async function findManySalaryService(
  location: string,
  page: number = 0,
  limit: number = 10
) {
  try {
    if (!location) {
      throw new Error("Location parameter is required");
    }

    const normalizedLocation = location.trim().toLowerCase();

    const salaries = await prisma.salary.findMany({
      where: {
        fineGrainedSalaryInformation: {
          OR: [
            {
              id: {
                contains: normalizedLocation,
                mode: "insensitive",
              },
            },
          ],
        },
      },
      include: {
        fineGrainedSalaryInformation: true,
      },
      skip: page * limit,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
    });

    return salaries;
  } catch (error) {
    logger.error(`Error in findManySalaryService: ${error}`);
    throw error;
  }
}

/**
 * Filter salaries by multiple criteria
 * @param searchParams - Object containing filter criteria
 * @param page - Page number (0-based)
 * @param limit - Number of items per page
 * @returns Array of filtered salaries
 */
export async function fiilterManySalaryService(
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
      const fineGrainedSalaryInformationConditions: Prisma.AddressWhereInput = {
        OR: [],
      };

      if (searchParam.city) {
        fineGrainedSalaryInformationConditions.OR &&
          fineGrainedSalaryInformationConditions.OR.push({
            city: {
              contains: searchParam.city,
              mode: "insensitive",
            },
          });
      }

      if (searchParam.country) {
        fineGrainedSalaryInformationConditions.OR &&
          fineGrainedSalaryInformationConditions.OR.push({
            country: {
              contains: searchParam.country,
              mode: "insensitive",
            },
          });
      }

      whereClause.AND.push({
        fineGrainedSalaryInformation: fineGrainedSalaryInformationConditions,
      });
    }

    // If no filters were provided, remove the AND clause
    if (whereClause.AND.length === 0) {
      delete whereClause.AND;
    }

    const salaries = await prisma.salary.findMany({
      where: whereClause,
      include: {
        fineGrainedSalaryInformation: true,
        taskBasedSalaryInformation: true,
      },
      skip: page * limit,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
    });

    return salaries;
  } catch (error) {
    logger.error(`Error in fiilterManySalaryService: ${error}`);
    throw error;
  }
}

/**
 * Get total count of salaries
 * @returns Total number of salaries
 */
export async function totalSalaryCountService() {
  try {
    const count = await prisma.salary.count();
    return count;
  } catch (error) {
    logger.error(`Error in totalSalaryCountService: ${error}`);
    throw error;
  }
}

/**
 * Search salaries by name
 * @param name - Name to search for
 * @param page - Page number (0-based)
 * @param limit - Number of items per page
 * @returns Array of salaries matching the search
 */
export async function SearchSalaryService(
  name: string | undefined,
  page: number = 0,
  limit: number = 10
) {
  try {
    if (!name) {
      throw new Error("Search name parameter is required");
    }

    const salaries = await prisma.salary.findMany({
      where: {
        OR: [
          {
            currency: {
              contains: name,
              mode: "insensitive",
            },
          },
          {
            maximumMinor: {
              contains: name,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        fineGrainedSalaryInformation: true,
      },
      skip: page * limit,
      take: limit,
      orderBy: {
        currency: "asc",
      },
    });

    return salaries;
  } catch (error) {
    logger.error(`Error in SearchSalaryService: ${error}`);
    throw error;
  }
}

/**
 * Create a new salary with fineGrainedSalaryInformation
 * @param input - Salary data including fineGrainedSalaryInformation
 * @returns Created salary with fineGrainedSalaryInformation
 */
export async function createSalaryService(input: salaryInput) {
  try {
    // Validate required fields
    if (!input.currency || !input.maximumMinor || input.totalSalaryMinor) {
      throw new Error("Salary name and email are required");
    }

    // Use transaction to ensure both salary and fineGrainedSalaryInformation are created
    const salary = await prisma.$transaction(async (tx) => {
      const createdSalary = await tx.salary.create({
        data: {
          currency: input.currency,
          maximumMinor: input.maximumMinor,
          minimumMinor: input.minimumMinor,
          fineGrainedSalaryInformation: {
            create: {
              totalSalaryMinor: input.totalSalaryMinor,
              workingHours: input.workingHours,
            },
          },
          taskBasedSalaryInformation: {
            create: {
              taskLengthMinutes: input.taskLengthMinutes,
              ratePerTask: input.ratePerTask,
            },
          },
        },
      });

      return createdSalary;
    });

    logger.info(`Salary created successfully: ${salary.id}`);
    return salary;
  } catch (error) {
    logger.error(`Error in createSalaryService: ${error}`);
    throw error;
  }
}

/**
 * Update salary information
 * @param id - Salary ID
 * @param update - Updated salary data
 * @returns Updated salary
 */
export async function updateSalaryService(id: string, update: salaryInput) {
  try {
    if (!id) {
      throw new Error("Salary ID is required");
    }

    // Check if salary exists
    const existingSalary = await prisma.salary.findUnique({
      where: { id },
    });

    if (!existingSalary) {
      throw new Error("Salary not found");
    }

    // Update salary
    const updatedSalary = await prisma.salary.update({
      where: {
        id,
      },
      data: {
        ...update,
        updated_at: new Date(),
      },
      include: {
        fineGrainedSalaryInformation: true,
        taskBasedSalaryInformation: true,
      },
    });

    logger.info(`Salary updated successfully: ${id}`);
    return updatedSalary;
  } catch (error) {
    logger.error(`Error in updateSalaryService: ${error}`);
    throw error;
  }
}

/**
 * Delete a salary
 * @param id - Salary ID
 * @returns Deleted salary
 */
export async function deleteSalaryService(id: string) {
  try {
    if (!id) {
      throw new Error("Salary ID is required");
    }

    // Check if salary exists
    const existingSalary = await prisma.salary.findUnique({
      where: { id },
    });

    if (!existingSalary) {
      throw new Error("Salary not found");
    }

    // Use transaction to handle cascading deletes properly
    const deletedSalary = await prisma.$transaction(async (tx) => {
      // Update users to remove salary association
      if (existingSalary.id.length > 0) {
        await tx.job.updateMany({
          where: {
            salaryId: id,
          },
          data: {
            salaryId: null,
          },
        });
      }

      // Delete jobs associated with the salary
      if (existingSalary.id.length > 0) {
        await tx.job.deleteMany({
          where: {
            salaryId: id,
          },
        });
      }

      // Delete the salary and cascade to fineGrainedSalaryInformation
      const deleted = await tx.salary.delete({
        where: {
          id,
        },
        include: {
          fineGrainedSalaryInformation: true,
        },
      });

      return deleted;
    });

    logger.info(`Salary deleted successfully: ${id}`);
    return deletedSalary;
  } catch (error) {
    logger.error(`Error in deleteSalaryService: ${error}`);
    throw error;
  }
}

/**
 * Get salary statistics
 * @returns Object with salary statistics
 */
export async function getSalaryStatisticsService() {
  try {
    const [
      totalCompanies,
      salariesByIndustry,
      salariesBySize,
      salariesByCountry,
      recentlyAddedCompanies,
    ] = await Promise.all([
      prisma.salary.count(),
      prisma.$queryRaw`
        SELECT industry, COUNT(*) as count 
        FROM "Salary" 
        WHERE industry IS NOT NULL 
        GROUP BY industry 
        ORDER BY count DESC
      `,
      prisma.$queryRaw`
        SELECT size, COUNT(*) as count 
        FROM "Salary" 
        WHERE size IS NOT NULL 
        GROUP BY size 
        ORDER BY count DESC
      `,
      prisma.$queryRaw`
        SELECT a.country, COUNT(*) as count 
        FROM "Salary" c
        JOIN "Address" a ON c.id = a.salary_id
        WHERE a.country IS NOT NULL 
        GROUP BY a.country 
        ORDER BY count DESC
        LIMIT 10
      `,
      prisma.salary.findMany({
        take: 5,
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          currency: true,
          created_at: true,
        },
      }),
    ]);

    return {
      totalCompanies,
      salariesByIndustry,
      salariesBySize,
      salariesByCountry,
      recentlyAddedCompanies,
    };
  } catch (error) {
    logger.error(`Error in getSalaryStatisticsService: ${error}`);
    throw error;
  }
}
