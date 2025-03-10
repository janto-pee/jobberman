import { object, string, TypeOf, number } from "zod";

const salaryInput = object({
  currency: string({ required_error: `currency is required` }),
  maximumMinor: string({ required_error: `maximum minor is required` }),
  minimumMinor: string({ required_error: `country is required` }),
  period: string({ required_error: `period is required` }),
  jobId: string({ required_error: `job id is required` }),
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
  query: salaryQuery,
});

export type salaryInput = TypeOf<typeof salaryInput>;

export type createsalaryInput = TypeOf<typeof createSalarySchema>;
