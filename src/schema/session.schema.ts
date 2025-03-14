import { object, string, TypeOf } from "zod";

const sessionInput = object({
  email: string({ required_error: `email is required` }).email(
    "must be a valid email",
  ),

  hashed_password: string({ required_error: `password is required` }).min(
    8,
    `password must be 8 characters long`,
  ),
  user_agent: string({ required_error: `user_agent is required` }).optional(),
  client_ip: string({ required_error: `client_ip is required` }).optional(),
});

export const createSessionSchema = object({
  body: sessionInput,
});

export type sessionInput = TypeOf<typeof sessionInput>;

export type createSessionInput = TypeOf<typeof createSessionSchema>;
