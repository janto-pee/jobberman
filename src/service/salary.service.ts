import { prisma } from "../scripts";
import { salaryInput } from "../schema/salary.schema";

export async function findSalaryService(query: string) {
  const salary = await prisma.salary.findUnique({
    where: {
      id: query,
    },
    include: {
      fineGrainedSalaryInformation: true,
      taskBasedSalaryInformation: true,
      job: true,
    },
  });
  return salary;
}

export async function findAllSalaryService(page: number, limit: number) {
  const salary = await prisma.salary.findMany({
    skip: page,
    take: limit,
    include: {
      fineGrainedSalaryInformation: true,
      taskBasedSalaryInformation: true,
      job: true,
    },
  });
  return salary;
}

export async function findManySalaryService(
  searchParam: any,
  page: number,
  limit: number
) {
  const salary = await prisma.salary.findMany({
    where: {
      ...searchParam,
    },
    skip: page,
    take: limit,
    include: {
      fineGrainedSalaryInformation: true,
      taskBasedSalaryInformation: true,
      job: true,
    },
  });
  return salary;
}

export async function totalSalaryCountService() {
  const job = await prisma.company.count();
  return job;
}

/**
 *
 * MUTATIONS
 *
 */

export async function createSalaryService(input: salaryInput) {
  const user = await prisma.salary.create({
    data: {
      ...input,
    },
  });
  return user;
}

export async function updateSalaryService(query: string, update: salaryInput) {
  const updateUser = await prisma.salary.update({
    where: {
      id: query,
    },
    data: {
      ...update,
    },
  });
  return updateUser;
}

export async function deleteSalaryService(query: string) {
  const deleteUser = await prisma.salary.delete({
    where: {
      id: query,
    },
  });
  return deleteUser;
}
