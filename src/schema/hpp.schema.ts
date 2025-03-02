import { object, string, TypeOf, number, boolean } from "zod";

const hppInput = object({
  period: string({ required_error: `period is required` }),
  status: boolean({ required_error: `tatus is required` }),
  jobId: string({ required_error: `job id is required` }),
});

export const createHPPSchema = object({
  body: hppInput,
});

export type hppInput = TypeOf<typeof hppInput>;

export type createHPPInput = TypeOf<typeof createHPPSchema>;
