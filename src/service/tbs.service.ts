import { omit } from "lodash";
import { prisma } from "../scripts";
import { tbs } from "../schema/tbs.schema";

export async function findTBSService(query: string) {
  const user = await prisma.taskBasedSalaryInformation.findUnique({
    where: {
      id: query,
    },
  });
  return user;
}

export async function findAllTBSService(page: number, limit: number) {
  const TBS = await prisma.taskBasedSalaryInformation.findMany({
    skip: page,
    take: limit,
  });
  return TBS;
}

export async function totalTBSCountService() {
  const TBS = await prisma.taskBasedSalaryInformation.count();
  return TBS;
}

/**
 *
 * ! MUTATIONS
 *
 */

export async function createTBSService(input: tbs) {
  const user = await prisma.taskBasedSalaryInformation.create({
    data: {
      ...input,
    },
  });
  return user;
}

export async function updateTBSService(query: string, update: tbs) {
  const updateUser = await prisma.taskBasedSalaryInformation.update({
    where: {
      id: query,
    },
    data: {
      ...update,
    },
  });
  return updateUser;
}

export async function deleteTBSService(query: string) {
  const deleteUser = await prisma.taskBasedSalaryInformation.delete({
    where: {
      id: query,
    },
  });
  return deleteUser;
}
