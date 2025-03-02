// import { object, string, TypeOf, number } from "zod";

// const hppInput = object({
//   username: string({ required_error: `username is required` }),
//   street: string({ required_error: `street is required` }),
//   street2: string({ required_error: `street2 is required` }),
//   city: string({ required_error: `city is required` }),
//   state_province_code: string({
//     required_error: `state province code is required`,
//   }),
//   state_province_name: string({
//     required_error: `state province name is required`,
//   }),
//   postal_code: string({ required_error: `potal code is required` }),
//   country_code: string({ required_error: `country code is required` }),
//   latitude: number({ required_error: `latitude is required` }),
//   longitude: number({ required_error: `longitude is required` }),
//   country: string({ required_error: `country is required` }),
// });

// export const createHPPSchema = object({
//   body: hppInput,
// });

// export type hppInput = TypeOf<typeof hppInput>;

// export type createHPPInput = TypeOf<typeof createHPPSchema>;
