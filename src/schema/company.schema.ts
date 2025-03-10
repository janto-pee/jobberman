import { object, string, TypeOf, number, boolean } from "zod";

const companyInput = object({
  email: string({ required_error: `email is required` }),
  address: string({ required_error: `address is required` }),
  website: string({ required_error: `website is required` }),
  size: string({ required_error: `size is required` }),
  country: string({ required_error: `country is required` }),
  username: string({ required_error: `username is required` }),
});

const companyQuery = object({
  address: string({ required_error: `address is required` }),
  size: string({ required_error: `size is required` }),
  country: string({ required_error: `country is required` }),
});

export const createCompanySchema = object({
  body: companyInput,
  query: companyQuery,
});

export type companyInput = TypeOf<typeof companyInput>;

export type createcompanyInput = TypeOf<typeof createCompanySchema>;
