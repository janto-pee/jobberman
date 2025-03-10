import { omit } from "lodash";
import { prisma } from "../scripts";
import { metadataInput } from "../schema/metadata.schema";

export async function findMetadataService(query: string) {
  const user = await prisma.metaData.findUnique({
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

export async function createMetadataService(input: metadataInput) {
  const user = await prisma.metaData.create({
    data: {
      ...input,
    },
  });
  return user;
}

export async function updateMetadataService(
  query: string,
  update: metadataInput
) {
  const updateUser = await prisma.metaData.update({
    where: {
      id: query,
    },
    data: {
      ...update,
    },
  });
  return updateUser;
}

export async function deleteMetadataService(query: string) {
  const deleteUser = await prisma.metaData.delete({
    where: {
      id: query,
    },
  });
  return deleteUser;
}
