import { object, string, TypeOf, number } from "zod";

const tbs = object({
  taskLengthMinutes: string({ required_error: `task length is required` }),
  taskDescription: string({ required_error: `task description is required` }),
  salaryId: string({ required_error: `salary for completed task is required` }),
});

export const createTBSSchema = object({
  body: tbs,
});

export type tbs = TypeOf<typeof tbs>;

export type createTBS = TypeOf<typeof createTBSSchema>;
