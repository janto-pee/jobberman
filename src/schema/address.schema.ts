import { object, string, TypeOf, number } from "zod";

export const addressInput = object({
  street: string({ required_error: `street is required` }),
  country: string({ required_error: `country is required` }),
  street2: string({ required_error: `street2 is required` }),
  city: string({ required_error: `city is required` }),
  state_province_code: string({
    required_error: `state province code is required`,
  }),
  state_province_name: string({
    required_error: `state province name is required`,
  }),
  postal_code: string({ required_error: `potal code is required` }),
  country_code: string({ required_error: `country code is required` }),
  latitude: number({ required_error: `latitude is required` }),
  longitude: number({ required_error: `longitude is required` }),
});

export const createAddressSchema = object({
  body: addressInput,
});

export type addressInput = TypeOf<typeof addressInput>;

export type createAddressInput = TypeOf<typeof createAddressSchema>;
