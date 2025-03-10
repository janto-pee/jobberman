import { omit } from "lodash";
import { prisma } from "../scripts";
import { userService } from "../schema/user.schema";
import { companyInput } from "../schema/company.schema";

export async function findCompanyService(query: string) {
  const user = await prisma.company.findUnique({
    where: {
      id: query,
    },
  });
  return user;
}

export async function findAllCompanyService(page: number, limit: number) {
  const company = await prisma.company.findMany({
    skip: page,
    take: limit,
  });
  return company;
}

export async function findManyCompanyService(
  searchParam: any,
  skip: number,
  limit: number
) {
  const companys = await prisma.company.findMany({
    where: {
      ...searchParam,
    },
    skip: skip,
    take: limit,
  });
  return companys;
}

export async function totalCompanyCountService() {
  const job = await prisma.company.count();
  return job;
}

/**
 *
 * MUTATION SERVICES
 *
 */

export async function createCompanyService(input: companyInput) {
  const user = await prisma.company.create({
    data: {
      ...input,
    },
  });
  return user;
}

export async function updateCompanyService(
  query: string,
  update: companyInput
) {
  const updateUser = await prisma.company.update({
    where: {
      id: query,
    },
    data: {
      ...update,
    },
  });
  return updateUser;
}

export async function deleteCompanyService(query: string) {
  const deleteUser = await prisma.company.delete({
    where: {
      id: query,
    },
  });
  return deleteUser;
}
