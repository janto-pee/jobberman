import { omit } from "lodash";
import { prisma } from "../scripts";
import { userService } from "../schema/user.schema";
import { comparePassword, hashPassword } from "../utils/hashPasword";

export async function createUserService(input: userService) {
  const newpassword = await hashPassword(input.hashed_password);
  const newPayload = omit(input, "confirm_password");
  const user = await prisma.user.create({
    data: {
      ...newPayload,
      hashed_password: newpassword,
    },
  });
  return user;
}

export async function findUserService(query: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: query,
    },
  });
  return user;
}

export async function findEmailService(query: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: query,
    },
  });
  return user;
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

export async function validateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user || user.hashed_password === null) return false;

  const match = await comparePassword(password, user.hashed_password);

  if (match) {
    return user;
  }

  return false;
}

// export async function updateUserService(query: string, update: any) {
//   const updateUser = await prisma.user.update({
//     where: {
//       username: query,
//     },
//     data: update,
//   });
//   return updateUser;
// }

// export async function deleteUserService(query: any) {
//   const deleteUser = await prisma.user.delete({
//     where: {
//       email: query,
//     },
//   });
//   return deleteUser;
// }
