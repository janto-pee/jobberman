import { omit } from "lodash";
import { prisma } from "../scripts";
import { userService } from "../schema/user.schema";
import { comparePassword, hashPassword } from "../utils/hashPasword";
import { logger } from "../utils/logger";

/**
 * Find a user by ID
 * @param userId - The user's unique ID
 * @returns The user object or null if not found
 */
export async function findUserService(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        address: true,
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    logger.error(`Error finding user by ID ${userId}: ${error}`);
    throw error;
  }
}

/**
 * Validate user credentials
 * @param email - User's email
 * @param password - User's password
 * @returns User object if valid, false otherwise
 */
export async function validateUser(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        hashed_password: true,
        first_name: true,
        last_name: true,
        is_email_verified: true,
      },
    });

    if (!user || user.hashed_password === null) {
      logger.info(`Login attempt with invalid email: ${email}`);
      return false;
    }

    const match = await comparePassword(password, user.hashed_password);

    if (match) {
      logger.info(`User ${user.id} logged in successfully`);
      // Don't return the password hash to the controller
      return omit(user, ["hashed_password"]);
    }

    logger.info(`Failed login attempt for user: ${email}`);
    return false;
  } catch (error) {
    logger.error(`Error validating user ${email}: ${error}`);
    throw error;
  }
}

/**
 * Find a user by email
 * @param email - User's email address
 * @returns User object or null if not found
 */
export async function findEmailService(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        is_email_verified: true,
      },
    });

    return user;
  } catch (error) {
    logger.error(`Error finding user by email ${email}: ${error}`);
    throw error;
  }
}

/**
 *
 * ! MUTATIONS
 *
 */

/**
 * Create a new user with address
 * @param input - User data including address information
 * @returns Created user object
 */
export async function createUserService(input: userService) {
  try {
    const hashedPassword = await hashPassword(input.hashed_password);

    // Remove fields not needed in the user table
    const userPayload = omit(
      input,
      "confirm_password",
      "street",
      "country",
      "city",
      "state_province_code",
      "state_province_name",
      "postal_code",
      "country_code",
      "latitude",
      "longitude"
    );

    // Use a transaction to ensure both user and address are created
    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          ...userPayload,
          hashed_password: hashedPassword,
          address: {
            create: {
              street: input.street,
              country: input.country,
              city: input.city,
              state_province_code: input.state_province_code,
              state_province_name: input.state_province_name,
              postal_code: input.postal_code,
              country_code: input.country_code,
              latitude: input.longitude, // Fix the swapped coordinates
              longitude: input.latitude, // Fix the swapped coordinates
            },
          },
        },
        include: {
          address: true,
        },
      });

      return createdUser;
    });

    logger.info(`User created successfully: ${user.id}`);
    return omit(user, ["hashed_password"]); // Don't return password hash
  } catch (error) {
    logger.error(`Error creating user: ${error}`);
    throw error;
  }
}

/**
 * Associate a user with a company
 * @param userId - User ID
 * @param companyId - Company ID
 * @returns Updated user object
 */
export async function addUserToCompanyService(
  userId: string,
  companyId: string
) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { companyId },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        companyId: true,
      },
    });

    logger.info(`User ${userId} added to company ${companyId}`);
    return updatedUser;
  } catch (error) {
    logger.error(
      `Error adding user ${userId} to company ${companyId}: ${error}`
    );
    throw error;
  }
}
export async function verifyUserService(query: string) {
  const updateUser = await prisma.user.update({
    where: {
      id: query,
    },
    data: {
      is_email_verified: true,
    },
  });
  return updateUser;
}

export async function forgotUserService(query: string, update: string) {
  const updateUser = await prisma.user.update({
    where: {
      email: query,
    },
    data: {
      passwordResetCode: update,
    },
  });
  return updateUser;
}

export async function passwordResetService(query: string, update: string) {
  const newpassword = await hashPassword(update);
  const updateUser = await prisma.user.update({
    where: {
      id: query,
    },
    data: {
      hashed_password: newpassword,
      passwordResetCode: null,
    },
  });
  return updateUser;
}
export async function addUserToAddressService(id: string, addressId: string) {
  const updatedUser = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      addressId: addressId,
    },
  });
  return updatedUser;
}

// Other methods would follow similar patterns of:
// 1. Strong typing
// 2. Proper error handling
// 3. Logging
// 4. Data sanitization (not returning
