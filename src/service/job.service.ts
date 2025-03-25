import { prisma } from "../scripts";
import { jobInput, jobServiceInput } from "../schema/job.schema";

export async function findJobService(query: string) {
  const user = await prisma.job.findUnique({
    where: {
      id: query,
    },
  });
  return user;
}

export async function findAllJobsService(page: number, limit: number) {
  const jobs = await prisma.job.findMany({
    skip: page,
    take: limit,
  });
  return jobs;
}

export async function findManyJobsService(
  searchParam: any,
  skip: number,
  limit: number,
) {
  const jobs = await prisma.job.findMany({
    where: {
      ...searchParam,
    },
    skip: skip,
    take: limit,
  });
  return jobs;
}

export async function totalJobCountService() {
  const job = await prisma.job.count();
  return job;
}

export async function fiilterManyJobService(
  searchParam: any,
  skip: number,
  limit: number,
) {
  const companys = await prisma.job.findMany({
    where: {
      OR: [
        {
          title: {
            contains: searchParam.title,
          },
        },
        { qualification: { contains: searchParam.qualification } },
        { job_type: { contains: searchParam.job_type } },
        { visa_sponsorship: { contains: searchParam.visa_sponsorship } },
        { remote_posible: { contains: searchParam.remote_posible } },
        { location: { contains: searchParam.location } },
        { skills: { contains: searchParam.qualification } },
        {
          salary: {
            OR: [
              {
                currency: {
                  contains: searchParam.currency,
                },
              },
              { minimumMinor: { contains: searchParam.salary } },
            ],
          },
        },
      ],
    },
    include: {
      salary: true,
      metadata: true,
      hasProbationPeriod: true,
      company: true,
    },
    skip: skip,
    take: limit,
  });
  return companys;
}

export async function SearchJobService(
  title: any,
  skip: number,
  limit: number,
) {
  const jobs = await prisma.job.findMany({
    where: {
      title: {
        contains: title,
      },
    },
    skip: skip,
    take: limit,
  });
  return jobs;
}
export async function findJobLocationService(
  location: any,
  skip: number,
  limit: number,
) {
  const jobs = await prisma.job.findMany({
    where: {
      company: {
        OR: [
          {
            address: {
              OR: [
                {
                  city: {
                    contains: location,
                  },
                },
                { country: { contains: location } },
              ],
            },
          },
        ],
      },
    },
    include: {
      salary: true,
    },
    skip: skip,
    take: limit,
  });
  return jobs;
}

export async function findJobCompanyService(id: string, companyId: string) {
  const user = await prisma.job.findUnique({
    where: {
      id: id,
      company_id: companyId,
    },
  });

  return user;
}

/**
 *
 *
 * MUTATIONS END POINT
 * NOT EXPOSED
 *
 */

export async function createJobService(input: jobServiceInput) {
  const user = await prisma.job.create({
    data: {
      title: input.title,
      subtitle: input.subtitle,
      description: input.description,
      qualification: input.qualification,
      complimentary_qualification: input.complimentary_qualification,
      job_type: input.job_type,
      visa_sponsorship: input.visa_sponsorship,
      remote_posible: input.remote_posible,
      preferred_timezones: input.preferred_timezones,
      location: input.location,
      date_posted: input.date_posted,
      relocation: input.relocation,
      skills: input.skills,
      employer_hiring_contact: input.employer_hiring_contact,
      descriptionFormatting: input.descriptionFormatting,
      probationaryPeriod: input.probationaryPeriod,
      metadata: {
        create: {
          atsName: input.atsName,
          employersName: input.employersName,
        },
      },
      hasProbationPeriod: {
        create: {
          period: input.period,
          status: false,
        },
      },
      company: {
        connect: {
          id: input.company_id,
        },
      },
      salary: {
        create: {
          currency: input.currency,
          maximumMinor: input.maximumMinor,
          minimumMinor: input.minimumMinor,
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
      },
    },
    include: {
      company: true,
      metadata: true,
      salary: true,
      hasProbationPeriod: true,
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

// company_id: string,
export async function updateJobFkService(
  salaryId: string,
  metadataId: string,
  hppId: string,
  id: string,
  update: jobServiceInput,
) {
  const updateUser = await prisma.job.update({
    where: {
      id: id,
    },
    data: {
      company: {
        connect: {
          id: update.company_id,
        },
      },
      salary: {
        update: {
          where: {
            id: salaryId,
          },
          data: {
            currency: update.currency,
            maximumMinor: update.maximumMinor,
            minimumMinor: update.minimumMinor,
          },
        },
      },
      metadata: {
        update: {
          where: {
            id: metadataId,
          },
          data: {
            atsName: update.atsName,
            employersName: update.employersName,
          },
        },
      },
      hasProbationPeriod: {
        update: {
          where: {
            id: hppId,
          },
          data: {
            period: update.period,
            status: false,
          },
        },
      },
    },
    include: {
      company: true,
      salary: true,
      metadata: true,
      hasProbationPeriod: true,
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
