import { object, string, TypeOf } from "zod";

const metadataInput = object({
  atsName: string({ required_error: `ats is required` }),
  employersName: string({ required_error: `employer is required` }),
});

export const createMetadataSchema = object({
  body: metadataInput,
});

export type metadataInput = TypeOf<typeof metadataInput>;

export type createMetadataInput = TypeOf<typeof createMetadataSchema>;
