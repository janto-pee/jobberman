import { prisma } from "../scripts";
import { salaryInput } from "../schema/salary.schema";

export async function createSalaryService(input: salaryInput) {
  const user = await prisma.salary.create({
    data: {
      ...input,
    },
  });
  return user;
}

export async function findSalaryService(query: string) {
  const user = await prisma.salary.findUnique({
    where: {
      id: query,
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
