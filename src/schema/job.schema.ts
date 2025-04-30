import { object, string, TypeOf, number, boolean, any } from "zod";

const companyId = {
  company_id: string({
    required_error: `company id for completed task is required`,
  }),
};
const jobItem = {
  /**
   * COMPANY
   */

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
  job_type: any({
    required_error: `job type for completed task is required`,
  }),
  visa_sponsorship: any({
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
  relocation: boolean({
    required_error: `relocation for completed task is required`,
  }),
  skills: any({ required_error: `skills for completed task is required` }),
  employer_hiring_contact: string({
    required_error: `employer hiring contact for completed task is required`,
  }),
  descriptionFormatting: string({
    required_error: `description formating for completed task is required`,
  }),
  probationaryPeriod: string({
    required_error: `probationary period for completed task is required`,
  }),
  /**META DATA */
  atsName: string({ required_error: `ats is required` }),
  employersName: string({ required_error: `employer is required` }),

  /**
   * HAS PROBATION PERIOD
   */
  period: string({ required_error: `period is required` }),
  status: boolean({ required_error: `status is required` }),

  /**
   * SALARY
   */
  currency: string({ required_error: `currency is required` }),
  maximumMinor: string({ required_error: `maximum minor is required` }),
  minimumMinor: string({ required_error: `country is required` }),

  /**
   * IS THIS JOB TIME BASED OR FIXED GRAINED
   */

  //TBS
  taskLengthMinutes: number({
    required_error: `task length is required`,
  }),
  taskDescription: string({
    required_error: `task description is required`,
  }),
  ratePerTask: string({
    required_error: `rate per task is required`,
  }),

  // FGS
  totalSalaryMinor: string({
    required_error: `total salary is required`,
  }),
  workingHours: number({
    required_error: `working hours is required`,
  }),
  totalOvertimeHours: number({
    required_error: `total overtime hour is required`,
  }).optional(),
  statutoryOvertimeHours: number({
    required_error: `statutory overtime hour is required`,
  }).optional(),
  fixedOvertimeSalaryMinor: string({
    required_error: `fixed over time salary is required`,
  }).optional(),
  fixedOvertimePay: boolean({
    required_error: `fixed overtime pay is required`,
  }),
};

const jobInput = object({
  ...jobItem,
});

const jobServiceInput = object({
  ...companyId,
  ...jobItem,
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
});
export const FilterJobSchema = object({
  query: jobQuery,
});

export type jobInput = TypeOf<typeof jobInput>;
export type jobServiceInput = TypeOf<typeof jobServiceInput>;
export type jobQuery = TypeOf<typeof jobQuery>;
export type FilterjobQuery = TypeOf<typeof FilterJobSchema>;

export type createJobInput = TypeOf<typeof createJobSchema>;
