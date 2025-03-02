import { object, string, TypeOf, number, boolean } from "zod";

const fgsInput = object({
  totalSalaryMinor: string({ required_error: `total salary is required` }),
  workingHours: string({ required_error: `working hours is required` }),
  totalOvertimeHours: number({
    required_error: `total overtime hour is required`,
  }),
  statutoryOvertimeHours: number({
    required_error: `statutory overtime hour is required`,
  }),
  fixedOvertimeSalaryMinor: string({ required_error: `country is required` }),
  fixedOvertimePay: boolean({
    required_error: `country is required`,
  }).optional(),
  salaryId: string({ required_error: `salary is required` }),
});

export const createFGSSchema = object({
  body: fgsInput,
});

export type fgsInput = TypeOf<typeof fgsInput>;

export type createFGSInput = TypeOf<typeof createFGSSchema>;
