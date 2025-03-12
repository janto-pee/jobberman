import { omit } from "lodash";
import { prisma } from "../scripts";
import { jobInput, jobQuery } from "../schema/job.schema";

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
  limit: number
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

/**
 *
 *
 * MUTATIONS END POINT
 * NOT EXPOSED
 *
 */

export async function createJobService(input: jobInput) {
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
        connectOrCreate: {
          where: {
            id: input.company_id,
          },
          create: {
            name: input.name,
            email: input.email,
            website: input.website,
            size: input.size,
            address: {
              create: {
                street: input.street,
                country: input.country,
              },
            },
          },
        },
      },
      salary: {
        create: {
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
      },
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

export async function updateJobFkService(
  companyId: string,
  salaryId: string,
  metadataId: string,
  hppId: string,
  id: string,
  update: jobInput
) {
  const updateUser = await prisma.job.update({
    where: {
      id: id,
    },
    data: {
      company: {
        update: {
          where: {
            id: companyId,
          },
          data: {
            name: update.name,
            email: update.email,
            website: update.website,
          },
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
            period: update.period,
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
