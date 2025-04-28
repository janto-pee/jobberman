import { prisma } from "../scripts";
import { Prisma } from "@prisma/client";
import { logger } from "../utils/logger";
import { hppInput } from "../schema/hpp.schema";

/**
 * Find a taskBasedSalaryInformation by ID with related data
 * @param id - HPP ID
 * @returns HPP with address information
 */
export async function findHPPService(id: string) {
  try {
    if (!id) {
      throw new Error("HPP ID is required");
    }

    const taskBasedSalaryInformation =
      await prisma.hasProbationaryPeriod.findUnique({
        where: {
          id,
        },
      });

    return taskBasedSalaryInformation;
  } catch (error) {
    logger.error(`Error in findHPPService: ${error}`);
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
export async function findAllHPPService(
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
    const orderBy: Prisma.HasProbationaryPeriodOrderByWithRelationInput = {
      [actualSortField]: sortOrder,
    };

    const companies = await prisma.hasProbationaryPeriod.findMany({
      skip: page * limit,
      take: limit,
      orderBy,
    });

    return companies;
  } catch (error) {
    logger.error(`Error in findAllHPPService: ${error}`);
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
export async function findManyHPPService(
  location: string,
  page: number = 0,
  limit: number = 10
) {
  try {
    if (!location) {
      throw new Error("Location parameter is required");
    }

    const companies = await prisma.hasProbationaryPeriod.findMany({
      skip: page * limit,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
    });

    return companies;
  } catch (error) {
    logger.error(`Error in findManyHPPService: ${error}`);
    throw error;
  }
}

/**
 * Get total count of companies
 * @returns Total number of companies
 */
export async function totalHPPCountService() {
  try {
    const count = await prisma.hasProbationaryPeriod.count();
    return count;
  } catch (error) {
    logger.error(`Error in totalHPPCountService: ${error}`);
    throw error;
  }
}

/**
 * Create a new taskBasedSalaryInformation with address
 * @param input - HPP data including address
 * @returns Created taskBasedSalaryInformation with address
 */
export async function createHPPService(input: hppInput) {
  try {
    // Validate required fields
    if (!input.period) {
      throw new Error("HPP name and email are required");
    }

    const createdHPP = await prisma.hasProbationaryPeriod.create({
      data: {
        ...input,
      },
    });

    logger.info(`HPP created successfully: ${createdHPP.id}`);
    return createdHPP;
  } catch (error) {
    logger.error(`Error in createHPPService: ${error}`);
    throw error;
  }
}

/**
 * Update taskBasedSalaryInformation information
 * @param id - HPP ID
 * @param update - Updated taskBasedSalaryInformation data
 * @returns Updated taskBasedSalaryInformation
 */
export async function updateHPPService(id: string, update: hppInput) {
  try {
    if (!id) {
      throw new Error("HPP ID is required");
    }

    // Check if taskBasedSalaryInformation exists
    const existingHPP = await prisma.hasProbationaryPeriod.findUnique({
      where: { id },
    });

    if (!existingHPP) {
      throw new Error("HPP not found");
    }

    // Update taskBasedSalaryInformation
    const updatedHPP = await prisma.hasProbationaryPeriod.update({
      where: {
        id,
      },
      data: {
        ...update,
        updated_at: new Date(),
      },
    });

    logger.info(`HPP updated successfully: ${id}`);
    return updatedHPP;
  } catch (error) {
    logger.error(`Error in updateHPPService: ${error}`);
    throw error;
  }
}

/**
 * Delete a taskBasedSalaryInformation
 * @param id - HPP ID
 * @returns Deleted taskBasedSalaryInformation
 */
export async function deleteHPPService(id: string) {
  try {
    if (!id) {
      throw new Error("HPP ID is required");
    }

    // Check if taskBasedSalaryInformation exists
    const existingHPP = await prisma.hasProbationaryPeriod.findUnique({
      where: { id },
    });

    if (!existingHPP) {
      throw new Error("HPP not found");
    }

    // Use transaction to handle cascading deletes properly
    const deletedHPP = await prisma.hasProbationaryPeriod.delete({
      where: {
        id: id,
      },
    });

    logger.info(`HPP deleted successfully: ${id}`);
    return deletedHPP;
  } catch (error) {
    logger.error(`Error in deleteHPPService: ${error}`);
    throw error;
  }
}
