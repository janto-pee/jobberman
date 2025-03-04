import { omit } from "lodash";
import { prisma } from "../scripts";
import { userService } from "../schema/user.schema";
import { companyInput } from "../schema/company.schema";

export async function createCompanyService(input: companyInput) {
  const user = await prisma.company.create({
    data: {
      ...input,
    },
  });
  return user;
}

export async function findCompanyService(query: string) {
  const user = await prisma.company.findUnique({
    where: {
      id: query,
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
