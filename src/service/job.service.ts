import { prisma } from "../scripts";
import { jobInput, jobServiceInput } from "../schema/job.schema";
import { Prisma } from "@prisma/client";

/**
 * Find a single job by ID
 * @param query Job ID
 * @returns Job or null if not found
 */
export async function findJobService(query: string) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: query },
      include: {
        salary: true,
        metadata: true,
        hasProbationPeriod: true,
        company: {
          include: {
            address: true,
          },
        },
      },
    });
    return job;
  } catch (error: any) {
    throw new Error(`Error finding job: ${error.message}`);
  }
}

/**
 * Find all jobs with pagination
 * @param page Page number (0-indexed)
 * @param limit Number of items per page
 * @returns Array of jobs
 */
export async function findAllJobsService(page: number, limit: number) {
  try {
    const jobs = await prisma.job.findMany({
      skip: page * limit,
      take: limit,
      include: {
        salary: true,
        company: {
          select: {
            name: true,
            logo: true,
            address: true,
          },
        },
      },
      orderBy: {
        date_posted: "desc",
      },
    });
    return jobs;
  } catch (error: any) {
    throw new Error(`Error finding all jobs: ${error.message}`);
  }
}

/**
 * Find jobs by search parameters with pagination
 * @param searchParam Object containing search criteria
 * @param skip Number of items to skip
 * @param limit Number of items per page
 * @returns Array of jobs matching criteria
 */
export async function findManyJobsService(
  searchParam: any,
  skip: number,
  limit: number
) {
  try {
    // Filter out undefined or null values from searchParam
    const filteredParams = Object.entries(searchParam)
      .filter(([_, value]) => value !== undefined && value !== null)
      .reduce((acc, [key, value]) => {
        acc[key] = { contains: value, mode: "insensitive" };
        return acc;
      }, {});

    const jobs = await prisma.job.findMany({
      where: filteredParams,
      skip: skip,
      take: limit,
      include: {
        salary: true,
        company: true,
        metadata: true,
        hasProbationPeriod: true,
      },
      orderBy: {
        date_posted: "desc",
      },
    });
    return jobs;
  } catch (error: any) {
    throw new Error(`Error finding jobs by criteria: ${error.message}`);
  }
}

/**
 * Get total count of jobs in the database
 * @returns Total number of jobs
 */
export async function totalJobCountService() {
  try {
    return await prisma.job.count();
  } catch (error: any) {
    throw new Error(`Error counting jobs: ${error.message}`);
  }
}

/**
 * Filter jobs by multiple criteria with OR conditions
 * @param searchParam Search parameters
 * @param skip Number of items to skip
 * @param limit Number of items per page
 * @returns Array of jobs matching any of the criteria
 */
export async function fiilterManyJobService(
  searchParam: any,
  skip: number,
  limit: number
) {
  try {
    const orConditions = [];

    if (searchParam.title) {
      orConditions.push({
        title: { contains: searchParam.title, mode: "insensitive" },
      });
    }

    if (searchParam.qualification) {
      orConditions.push({
        qualification: {
          contains: searchParam.qualification,
          mode: "insensitive",
        },
      });
      orConditions.push({
        skills: { contains: searchParam.qualification, mode: "insensitive" },
      });
    }

    if (searchParam.job_type) {
      orConditions.push({
        job_type: { contains: searchParam.job_type, mode: "insensitive" },
      });
    }

    if (searchParam.visa_sponsorship) {
      orConditions.push({
        visa_sponsorship: {
          contains: searchParam.visa_sponsorship,
          mode: "insensitive",
        },
      });
    }

    if (searchParam.remote_posible) {
      orConditions.push({
        remote_posible: {
          contains: searchParam.remote_posible,
          mode: "insensitive",
        },
      });
    }

    if (searchParam.location) {
      orConditions.push({
        location: { contains: searchParam.location, mode: "insensitive" },
      });
    }

    if (searchParam.currency || searchParam.salary) {
      const salaryConditions = [];

      if (searchParam.currency) {
        salaryConditions.push({
          currency: { contains: searchParam.currency, mode: "insensitive" },
        });
      }

      if (searchParam.salary) {
        salaryConditions.push({
          minimumMinor: { contains: searchParam.salary },
        });
      }

      orConditions.push({ salary: { OR: salaryConditions } });
    }

    const jobs = await prisma.job.findMany({
      where: {
        OR: orConditions.length > 0 ? orConditions : undefined,
      },
      include: {
        salary: true,
        metadata: true,
        hasProbationPeriod: true,
        company: true,
      },
      skip: skip,
      take: limit,
      orderBy: {
        date_posted: "desc",
      },
    });

    return jobs;
  } catch (error: any) {
    throw new Error(`Error filtering jobs: ${error.message}`);
  }
}

/**
 * Search jobs by title keyword
 * @param title Title keyword to search
 * @param skip Number of items to skip
 * @param limit Number of items per page
 * @returns Array of jobs matching the title keyword
 */
export async function SearchJobService(
  title: any,
  skip: number,
  limit: number
) {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        OR: [
          { title: { contains: title, mode: "insensitive" } },
          { skills: { contains: title, mode: "insensitive" } },
          { description: { contains: title, mode: "insensitive" } },
        ],
      },
      include: {
        salary: true,
        company: {
          select: {
            name: true,
            logo: true,
          },
        },
      },
      skip: skip,
      take: limit,
      orderBy: {
        date_posted: "desc",
      },
    });
    return jobs;
  } catch (error: any) {
    throw new Error(`Error searching jobs: ${error.message}`);
  }
}

/**
 * Find jobs by location
 * @param location Location to search for
 * @param skip Number of items to skip
 * @param limit Number of items per page
 * @returns Array of jobs in the specified location
 */
export async function findJobLocationService(
  location: any,
  skip: number,
  limit: number
) {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        OR: [
          { location: { contains: location, mode: "insensitive" } },
          {
            company: {
              address: {
                /**
                 * Defines search conditions for matching job locations across city, country, and state
                 * Performs a case-insensitive search using the provided location parameter
                 */
                OR: [
                  { city: { contains: location, mode: "insensitive" } },
                  { country: { contains: location, mode: "insensitive" } },
                  { state: { contains: location, mode: "insensitive" } },
                ],
              },
            },
          },
        ],
      },
      include: {
        salary: true,
        company: {
          include: {
            address: true,
          },
        },
      },
      skip: skip,
      take: limit,
      orderBy: {
        date_posted: "desc",
      },
    });
    return jobs;
  } catch (error: any) {
    throw new Error(`Error finding jobs by location: ${error.message}`);
  }
}

/**
 * Find a job by ID and company ID
 * @param id Job ID
 * @param companyId Company ID
 * @returns Job or null if not found
 */
export async function findJobCompanyService(id: string, companyId: string) {
  try {
    const job = await prisma.job.findUnique({
      where: {
        id: id,
        company_id: companyId,
      },
      include: {
        company: true,
        salary: true,
        metadata: true,
        hasProbationPeriod: true,
      },
    });
    return job;
  } catch (error: any) {
    throw new Error(`Error finding job by company: ${error.message}`);
  }
}

/**
 * MUTATIONS
 */

/**
 * Create a new job
 * @param input Job data
 * @returns Created job
 */
export async function createJobService(input: jobServiceInput) {
  try {
    const job = await prisma.job.create({
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
        date_posted: input.date_posted || new Date(),
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
        salary: {
          include: {
            fineGrainedSalaryInformation: true,
            taskBasedSalaryInformation: true,
          },
        },
        hasProbationPeriod: true,
      },
    });
    return job;
  } catch (error: any) {
    throw new Error(`Error creating job: ${error.message}`);
  }
}

/**
 * Update a job
 * @param query Job ID
 * @param update Job data to update
 * @returns Updated job
 */
export async function updateJobService(query: string, update: jobInput) {
  try {
    const updateUser = await prisma.job.update({
      where: {
        id: query,
      },
      data: {
        ...update,
      },
      include: {
        company: true,
        metadata: true,
        salary: true,
        hasProbationPeriod: true,
      },
    });
    return updateUser;
  } catch (error: any) {
    throw new Error(`Error updating job: ${error.message}`);
  }
}

/**
 * Update a job and its related entities
 * @param salaryId Salary ID
 * @param metadataId Metadata ID
 * @param hppId HasProbationPeriod ID
 * @param id Job ID
 * @param update Job data to update
 * @returns Updated job with related entities
 */
// export async function updateJobFkService(
//   salaryId: string,
//   metadataId: string,
//   hppId: string,
//   id: string,
//   update: jobServiceInput,
// ) {
//   try {
//     const updateUser = await prisma.job.update({
//       where: {
//         id: id,
//       },
//       data: {
//         title: update.title,
//         subtitle: update.subtitle,
//         description: update.description,
//         qualification: update.qualification,
//         complimentary_qualification: update.complimentary_qualification,
//         job_type: update.job_type,
//         visa_sponsorship: update.visa_sponsorship,
//         remote_posible: update.remote_posible,
//         preferred_timezones: update.preferred_timezones
// company_id: string,
export async function updateJobFkService(
  salaryId: string,
  metadataId: string,
  hppId: string,
  id: string,
  update: jobServiceInput
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

// import { prisma } from "../scripts";
// import { jobInput, jobServiceInput } from "../schema/job.schema";

// export async function findJobService(query: string) {
//   const user = await prisma.job.findUnique({
//     where: {
//       id: query,
//     },
//   });
//   return user;
// }

// export async function findAllJobsService(page: number, limit: number) {
//   const jobs = await prisma.job.findMany({
//     skip: page,
//     take: limit,
//   });
//   return jobs;
// }

// export async function findManyJobsService(
//   searchParam: any,
//   skip: number,
//   limit: number,
// ) {
//   const jobs = await prisma.job.findMany({
//     where: {
//       ...searchParam,
//     },
//     skip: skip,
//     take: limit,
//   });
//   return jobs;
// }

// export async function totalJobCountService() {
//   const job = await prisma.job.count();
//   return job;
// }

// export async function fiilterManyJobService(
//   searchParam: any,
//   skip: number,
//   limit: number,
// ) {
//   const companys = await prisma.job.findMany({
//     where: {
//       OR: [
//         {
//           title: {
//             contains: searchParam.title,
//           },
//         },
//         { qualification: { contains: searchParam.qualification } },
//         { job_type: { contains: searchParam.job_type } },
//         { visa_sponsorship: { contains: searchParam.visa_sponsorship } },
//         { remote_posible: { contains: searchParam.remote_posible } },
//         { location: { contains: searchParam.location } },
//         { skills: { contains: searchParam.qualification } },
//         {
//           salary: {
//             OR: [
//               {
//                 currency: {
//                   contains: searchParam.currency,
//                 },
//               },
//               { minimumMinor: { contains: searchParam.salary } },
//             ],
//           },
//         },
//       ],
//     },
//     include: {
//       salary: true,
//       metadata: true,
//       hasProbationPeriod: true,
//       company: true,
//     },
//     skip: skip,
//     take: limit,
//   });
//   return companys;
// }

// export async function SearchJobService(
//   title: any,
//   skip: number,
//   limit: number,
// ) {
//   const jobs = await prisma.job.findMany({
//     where: {
//       title: {
//         contains: title,
//       },
//     },
//     skip: skip,
//     take: limit,
//   });
//   return jobs;
// }
// export async function findJobLocationService(
//   location: any,
//   skip: number,
//   limit: number,
// ) {
//   const jobs = await prisma.job.findMany({
//     where: {
//       company: {
//         OR: [
//           {
//             address: {
//               OR: [
//                 {
//                   city: {
//                     contains: location,
//                   },
//                 },
//                 { country: { contains: location } },
//               ],
//             },
//           },
//         ],
//       },
//     },
//     include: {
//       salary: true,
//     },
//     skip: skip,
//     take: limit,
//   });
//   return jobs;
// }

// export async function findJobCompanyService(id: string, companyId: string) {
//   const user = await prisma.job.findUnique({
//     where: {
//       id: id,
//       company_id: companyId,
//     },
//   });

//   return user;
// }

// /**
//  *
//  *
//  * MUTATIONS END POINT
//  * NOT EXPOSED
//  *
//  */

// export async function createJobService(input: jobServiceInput) {
//   const user = await prisma.job.create({
//     data: {
//       title: input.title,
//       subtitle: input.subtitle,
//       description: input.description,
//       qualification: input.qualification,
//       complimentary_qualification: input.complimentary_qualification,
//       job_type: input.job_type,
//       visa_sponsorship: input.visa_sponsorship,
//       remote_posible: input.remote_posible,
//       preferred_timezones: input.preferred_timezones,
//       location: input.location,
//       date_posted: input.date_posted,
//       relocation: input.relocation,
//       skills: input.skills,
//       employer_hiring_contact: input.employer_hiring_contact,
//       descriptionFormatting: input.descriptionFormatting,
//       probationaryPeriod: input.probationaryPeriod,
//       metadata: {
//         create: {
//           atsName: input.atsName,
//           employersName: input.employersName,
//         },
//       },
//       hasProbationPeriod: {
//         create: {
//           period: input.period,
//           status: false,
//         },
//       },
//       company: {
//         connect: {
//           id: input.company_id,
//         },
//       },
//       salary: {
//         create: {
//           currency: input.currency,
//           maximumMinor: input.maximumMinor,
//           minimumMinor: input.minimumMinor,
//           fineGrainedSalaryInformation: {
//             create: {
//               totalSalaryMinor: input.totalSalaryMinor,
//               workingHours: input.workingHours,
//               totalOvertimeHours: input.totalOvertimeHours,
//               statutoryOvertimeHours: input.statutoryOvertimeHours,
//               fixedOvertimeSalaryMinor: input.fixedOvertimeSalaryMinor,
//               fixedOvertimePay: input.fixedOvertimePay,
//             },
//           },
//           taskBasedSalaryInformation: {
//             create: {
//               taskLengthMinutes: input.taskLengthMinutes,
//               taskDescription: input.taskDescription,
//             },
//           },
//         },
//       },
//     },
//     include: {
//       company: true,
//       metadata: true,
//       salary: true,
//       hasProbationPeriod: true,
//     },
//   });
//   return user;
// }

// export async function updateJobService(query: string, update: jobInput) {
//   const updateUser = await prisma.job.update({
//     where: {
//       id: query,
//     },
//     data: {
//       ...update,
//     },
//   });
//   return updateUser;
// }
