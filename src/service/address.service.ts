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
 * Find all address with pagination and sorting
 * @param page - Page number (0-based)
 * @param limit - Number of items per page
 * @param sortBy - Field to sort by
 * @param sortOrder - Sort direction (asc/desc)
 * @returns Array of address
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

    const address = await prisma.address.findMany({
      skip: page * limit,
      take: limit,
      orderBy,
      include: {
        user: true,
      },
    });

    return address;
  } catch (error) {
    logger.error(`Error in findAllAddressService: ${error}`);
    throw error;
  }
}

/**
 * Get total count of address
 * @returns Total number of address
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
 * Create a new address with address
 * @param input - Address data including address
 * @returns Created address with address
 */
export async function createAddressService(input: addressInput) {
  try {
    // Check if address with same email already exists
    // const existingAddress = await prisma.address.findUnique({
    //   where: {
    //     user: input.email,
    //   },
    // });

    // if (existingAddress) {
    //   throw new Error("A address with this email already exists");
    // }

    // Use transaction to ensure both address and address are created
    const address = await prisma.$transaction(async (tx) => {
      const createdAddress = await tx.address.create({
        data: {
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
export async function updateAddressService(id: string, update: addressInput) {
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
    });

    if (!existingAddress) {
      throw new Error("Address not found");
    }

    // Use transaction to handle cascading deletes properly
    const deletedAddress = await prisma.$transaction(async (tx) => {
      // Update users to remove address association
      if (existingAddress.id.length > 0) {
        await tx.user.updateMany({
          where: {
            addressId: id,
          },
          data: {
            addressId: null,
          },
        });
      }

      // Delete the address and cascade to address
      const deleted = await tx.address.delete({
        where: {
          id,
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

/**
 * Search addresses by various criteria
 * @param searchTerm - Text to search for in address fields
 * @param page - Page number (0-based)
 * @param limit - Number of items per page
 * @returns Array of matching addresses
 */
export async function searchAddressesService(
  searchTerm: string,
  page: number = 0,
  limit: number = 10
) {
  try {
    const searchQuery = searchTerm.trim();

    if (!searchQuery) {
      return findAllAddressService(page, limit);
    }

    const addresses = await prisma.address.findMany({
      where: {
        OR: [
          { street: { contains: searchQuery, mode: "insensitive" } },
          { city: { contains: searchQuery, mode: "insensitive" } },
          {
            state_province_name: { contains: searchQuery, mode: "insensitive" },
          },
          { postal_code: { contains: searchQuery, mode: "insensitive" } },
          { country: { contains: searchQuery, mode: "insensitive" } },
        ],
      },
      skip: page * limit,
      take: limit,
      include: {
        user: true,
      },
    });

    return addresses;
  } catch (error) {
    logger.error(`Error in searchAddressesService: ${error}`);
    throw error;
  }
}

/**
 * Get addresses by country
 * @param countryCode - Country code to filter by
 * @param page - Page number (0-based)
 * @param limit - Number of items per page
 * @returns Array of addresses in the specified country
 */
export async function getAddressesByCountryService(
  countryCode: string,
  page: number = 0,
  limit: number = 10
) {
  try {
    const addresses = await prisma.address.findMany({
      where: {
        country_code: countryCode,
      },
      skip: page * limit,
      take: limit,
      include: {
        user: true,
      },
    });

    return addresses;
  } catch (error) {
    logger.error(`Error in getAddressesByCountryService: ${error}`);
    throw error;
  }
}

/**
 * Validate address data
 * @param addressData - Address data to validate
 * @returns Validation result with errors if any
 */
export async function validateAddressService(addressData: addressInput) {
  try {
    const errors: Record<string, string> = {};

    // Basic validation
    if (!addressData.street || addressData.street.trim().length < 3) {
      errors.street =
        "Street address is required and must be at least 3 characters";
    }

    if (!addressData.city || addressData.city.trim().length < 2) {
      errors.city = "City is required and must be at least 2 characters";
    }

    if (
      !addressData.postal_code ||
      !/^[a-zA-Z0-9\s-]{3,10}$/.test(addressData.postal_code)
    ) {
      errors.postal_code = "Valid postal code is required";
    }

    if (!addressData.country || addressData.country.trim().length < 2) {
      errors.country = "Country is required";
    }

    if (
      !addressData.country_code ||
      !/^[A-Z]{2,3}$/.test(addressData.country_code)
    ) {
      errors.country_code =
        "Valid country code is required (2-3 uppercase letters)";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  } catch (error) {
    logger.error(`Error in validateAddressService: ${error}`);
    throw error;
  }
}

/**
 * Get address statistics
 * @returns Statistics about addresses in the system
 */
export async function getAddressStatisticsService() {
  try {
    const totalCount = await prisma.address.count();

    const countryStats = await prisma.$queryRaw`
      SELECT country, country_code, COUNT(*) as count 
      FROM "Address" 
      GROUP BY country, country_code 
      ORDER BY count DESC
    `;

    const stateStats = await prisma.$queryRaw`
      SELECT state_province_name, COUNT(*) as count 
      FROM "Address" 
      GROUP BY state_province_name 
      ORDER BY count DESC 
      LIMIT 10
    `;

    const cityStats = await prisma.$queryRaw`
      SELECT city, COUNT(*) as count 
      FROM "Address" 
      GROUP BY city 
      ORDER BY count DESC 
      LIMIT 10
    `;

    return {
      totalAddresses: totalCount,
      byCountry: countryStats,
      topStates: stateStats,
      topCities: cityStats,
    };
  } catch (error) {
    logger.error(`Error in getAddressStatisticsService: ${error}`);
    throw error;
  }
}
