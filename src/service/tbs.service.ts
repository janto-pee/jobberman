import { prisma } from "../scripts";
import { tbs } from "../schema/tbs.schema";
import { Prisma } from "@prisma/client";
import { logger } from "../utils/logger";

/**
 * Find a taskBasedSalaryInformation by ID with related data
 * @param id - TBS ID
 * @returns TBS with address information
 */
export async function findTBSService(id: string) {
  try {
    if (!id) {
      throw new Error("TBS ID is required");
    }

    const taskBasedSalaryInformation =
      await prisma.taskBasedSalaryInformation.findUnique({
        where: {
          id,
        },
      });

    return taskBasedSalaryInformation;
  } catch (error) {
    logger.error(`Error in findTBSService: ${error}`);
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
export async function findAllTBSService(
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
    const orderBy: Prisma.TaskBasedSalaryInformationOrderByWithRelationInput = {
      [actualSortField]: sortOrder,
    };

    const companies = await prisma.taskBasedSalaryInformation.findMany({
      skip: page * limit,
      take: limit,
      orderBy,
    });

    return companies;
  } catch (error) {
    logger.error(`Error in findAllTBSService: ${error}`);
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
export async function findManyTBSService(
  location: string,
  page: number = 0,
  limit: number = 10
) {
  try {
    if (!location) {
      throw new Error("Location parameter is required");
    }

    const companies = await prisma.taskBasedSalaryInformation.findMany({
      skip: page * limit,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
    });

    return companies;
  } catch (error) {
    logger.error(`Error in findManyTBSService: ${error}`);
    throw error;
  }
}

/**
 * Get total count of companies
 * @returns Total number of companies
 */
export async function totalTBSCountService() {
  try {
    const count = await prisma.taskBasedSalaryInformation.count();
    return count;
  } catch (error) {
    logger.error(`Error in totalTBSCountService: ${error}`);
    throw error;
  }
}

/**
 * Create a new taskBasedSalaryInformation with address
 * @param input - TBS data including address
 * @returns Created taskBasedSalaryInformation with address
 */
export async function createTBSService(input: tbs) {
  try {
    // Validate required fields
    if (!input.taskDescription || !input.taskLengthMinutes) {
      throw new Error("TBS name and email are required");
    }

    const createdTBS = await prisma.taskBasedSalaryInformation.create({
      data: {
        ...input,
      },
    });

    logger.info(`TBS created successfully: ${createdTBS.id}`);
    return createdTBS;
  } catch (error) {
    logger.error(`Error in createTBSService: ${error}`);
    throw error;
  }
}

/**
 * Update taskBasedSalaryInformation information
 * @param id - TBS ID
 * @param update - Updated taskBasedSalaryInformation data
 * @returns Updated taskBasedSalaryInformation
 */
export async function updateTBSService(id: string, update: tbs) {
  try {
    if (!id) {
      throw new Error("TBS ID is required");
    }

    // Check if taskBasedSalaryInformation exists
    const existingTBS = await prisma.taskBasedSalaryInformation.findUnique({
      where: { id },
    });

    if (!existingTBS) {
      throw new Error("TBS not found");
    }

    // Update taskBasedSalaryInformation
    const updatedTBS = await prisma.taskBasedSalaryInformation.update({
      where: {
        id,
      },
      data: {
        ...update,
        updated_at: new Date(),
      },
    });

    logger.info(`TBS updated successfully: ${id}`);
    return updatedTBS;
  } catch (error) {
    logger.error(`Error in updateTBSService: ${error}`);
    throw error;
  }
}

/**
 * Delete a taskBasedSalaryInformation
 * @param id - TBS ID
 * @returns Deleted taskBasedSalaryInformation
 */
export async function deleteTBSService(id: string) {
  try {
    if (!id) {
      throw new Error("TBS ID is required");
    }

    // Check if taskBasedSalaryInformation exists
    const existingTBS = await prisma.taskBasedSalaryInformation.findUnique({
      where: { id },
    });

    if (!existingTBS) {
      throw new Error("TBS not found");
    }

    // Use transaction to handle cascading deletes properly
    const deletedTBS = await prisma.taskBasedSalaryInformation.delete({
      where: {
        id: id,
      },
    });

    logger.info(`TBS deleted successfully: ${id}`);
    return deletedTBS;
  } catch (error) {
    logger.error(`Error in deleteTBSService: ${error}`);
    throw error;
  }
}
