import { number, object, string, TypeOf } from "zod";

const user = {
  email: string({ required_error: `email is required` }).email(
    "must be a valid email",
  ),
  username: string({ required_error: `the field username is required` }),
  first_name: string({ required_error: `the field first_name is required` }),
  last_name: string({ required_error: `the field last_name is required` }),
  hashed_password: string({ required_error: `password is required` }).min(
    8,
    `password must be at least 8 characters long`,
  ),
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
};

const userInput = object({
  ...user,
  confirm_password: string({
    required_error: `confirm_password is required`,
  }),
});
const userService = object({
  ...user,
  verificationCode: string({
    required_error: `the field verificationCode is required`,
  }),
});

export const createUserSchema = object({
  body: userInput.refine(
    (data) => data.hashed_password === data.confirm_password,
    {
      message: `password and confirm_password mismatch`,
      path: ["confirm_password"],
    },
  ),
});

const verifyParams = object({
  id: string({ required_error: `the field name is required` }),
  verificationcode: string({ required_error: `the field name is required` }),
});

export const verifyUserSchema = object({
  params: verifyParams,
});

const forgotBody = object({
  email: string({ required_error: `email is required` }).email(
    "must be a valid email",
  ),
});
export const forgotPasswordSchema = object({
  body: forgotBody,
});

const resetParams = object({
  id: string({ required_error: `the field name is required` }),
  passwordresetcode: string({ required_error: `the field name is required` }),
});

const resetBody = object({
  password: string({ required_error: `password is required` }).min(
    8,
    `password must be 8 characters long`,
  ),
  confirm_password: string({
    required_error: `confirm_password is required`,
  }),
});

export const resetPasswordSchema = object({
  params: resetParams,
  body: resetBody.refine((data) => data.password === data.confirm_password, {
    message: `password and confirm_password mismatch`,
    path: ["confirm_password"],
  }),
});

export type userInput = TypeOf<typeof userInput>;
export type userService = TypeOf<typeof userService>;
export type verifyParam = TypeOf<typeof verifyParams>;
export type forgotBody = TypeOf<typeof forgotBody>;
export type resetParam = TypeOf<typeof resetParams>;
export type resetBody = TypeOf<typeof resetBody>;

export type createUserInput = TypeOf<typeof createUserSchema>;
export type verifyUserInput = TypeOf<typeof verifyUserSchema>;
export type forgotPasswordInput = TypeOf<typeof forgotPasswordSchema>;
export type resetPasswordInput = TypeOf<typeof resetPasswordSchema>;
