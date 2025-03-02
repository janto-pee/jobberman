import { omit } from "lodash";
import { prisma } from "../scripts";
import { jobInput } from "../schema/job.schema";

export async function createJobService(input: jobInput) {
  const user = await prisma.job.create({
    data: {
      ...input,
    },
  });
  return user;
}

export async function findJobService(query: string) {
  const user = await prisma.job.findUnique({
    where: {
      id: query,
    },
  });
  return user;
}

export async function updateJobService(query: string, update: jobInput) {
  const updateUser = await prisma.job.update({
    where: {
      id: query,
    },
    data: {
      ...update,
    },
  });
  return updateUser;
}

export async function deleteJobService(query: string) {
  const deleteUser = await prisma.job.delete({
    where: {
      id: query,
    },
  });
  return deleteUser;
}
