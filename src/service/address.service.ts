import { Prisma } from "@prisma/client";
import { prisma } from "../scripts";
import { addressInput } from "../schema/address.schema";
import { logger } from "../utils/logger";

/**
 * Find a address by ID with related data
 * @param id - Address ID
 * @returns Address with address information
 */
export async function findAddressService(id: string) {
  try {
    if (!id) {
      throw new Error("Address ID is required");
    }

    const address = await prisma.address.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });

    return address;
  } catch (error) {
    logger.error(`Error in findAddressService: ${error}`);
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
export async function findAllAddressService(
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
    const orderBy: Prisma.AddressOrderByWithRelationInput = {
      [actualSortField]: sortOrder,
    };

    const companies = await prisma.address.findMany({
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
    logger.error(`Error in findAllAddressService: ${error}`);
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
export async function findManyAddressService(
  location: string,
  page: number = 0,
  limit: number = 10
) {
  try {
    if (!location) {
      throw new Error("Location parameter is required");
    }

    const normalizedLocation = location.trim().toLowerCase();

    const companies = await prisma.address.findMany({
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
    logger.error(`Error in findManyAddressService: ${error}`);
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
export async function fiilterManyAddressService(
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

    const companies = await prisma.address.findMany({
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
    logger.error(`Error in fiilterManyAddressService: ${error}`);
    throw error;
  }
}

/**
 * Get total count of companies
 * @returns Total number of companies
 */
export async function totalAddressCountService() {
  try {
    const count = await prisma.address.count();
    return count;
  } catch (error) {
    logger.error(`Error in totalAddressCountService: ${error}`);
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
export async function SearchAddressService(
  name: string | undefined,
  page: number = 0,
  limit: number = 10
) {
  try {
    if (!name) {
      throw new Error("Search name parameter is required");
    }

    const companies = await prisma.address.findMany({
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
    logger.error(`Error in SearchAddressService: ${error}`);
    throw error;
  }
}

/**
 * Create a new address with address
 * @param input - Address data including address
 * @returns Created address with address
 */
export async function createAddressService(input: addressInput) {
  try {
    // Validate required fields
    if (!input.name || !input.email) {
      throw new Error("Address name and email are required");
    }

    // Check if address with same email already exists
    const existingAddress = await prisma.address.findUnique({
      where: {
        email: input.email,
      },
    });

    if (existingAddress) {
      throw new Error("A address with this email already exists");
    }

    // Use transaction to ensure both address and address are created
    const address = await prisma.$transaction(async (tx) => {
      const createdAddress = await tx.address.create({
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

      return createdAddress;
    });

    logger.info(`Address created successfully: ${address.id}`);
    return address;
  } catch (error) {
    logger.error(`Error in createAddressService: ${error}`);
    throw error;
  }
}

/**
 * Update address information
 * @param id - Address ID
 * @param update - Updated address data
 * @returns Updated address
 */
export async function updateAddressService(id: string, update: addressUpdate) {
  try {
    if (!id) {
      throw new Error("Address ID is required");
    }

    // Check if address exists
    const existingAddress = await prisma.address.findUnique({
      where: { id },
    });

    if (!existingAddress) {
      throw new Error("Address not found");
    }

    // Update address
    const updatedAddress = await prisma.address.update({
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

    logger.info(`Address updated successfully: ${id}`);
    return updatedAddress;
  } catch (error) {
    logger.error(`Error in updateAddressService: ${error}`);
    throw error;
  }
}

/**
 * Update address address
 * @param addressId - Address ID
 * @param addressId - Address ID
 * @param update - Updated address data
 * @returns Updated address with address
 */
export async function updateAddressAddressService(
  addressId: string,
  addressId: string,
  update: addressInput
) {
  try {
    if (!addressId || !addressId) {
      throw new Error("Address ID and Address ID are required");
    }

    // Use transaction to ensure data consistency
    const updatedAddress = await prisma.$transaction(async (tx) => {
      // Verify address exists and owns this address
      const address = await tx.address.findFirst({
        where: {
          id: addressId,
          address: {
            id: addressId,
          },
        },
      });

      if (!address) {
        throw new Error("Address not found or does not own this address");
      }

      // Update the address with the new address data
      return await tx.address.update({
        where: {
          id: addressId,
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
      `Address address updated successfully: Address ${addressId}, Address ${addressId}`
    );
    return updatedAddress;
  } catch (error) {
    logger.error(`Error in updateAddressAddressService: ${error}`);
    throw error;
  }
}

/**
 * Delete a address
 * @param id - Address ID
 * @returns Deleted address
 */
export async function deleteAddressService(id: string) {
  try {
    if (!id) {
      throw new Error("Address ID is required");
    }

    // Check if address exists
    const existingAddress = await prisma.address.findUnique({
      where: { id },
      include: {
        jobs: true,
        users: true,
      },
    });

    if (!existingAddress) {
      throw new Error("Address not found");
    }

    // Use transaction to handle cascading deletes properly
    const deletedAddress = await prisma.$transaction(async (tx) => {
      // Update users to remove address association
      if (existingAddress.users.length > 0) {
        await tx.user.updateMany({
          where: {
            addressId: id,
          },
          data: {
            addressId: null,
          },
        });
      }

      // Delete jobs associated with the address
      if (existingAddress.jobs.length > 0) {
        await tx.job.deleteMany({
          where: {
            address_id: id,
          },
        });
      }

      // Delete the address and cascade to address
      const deleted = await tx.address.delete({
        where: {
          id,
        },
        include: {
          address: true,
        },
      });

      return deleted;
    });

    logger.info(`Address deleted successfully: ${id}`);
    return deletedAddress;
  } catch (error) {
    logger.error(`Error in deleteAddressService: ${error}`);
    throw error;
  }
}

// import { prisma } from "../scripts";
// import { addressInput } from "../schema/address.schema";

// export async function findAddressService(query: string) {
//   const user = await prisma.address.findUnique({
//     where: {
//       id: query,
//     },
//   });
//   return user;
// }

// export async function findAllAddressService(page: number, limit: number) {
//   const address = await prisma.address.findMany({
//     skip: page,
//     take: limit,
//   });
//   return address;
// }

// export async function totalAddressCountService() {
//   const address = await prisma.address.count();
//   return address;
// }

// /**
//  *
//  * ! MUTATIONS
//  *
//  */
// export async function createAddressService(input: addressInput) {
//   const user = await prisma.address.create({
//     data: {
//       ...input,
//     },
//   });
//   return user;
// }

// export async function updateAddressService(
//   query: string,
//   update: addressInput,
// ) {
//   const updateUser = await prisma.address.update({
//     where: {
//       id: query,
//     },
//     data: {
//       ...update,
//     },
//   });
//   return updateUser;
// }

// export async function deleteAddressService(query: string) {
//   const deleteUser = await prisma.address.delete({
//     where: {
//       id: query,
//     },
//   });
//   return deleteUser;
// }
