import { object, string, TypeOf, boolean } from "zod";

const hppInput = object({
  period: string({ required_error: `period is required` }),
  status: boolean({ required_error: `tatus is required` }),
});

export const createHPPSchema = object({
  body: hppInput,
});

export type hppInput = TypeOf<typeof hppInput>;

export type createHPPInput = TypeOf<typeof createHPPSchema>;
