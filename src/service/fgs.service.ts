import { prisma } from "../scripts";
import { Prisma } from "@prisma/client";
import { logger } from "../utils/logger";
import { fgsInput } from "../schema/fgs.schema";

/**
 * Find a taskBasedSalaryInformation by ID with related data
 * @param id - FGS ID
 * @returns FGS with address information
 */
export async function findFGSService(id: string) {
  try {
    if (!id) {
      throw new Error("FGS ID is required");
    }

    const taskBasedSalaryInformation =
      await prisma.fineGrainedSalaryInformation.findUnique({
        where: {
          id,
        },
      });

    return taskBasedSalaryInformation;
  } catch (error) {
    logger.error(`Error in findFGSService: ${error}`);
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
export async function findAllFGSService(
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
    const orderBy: Prisma.FineGrainedSalaryInformationOrderByWithRelationInput =
      {
        [actualSortField]: sortOrder,
      };

    const companies = await prisma.fineGrainedSalaryInformation.findMany({
      skip: page * limit,
      take: limit,
      orderBy,
    });

    return companies;
  } catch (error) {
    logger.error(`Error in findAllFGSService: ${error}`);
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
export async function findManyFGSService(
  location: string,
  page: number = 0,
  limit: number = 10
) {
  try {
    if (!location) {
      throw new Error("Location parameter is required");
    }

    const companies = await prisma.fineGrainedSalaryInformation.findMany({
      skip: page * limit,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
    });

    return companies;
  } catch (error) {
    logger.error(`Error in findManyFGSService: ${error}`);
    throw error;
  }
}

/**
 * Get total count of companies
 * @returns Total number of companies
 */
export async function totalFGSCountService() {
  try {
    const count = await prisma.fineGrainedSalaryInformation.count();
    return count;
  } catch (error) {
    logger.error(`Error in totalFGSCountService: ${error}`);
    throw error;
  }
}

/**
 * Create a new taskBasedSalaryInformation with address
 * @param input - FGS data including address
 * @returns Created taskBasedSalaryInformation with address
 */
export async function createFGSService(input: fgsInput) {
  try {
    // Validate required fields
    if (
      !input.workingHours ||
      !input.fixedOvertimePay ||
      !input.totalSalaryMinor
    ) {
      throw new Error("FGS name and email are required");
    }

    const createdFGS = await prisma.fineGrainedSalaryInformation.create({
      data: {
        ...input,
      },
    });

    logger.info(`FGS created successfully: ${createdFGS.id}`);
    return createdFGS;
  } catch (error) {
    logger.error(`Error in createFGSService: ${error}`);
    throw error;
  }
}

/**
 * Update taskBasedSalaryInformation information
 * @param id - FGS ID
 * @param update - Updated taskBasedSalaryInformation data
 * @returns Updated taskBasedSalaryInformation
 */
export async function updateFGSService(id: string, update: fgsInput) {
  try {
    if (!id) {
      throw new Error("FGS ID is required");
    }

    // Check if taskBasedSalaryInformation exists
    const existingFGS = await prisma.fineGrainedSalaryInformation.findUnique({
      where: { id },
    });

    if (!existingFGS) {
      throw new Error("FGS not found");
    }

    // Update taskBasedSalaryInformation
    const updatedFGS = await prisma.fineGrainedSalaryInformation.update({
      where: {
        id,
      },
      data: {
        ...update,
        updated_at: new Date(),
      },
    });

    logger.info(`FGS updated successfully: ${id}`);
    return updatedFGS;
  } catch (error) {
    logger.error(`Error in updateFGSService: ${error}`);
    throw error;
  }
}

/**
 * Delete a taskBasedSalaryInformation
 * @param id - FGS ID
 * @returns Deleted taskBasedSalaryInformation
 */
export async function deleteFGSService(id: string) {
  try {
    if (!id) {
      throw new Error("FGS ID is required");
    }

    // Check if taskBasedSalaryInformation exists
    const existingFGS = await prisma.fineGrainedSalaryInformation.findUnique({
      where: { id },
    });

    if (!existingFGS) {
      throw new Error("FGS not found");
    }

    // Use transaction to handle cascading deletes properly
    const deletedFGS = await prisma.fineGrainedSalaryInformation.delete({
      where: {
        id: id,
      },
    });

    logger.info(`FGS deleted successfully: ${id}`);
    return deletedFGS;
  } catch (error) {
    logger.error(`Error in deleteFGSService: ${error}`);
    throw error;
  }
}
