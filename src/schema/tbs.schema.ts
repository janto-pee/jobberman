import { number, object, string, TypeOf } from "zod";

const tbs = object({
  taskLengthMinutes: number({ required_error: `task length is required` }),
  taskDescription: string({ required_error: `task description is required` }),
  ratePerTask: string({ required_error: `rate for each tsk is required` }),
});

export const createTBSSchema = object({
  body: tbs,
});

export type tbs = TypeOf<typeof tbs>;

export type createTBS = TypeOf<typeof createTBSSchema>;
