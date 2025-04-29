import { object, string, TypeOf, number, boolean } from "zod";

const salaryInput = object({
  currency: string({ required_error: `currency is required` }),
  maximumMinor: string({ required_error: `maximum minor is required` }),
  minimumMinor: string({ required_error: `country is required` }),

  /**
   * IS THIS JOB TIME BASED OR FIXED GRAINED
   */

  //TBS
  taskLengthMinutes: number({
    required_error: `task length is required`,
  }),
  taskDescription: string({
    required_error: `task description is required`,
  }),
  ratePerTask: string({
    required_error: `task description is required`,
  }),

  // FGS
  totalSalaryMinor: string({
    required_error: `total salary is required`,
  }),
  workingHours: number({
    required_error: `working hours is required`,
  }),
  totalOvertimeHours: number({
    required_error: `total overtime hour is required`,
  }).optional(),
  statutoryOvertimeHours: number({
    required_error: `statutory overtime hour is required`,
  }).optional(),
  fixedOvertimeSalaryMinor: string({
    required_error: `fixed over time salary is required`,
  }).optional(),
  fixedOvertimePay: boolean({
    required_error: `fixed overtime pay is required`,
  }),
});
const salaryQuery = object({
  currency: string({ required_error: `currency is required` }),
  maximumMinor: string({ required_error: `maximum minor is required` }),
  minimumMinor: string({ required_error: `country is required` }),
  period: string({ required_error: `period is required` }),
  jobId: string({ required_error: `job id is required` }),
});

export const createSalarySchema = object({
  body: salaryInput,
});
export const QuerySalarySchema = object({
  query: salaryQuery,
});

export type salaryInput = TypeOf<typeof salaryInput>;

export type createsalaryInput = TypeOf<typeof createSalarySchema>;
export type QuerySalary = TypeOf<typeof QuerySalarySchema>;
