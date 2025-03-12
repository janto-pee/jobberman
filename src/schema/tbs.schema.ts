import { object, string, TypeOf, number } from "zod";

const tbs = object({
  taskLengthMinutes: string({ required_error: `task length is required` }),
  taskDescription: string({ required_error: `task description is required` }),
});

export const createTBSSchema = object({
  body: tbs,
});

export type tbs = TypeOf<typeof tbs>;

export type createTBS = TypeOf<typeof createTBSSchema>;
