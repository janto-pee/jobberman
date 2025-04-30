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
 * @returns Array of jobs and total count
 */
export async function findAllJobsService(page: number, limit: number) {
  try {
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
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
      }),
      prisma.job.count(),
    ]);

    return { jobs, total, page, limit };
  } catch (error: any) {
    throw new Error(`Error finding all jobs: ${error.message}`);
  }
}

/**
 * Find jobs by search parameters with pagination
 * @param searchParam Object containing search criteria
 * @param skip Number of items to skip
 * @param limit Number of items per page
 * @returns Array of jobs matching criteria and total count
 */
export async function findManyJobsService(
  searchParam: any,
  skip: number,
  limit: number
) {
  try {
    // Filter out undefined or null values from searchParam
    const filteredParams = Object.entries(searchParam)
      .filter(
        ([_, value]) => value !== undefined && value !== null && value !== ""
      )
      .reduce(
        (acc, [key, value]) => {
          acc[key] = { contains: value, mode: "insensitive" };
          return acc;
        },
        {} as Record<string, any>
      );

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
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
      }),
      prisma.job.count({
        where: filteredParams,
      }),
    ]);

    return { jobs, total, page: Math.floor(skip / limit) + 1, limit };
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
 * @returns Array of jobs matching any of the criteria and total count
 */
export async function fiilterManyJobService(
  searchParam: any,
  skip: number,
  limit: number
) {
  try {
    // Build dynamic where clause based on provided parameters
    const whereClause: any = {
      orConditions: [],
    };

    // const orConditions = [];

    if (searchParam.title) {
      whereClause.orConditions.push({
        title: { contains: searchParam.title, mode: "insensitive" },
      });
    }

    if (searchParam.qualification) {
      whereClause.orConditions.push({
        qualification: {
          contains: searchParam.qualification,
          mode: "insensitive",
        },
      });
      whereClause.orConditions.push({
        skills: { contains: searchParam.qualification, mode: "insensitive" },
      });
    }

    if (searchParam.job_type) {
      whereClause.orConditions.push({
        job_type: { contains: searchParam.job_type, mode: "insensitive" },
      });
    }

    if (searchParam.visa_sponsorship) {
      whereClause.orConditions.push({
        visa_sponsorship: {
          contains: searchParam.visa_sponsorship,
          mode: "insensitive",
        },
      });
    }

    if (searchParam.remote_posible) {
      whereClause.orConditions.push({
        remote_posible: {
          contains: searchParam.remote_posible,
          mode: "insensitive",
        },
      });
    }

    if (searchParam.location) {
      whereClause.orConditions.push({
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

      whereClause.orConditions.push({ salary: { OR: salaryConditions } });
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where: whereClause,
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
      }),
      prisma.job.count({
        where: whereClause,
      }),
    ]);

    return { jobs, total, page: Math.floor(skip / limit) + 1, limit };
  } catch (error: any) {
    throw new Error(`Error filtering jobs: ${error.message}`);
  }
}

/**
 * Search jobs by title keyword
 * @param title Title keyword to search
 * @param skip Number of items to skip
 * @param limit Number of items per page
 * @returns Array of jobs matching the title keyword and total count
 */
export async function SearchJobService(
  title: string,
  skip: number,
  limit: number
) {
  try {
    if (!title || typeof title !== "string") {
      throw new Error("Search term is required");
    }

    const whereCondition = {
      OR: [
        { title: { contains: title, mode: "insensitive" } },
        { skills: { contains: title, mode: "insensitive" } },
        { description: { contains: title, mode: "insensitive" } },
      ],
    };

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where: whereCondition,
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
        skip: skip,
        take: limit,
        orderBy: {
          date_posted: "desc",
        },
      }),
      prisma.job.count({
        where: whereCondition,
      }),
    ]);

    return { jobs, total, page: Math.floor(skip / limit) + 1, limit };
  } catch (error: any) {
    throw new Error(`Error searching jobs: ${error.message}`);
  }
}

/**
 * Find jobs by location
 * @param location Location to search for
 * @param skip Number of items to skip
 * @param limit Number of items per page
 * @returns Array of jobs in the specified location and total count
 */
export async function findJobLocationService(
  location: string,
  skip: number,
  limit: number
) {
  try {
    if (!location || typeof location !== "string") {
      throw new Error("Location is required");
    }

    const whereCondition = {
      OR: [
        { location: { contains: location, mode: "insensitive" } },
        {
          company: {
            address: {
              OR: [
                { city: { contains: location, mode: "insensitive" } },
                { country: { contains: location, mode: "insensitive" } },
              ],
            },
          },
        },
      ],
    };

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where: whereCondition,
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
      }),
      prisma.job.count({
        where: whereCondition,
      }),
    ]);

    return { jobs, total, page: Math.floor(skip / limit) + 1, limit };
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
    if (!id || !companyId) {
      throw new Error("Job ID and Company ID are required");
    }

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
    // Validate required fields
    if (!input.title || !input.company_id) {
      throw new Error("Job title and company ID are required");
    }

    const job = await prisma.job.create({
      data: {
        title: input.title,
        subtitle: input.subtitle,
        description: input.description,
        qualification: input.qualification,
        complimentary_qualification: input.complimentary_qualification,
        job_type: input.job_type,
        visa_sponsorship: input.visa_sponsorship,
        preferred_timezones: input.preferred_timezones,
        location: input.location,
        date_posted: input.date_posted || new Date(),
        relocation: input.relocation,
        skills: input.skills,
        employer_hiring_contact: input.employer_hiring_contact,
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
                ratePerTask: input.ratePerTask,
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
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("A job with similar unique constraints already exists");
      }
      if (error.code === "P2025") {
        throw new Error("Company not found");
      }
    }
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
    if (!query) {
      throw new Error("Job ID is required");
    }

    const updateUser = await prisma.job.update({
      where: {
        id: query,
      },
      data: {
        ...update,
        status: "DRAFT",
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
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("Job not found");
      }
    }
    throw new Error(`Error updating job: ${error.message}`);
  }
}

/**
 * Delete a job by ID
 * @param query Job ID
 * @returns Deleted job
 */
export async function deleteJobService(query: string) {
  try {
    if (!query) {
      throw new Error("Job ID is required");
    }

    const deletedJob = await prisma.job.delete({
      where: {
        id: query,
      },
      include: {
        salary: true,
        metadata: true,
        hasProbationPeriod: true,
      },
    });
    return deletedJob;
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("Job not found");
      }
      if (error.code === "P2003") {
        throw new Error("Cannot delete job with related records");
      }
    }
    throw new Error(`Error deleting job: ${error.message}`);
  }
}

/**
 * Find jobs by company ID with pagination
 * @param companyId Company ID
 * @param page Page number (0-indexed)
 * @param limit Number of items per page
 * @returns Array of jobs for the company and total count
 */
export async function findJobsByCompanyService(
  companyId: string,
  page: number,
  limit: number
) {
  try {
    if (!companyId) {
      throw new Error("Company ID is required");
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where: {
          company_id: companyId,
        },
        include: {
          salary: true,
          metadata: true,
          hasProbationPeriod: true,
        },
        skip: page * limit,
        take: limit,
        orderBy: {
          date_posted: "desc",
        },
      }),
      prisma.job.count({
        where: {
          company_id: companyId,
        },
      }),
    ]);

    return { jobs, total, page, limit };
  } catch (error: any) {
    throw new Error(`Error finding jobs by company: ${error.message}`);
  }
}

/**
 * Find recent jobs with pagination
 * @param days Number of days to look back
 * @param page Page number (0-indexed)
 * @param limit Number of items per page
 * @returns Array of recent jobs and total count
 */
export async function findRecentJobsService(
  days: number = 7,
  page: number = 0,
  limit: number = 10
) {
  try {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where: {
          date_posted: {
            gte: dateThreshold,
          },
        },
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
        skip: page * limit,
        take: limit,
        orderBy: {
          date_posted: "desc",
        },
      }),
      prisma.job.count({
        where: {
          date_posted: {
            gte: dateThreshold,
          },
        },
      }),
    ]);

    return { jobs, total, page, limit };
  } catch (error: any) {
    throw new Error(`Error finding recent jobs: ${error.message}`);
  }
}

/**
 * Find jobs by skill requirements
 * @param skills Array of skills to search for
 * @param page Page number (0-indexed)
 * @param limit Number of items per page
 * @returns Array of jobs matching the skills and total count
 */
export async function findJobsBySkillsService(
  skills: string[],
  page: number = 0,
  limit: number = 10
) {
  try {
    if (!skills || !skills.length) {
      throw new Error("At least one skill is required");
    }

    const skillConditions = skills.map((skill) => ({
      skills: {
        contains: skill,
        mode: "insensitive" as Prisma.QueryMode,
      },
    }));

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where: {
          OR: skillConditions,
        },
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
        skip: page * limit,
        take: limit,
        orderBy: {
          date_posted: "desc",
        },
      }),
      prisma.job.count({
        where: {
          OR: skillConditions,
        },
      }),
    ]);

    return { jobs, total, page, limit };
  } catch (error: any) {
    throw new Error(`Error finding jobs by skills: ${error.message}`);
  }
}

/**
 * Update a job's salary information
 * @param jobId Job ID
 * @param salaryId Salary ID
 * @param salaryData Salary data to update
 * @returns Updated job with salary information
 */
export async function updateJobSalaryService(
  jobId: string,
  salaryId: string,
  salaryData: {
    currency?: string;
    maximumMinor?: string;
    minimumMinor?: string;
    totalSalaryMinor?: string;
    workingHours?: number;
  }
) {
  try {
    if (!jobId || !salaryId) {
      throw new Error("Job ID and Salary ID are required");
    }

    const { totalSalaryMinor, workingHours, ...salaryFields } = salaryData;

    const updatedJob = await prisma.job.update({
      where: {
        id: jobId,
      },
      data: {
        salary: {
          update: {
            where: {
              id: salaryId,
            },
            data: {
              ...salaryFields,
              fineGrainedSalaryInformation:
                totalSalaryMinor || workingHours
                  ? {
                      update: {
                        totalSalaryMinor,
                        workingHours,
                      },
                    }
                  : undefined,
            },
          },
        },
      },
      include: {
        salary: {
          include: {
            fineGrainedSalaryInformation: true,
            taskBasedSalaryInformation: true,
          },
        },
        company: true,
      },
    });

    return updatedJob;
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("Job or salary record not found");
      }
    }
    throw new Error(`Error updating job salary: ${error.message}`);
  }
}

/**
 * Find featured or promoted jobs
 * @param page Page number (0-indexed)
 * @param limit Number of items per page
 * @returns Array of featured jobs and total count
 */
export async function findFeaturedJobsService(
  page: number = 0,
  limit: number = 10
) {
  try {
    // This assumes you have a "featured" or "promoted" field in your schema

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where: {
          remote_possible: true,
          // metadata: {
          //   // Assuming adding a "featured" field to metadata
          //   // featured: true,
          //   // Using a workaround - get jobs from premium companies
          //   employersName: {
          //     not: null,
          //   },
          // },
        },
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
        skip: page * limit,
        take: limit,
        orderBy: [{ date_posted: "desc" }],
      }),
      prisma.job.count({
        where: {
          metadata: {
            employersName: {
              not: "jobberman",
            },
          },
        },
      }),
    ]);

    return { jobs, total, page, limit };
  } catch (error: any) {
    throw new Error(`Error finding featured jobs: ${error.message}`);
  }
}
