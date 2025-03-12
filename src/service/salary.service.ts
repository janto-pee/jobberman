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
  const salary = await prisma.salary.create({
    data: {
      currency: input.currency,
      maximumMinor: input.maximumMinor,
      minimumMinor: input.minimumMinor,
      period: input.period,
      fineGrainedSalaryInformation: {
        create: {
          totalSalaryMinor: input.totalSalaryMinor,
          workingHours: input.workingHours,
          totalOvertimeHours: input.totalOvertimeHours,
          statutoryOvertimeHours: input.statutoryOvertimeHours,
          fixedOvertimeSalaryMinor: input.fixedOvertimeSalaryMinor,
          fixedOvertimePay: input.fixedOvertimePay,
        },
      },
      taskBasedSalaryInformation: {
        create: {
          taskLengthMinutes: input.taskLengthMinutes,
          taskDescription: input.taskDescription,
        },
      },
    },
  });
  return salary;
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

export async function updateSalaryFKService(
  id: string,
  fgsId: string,
  tbsId: string,
  update: salaryInput
) {
  const updateUser = await prisma.salary.update({
    where: {
      id: id,
    },
    data: {
      fineGrainedSalaryInformation: {
        update: {
          where: {
            id: fgsId,
          },
          data: {
            totalSalaryMinor: update.totalSalaryMinor,
            workingHours: update.workingHours,
            totalOvertimeHours: update.totalOvertimeHours,
            statutoryOvertimeHours: update.statutoryOvertimeHours,
            fixedOvertimeSalaryMinor: update.fixedOvertimeSalaryMinor,
            fixedOvertimePay: update.fixedOvertimePay,
          },
        },
      },
      taskBasedSalaryInformation: {
        update: {
          where: {
            id: tbsId,
          },
          data: {
            taskLengthMinutes: update.taskLengthMinutes,
            taskDescription: update.taskDescription,
          },
        },
      },
    },
    include: {
      fineGrainedSalaryInformation: true,
      taskBasedSalaryInformation: true,
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
