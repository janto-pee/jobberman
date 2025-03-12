import { omit } from "lodash";
import { prisma } from "../scripts";
import { hppInput } from "../schema/hpp.schema";

export async function findHPPService(query: string) {
  const user = await prisma.hasProbationaryPeriod.findUnique({
    where: {
      id: query,
    },
  });
  return user;
}

export async function findAllHPPService(page: number, limit: number) {
  const HPP = await prisma.hasProbationaryPeriod.findMany({
    skip: page,
    take: limit,
  });
  return HPP;
}

export async function totalHPPCountService() {
  const HPP = await prisma.hasProbationaryPeriod.count();
  return HPP;
}

/**
 *
 * ! MUTATIONS
 *
 */

export async function createHPPService(input: hppInput) {
  const user = await prisma.hasProbationaryPeriod.create({
    data: {
      ...input,
    },
  });
  return user;
}

export async function updateHPPService(query: string, update: hppInput) {
  const updateUser = await prisma.hasProbationaryPeriod.update({
    where: {
      id: query,
    },
    data: {
      ...update,
    },
  });
  return updateUser;
}

export async function deleteHPPService(query: string) {
  const deleteUser = await prisma.hasProbationaryPeriod.delete({
    where: {
      id: query,
    },
  });
  return deleteUser;
}
