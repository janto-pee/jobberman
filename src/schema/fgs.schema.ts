import { object, string, TypeOf, number, boolean } from "zod";

const fgsInput = object({
  totalSalaryMinor: string({ required_error: `total salary is required` }),
  workingHours: number({ required_error: `working hours is required` }),
  fixedOvertimePay: boolean({
    required_error: `country is required`,
  }),
  // OPTIONALS
  totalOvertimeHours: number({
    required_error: `total overtime hour is required`,
  }),
  statutoryOvertimeHours: number({
    required_error: `statutory overtime hour is required`,
  }).optional(),
  fixedOvertimeSalaryMinor: string({
    required_error: `country is required`,
  }).optional(),
});

export const createFGSSchema = object({
  body: fgsInput,
});

export type fgsInput = TypeOf<typeof fgsInput>;

export type createFGSInput = TypeOf<typeof createFGSSchema>;
