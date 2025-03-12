import { omit } from "lodash";
import { prisma } from "../scripts";
import { fgsInput } from "../schema/fgs.schema";

export async function findFGSService(query: string) {
  const user = await prisma.fineGrainedSalaryInformation.findUnique({
    where: {
      id: query,
    },
  });
  return user;
}

export async function findAllFGSService(page: number, limit: number) {
  const FGS = await prisma.fineGrainedSalaryInformation.findMany({
    skip: page,
    take: limit,
  });
  return FGS;
}

export async function totalFGSCountService() {
  const FGS = await prisma.fineGrainedSalaryInformation.count();
  return FGS;
}

/**
 *
 * ! MUTATIONS
 *
 */

export async function createFGSService(input: fgsInput) {
  const user = await prisma.fineGrainedSalaryInformation.create({
    data: {
      ...input,
    },
  });
  return user;
}

export async function updateFGSService(query: string, update: fgsInput) {
  const updateUser = await prisma.fineGrainedSalaryInformation.update({
    where: {
      id: query,
    },
    data: {
      ...update,
    },
  });
  return updateUser;
}

export async function deleteFGSService(query: string) {
  const deleteUser = await prisma.fineGrainedSalaryInformation.delete({
    where: {
      id: query,
    },
  });
  return deleteUser;
}
