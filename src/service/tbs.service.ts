import { prisma } from "../scripts";
import { tbs } from "../schema/tbs.schema";
import { Prisma } from "@prisma/client";
import { addressInput } from "../schema/address.schema";
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
export async function updateTBSService(id: string, update: companyUpdate) {
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
      include: {
        address: true,
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
 * Update taskBasedSalaryInformation address
 * @param companyId - TBS ID
 * @param addressId - Address ID
 * @param update - Updated address data
 * @returns Updated taskBasedSalaryInformation with address
 */
export async function updateTBSAddressService(
  companyId: string,
  addressId: string,
  update: addressInput
) {
  try {
    if (!companyId || !addressId) {
      throw new Error("TBS ID and Address ID are required");
    }

    // Use transaction to ensure data consistency
    const updatedTBS = await prisma.$transaction(async (tx) => {
      // Verify taskBasedSalaryInformation exists and owns this address
      const taskBasedSalaryInformation =
        await tx.taskBasedSalaryInformation.findFirst({
          where: {
            id: companyId,
            address: {
              id: addressId,
            },
          },
        });

      if (!taskBasedSalaryInformation) {
        throw new Error("TBS not found or does not own this address");
      }

      // Update the taskBasedSalaryInformation with the new address data
      return await tx.taskBasedSalaryInformation.update({
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
      `TBS address updated successfully: TBS ${companyId}, Address ${addressId}`
    );
    return updatedTBS;
  } catch (error) {
    logger.error(`Error in updateTBSAddressService: ${error}`);
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
      include: {
        jobs: true,
        users: true,
      },
    });

    if (!existingTBS) {
      throw new Error("TBS not found");
    }

    // Use transaction to handle cascading deletes properly
    const deletedTBS = await prisma.$transaction(async (tx) => {
      // Update users to remove taskBasedSalaryInformation association
      if (existingTBS.users.length > 0) {
        await tx.user.updateMany({
          where: {
            companyId: id,
          },
          data: {
            companyId: null,
          },
        });
      }

      // Delete jobs associated with the taskBasedSalaryInformation
      if (existingTBS.jobs.length > 0) {
        await tx.job.deleteMany({
          where: {
            company_id: id,
          },
        });
      }

      // Delete the taskBasedSalaryInformation and cascade to address
      const deleted = await tx.taskBasedSalaryInformation.delete({
        where: {
          id,
        },
        include: {
          address: true,
        },
      });

      return deleted;
    });

    logger.info(`TBS deleted successfully: ${id}`);
    return deletedTBS;
  } catch (error) {
    logger.error(`Error in deleteTBSService: ${error}`);
    throw error;
  }
}

// export async function findTBSService(query: string) {
//   const user = await prisma.taskBasedSalaryInformation.findUnique({
//     where: {
//       id: query,
//     },
//   });
//   return user;
// }

// export async function findAllTBSService(page: number, limit: number) {
//   const TBS = await prisma.taskBasedSalaryInformation.findMany({
//     skip: page,
//     take: limit,
//   });
//   return TBS;
// }

// export async function totalTBSCountService() {
//   const TBS = await prisma.taskBasedSalaryInformation.count();
//   return TBS;
// }

// /**
//  *
//  * ! MUTATIONS
//  *
//  */

// export async function createTBSService(input: tbs) {
//   const user = await prisma.taskBasedSalaryInformation.create({
//     data: {
//       ...input,
//     },
//   });
//   return user;
// }

// export async function updateTBSService(query: string, update: tbs) {
//   const updateUser = await prisma.taskBasedSalaryInformation.update({
//     where: {
//       id: query,
//     },
//     data: {
//       ...update,
//     },
//   });
//   return updateUser;
// }

// export async function deleteTBSService(query: string) {
//   const deleteUser = await prisma.taskBasedSalaryInformation.delete({
//     where: {
//       id: query,
//     },
//   });
//   return deleteUser;
// }
