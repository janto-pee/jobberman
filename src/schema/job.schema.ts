import { object, string, TypeOf, number } from "zod";

const jobInput = object({
  company_id: string({
    required_error: `company id for completed task is required`,
  }),
  title: string({ required_error: `title for completed task is required` }),
  subtitle: string({
    required_error: `subtitle for completed task is required`,
  }),
  description: string({
    required_error: `description for completed task is required`,
  }),
  qualification: string({
    required_error: `qualification for completed task is required`,
  }),
  complimentary_qualification: string({
    required_error: `complimentary qualification for completed task is required`,
  }),
  job_type: string({
    required_error: `job type for completed task is required`,
  }),
  visa_sponsorship: string({
    required_error: `visa sponsorship for completed task is required`,
  }),
  remote_posible: string({
    required_error: `remote possible for completed task is required`,
  }),
  preferred_timezones: string({
    required_error: `preferred timezones for completed task is required`,
  }),
  location: string({
    required_error: `location for completed task is required`,
  }),
  date_posted: string({
    required_error: `date posted for completed task is required`,
  }),
  relocation: string({
    required_error: `relocation for completed task is required`,
  }),
  skills: string({ required_error: `skills for completed task is required` }),
  employer_hiring_contact: string({
    required_error: `employer hiring contact for completed task is required`,
  }),
  descriptionFormatting: string({
    required_error: `description formating for completed task is required`,
  }),
  probationaryPeriod: string({
    required_error: `probationary period for completed task is required`,
  }),
});

const jobQuery = object({
  company_id: string({
    required_error: `company id for completed task is required`,
  }).optional(),
  title: string({ required_error: `title for completed task is required` }),
  qualification: string({
    required_error: `qualification for completed task is required`,
  }).optional(),
  job_type: string({
    required_error: `job type for completed task is required`,
  }).optional(),
  visa_sponsorship: string({
    required_error: `visa sponsorship for completed task is required`,
  }).optional(),
  remote_posible: string({
    required_error: `remote possible for completed task is required`,
  }).optional(),
  location: string({
    required_error: `location for completed task is required`,
  }).optional(),
  date_posted: string({
    required_error: `date posted for completed task is required`,
  }).optional(),
  skills: string({
    required_error: `skills for completed task is required`,
  }).optional(),
  probationaryPeriod: string({
    required_error: `probationary period for completed task is required`,
  }).optional(),
});

export const createJobSchema = object({
  body: jobInput,
  query: jobQuery,
});

export type jobInput = TypeOf<typeof jobInput>;
export type jobQuery = TypeOf<typeof jobQuery>;

export type createJobInput = TypeOf<typeof createJobSchema>;
