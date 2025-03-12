import { omit } from "lodash";
import { prisma } from "../scripts";
import { userService } from "../schema/user.schema";
import { companyInput, companyUpdate } from "../schema/company.schema";
import { addressInput } from "../schema/address.schema";

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
  location: string,
  skip: number,
  limit: number
) {
  const companys = await prisma.company.findMany({
    where: {
      address: {
        is: {
          city: {
            contains: location,
          },
        },
      },
    },
    include: {
      address: true,
    },
    skip: skip,
    take: limit,
  });
  return companys;
}

export async function fiilterManyCompanyService(
  searchParam: any,
  skip: number,
  limit: number
) {
  const companys = await prisma.company.findMany({
    where: {
      OR: [
        {
          name: {
            contains: searchParam.name,
          },
        },
        { size: { contains: searchParam.size } },
        {
          address: {
            OR: [
              {
                city: {
                  contains: searchParam.city,
                },
              },
              { country: { contains: searchParam.country } },
            ],
          },
        },
      ],
    },
    include: {
      address: true,
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
  const company = await prisma.company.create({
    data: {
      name: input.name,
      email: input.email,
      website: input.website,
      size: input.size,
      address: {
        create: {
          street: input.street,
          street2: input.street2,
          city: input.city,
          state_province_code: input.state_province_code,
          state_province_name: input.state_province_name,
          postal_code: input.postal_code,
          country_code: input.country_code,
          latitude: input.longitude,
          longitude: input.latitude,
          country: input.country,
        },
      },
    },
    include: {
      address: true,
    },
  });
  return company;
}

export async function updateCompanyService(
  query: string,
  update: companyUpdate
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

export async function updateCompanyAddressService(
  companyId: string,
  addressId: string,
  update: addressInput
) {
  const updateUser = await prisma.company.update({
    where: {
      id: companyId,
    },
    data: {
      address: {
        update: {
          where: {
            id: addressId,
          },
          data: {
            street: update.street,
            street2: update.street2,
            city: update.city,
            state_province_code: update.state_province_code,
            state_province_name: update.state_province_name,
            postal_code: update.postal_code,
            country_code: update.country_code,
            latitude: update.longitude,
            longitude: update.latitude,
            country: update.country,
          },
        },
      },
    },
    include: {
      address: true,
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
