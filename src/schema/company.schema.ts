import { object, string, TypeOf, number } from "zod";

const companyInput = object({
  name: string({ required_error: `name is required` }),
  email: string({ required_error: `email is required` }),
  website: string({ required_error: `website is required` }),
  size: string({ required_error: `size is required` }),
  //address input
  street: string({ required_error: `street is required` }),
  country: string({ required_error: `country is required` }),
  //optional
  street2: string({ required_error: `street2 is required` }).optional(),
  city: string({ required_error: `city is required` }).optional(),
  state_province_code: string({
    required_error: `state province code is required`,
  }).optional(),
  state_province_name: string({
    required_error: `state province name is required`,
  }).optional(),
  postal_code: string({ required_error: `potal code is required` }).optional(),
  country_code: string({
    required_error: `country code is required`,
  }).optional(),
  latitude: number({ required_error: `latitude is required` }).optional(),
  longitude: number({ required_error: `longitude is required` }).optional(),

  industry: string({ required_error: `potal code is required` }).optional(),
  description: string({ required_error: `potal code is required` }).optional(),
  logo: string({ required_error: `potal code is required` }).optional(),
});

const companyUpdate = object({
  email: string({ required_error: `email is required` }),
  name: string({ required_error: `name is required` }),
  website: string({ required_error: `website is required` }),
  size: string({ required_error: `size is required` }),
});

const companyQuery = object({
  address: string({ required_error: `address is required` }),
  size: string({ required_error: `size is required` }),
  country: string({ required_error: `country is required` }),
});

export const createCompanySchema = object({
  body: companyInput,
});
export const createCompanyQuery = object({
  query: companyQuery,
});

export type companyInput = TypeOf<typeof companyInput>;
export type companyUpdate = TypeOf<typeof companyUpdate>;
export type createcompanyInput = TypeOf<typeof createCompanySchema>;
