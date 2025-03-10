import { prisma } from "../scripts";
import { addressInput } from "../schema/address.schema";

export async function findAddressService(query: string) {
  const user = await prisma.address.findUnique({
    where: {
      id: query,
    },
  });
  return user;
}

/**
 *
 * ! MUTATIONS
 *
 */
export async function createAddressService(input: addressInput) {
  const user = await prisma.address.create({
    data: {
      ...input,
    },
  });
  return user;
}

export async function updateAddressService(
  query: string,
  update: addressInput
) {
  const updateUser = await prisma.address.update({
    where: {
      id: query,
    },
    data: {
      ...update,
    },
  });
  return updateUser;
}

export async function deleteAddressService(query: string) {
  const deleteUser = await prisma.address.delete({
    where: {
      id: query,
    },
  });
  return deleteUser;
}
