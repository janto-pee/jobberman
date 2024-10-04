// import { Omit } from "lodash";
import { number, object, string, TypeOf } from "zod";

const payload = {
  body: object({
    reviewer: string({ required_error: `the field reviewer is required` }),
    job_id: string({ required_error: `the field job_id is required` }),
    application_id: string({
      required_error: `the field appliaction_id is required`,
    }),
    ratings: number({ required_error: `the field ratings is required` })
      .min(0)
      .max(5),
    review_text: string({
      required_error: `the field review_text is required`,
    }),
  }),
};

const param = {
  params: object({
    reviewer: string({ required_error: `the field username is required` }),
  }),
};

export const createRatingSchema = object({
  ...payload,
});

export const findRatingSchema = object({
  ...param,
});

export const updateRatingSchema = object({
  ...param,
  ...payload,
});

export const deleteRatingSchema = object({
  ...param,
});

export type createRatingInput = TypeOf<typeof createRatingSchema>;
export type findRatingInput = TypeOf<typeof findRatingSchema>;
export type updateRatingInput = TypeOf<typeof updateRatingSchema>;
export type deleteRatingInput = TypeOf<typeof deleteRatingSchema>;
