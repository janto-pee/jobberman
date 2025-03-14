import { randomEmail, randomInt, randomString } from "./random";

export let addressInputType: {
  street: string;

  country: string;

  street2: string;

  city: string;

  state_province_code: string;

  state_province_name: string;

  postal_code: string;

  country_code: string;
};

// let companyInputType: {
//   name: string

//   email: string

//   website: string

//   size: string

//   //address input
//   street: string

//   country: string

//   //optional
//   street2: string

//   state_province_code: string

//   state_province_name: string

//   postal_code: string

//   country_code: string

//   latitude: randomInt(18,30),

//   longitude: number;
// };

// let fgsInputType: {
//   totalSalaryMinor: string

//   workingHours: number;

//   totalOvertimeHours: number;

//   statutoryOvertimeHours: number;

//   fixedOvertimeSalaryMinor: string

//   fixedOvertimePay: boolean;

//   salaryId: string
// };

// let hppInputType: {
//   period: string

//   status: boolean;

//   jobId: string
// };

// let jobInputType: {
//   company_id: string

//   title: string

//   subtitle: string

//   description: string

//   qualification: string

//   complimentary_qualification: string

//   job_type: string

//   visa_sponsorship: string

//   remote_posible: string

//   preferred_timezones: string

//   location: string

//   date_posted: string

//   relocation: string

//   skills: string

//   employer_hiring_contact: string

//   descriptionFormatting: string

//   probationaryPeriod: string
// };

// let metadataInputType: {
//   atsName: string

//   employersName: string

//   job_id: string
// };

// let salaryInputType: {
//   currency: string

//   maximumMinor: string

//   minimumMinor: string

//   period: string

//   jobId: string
// };

// let sessionInputType: {
//   email: string

//   hashed_password: string

//   user_agent: string
// };
// let tbsInputType: {
//   taskLengthMinutes: string

//   taskDescription: string

//   salaryId: string
// };

// let userInputType: {
//   email: string
//   username: string

//   first_name: string

//   last_name: string

//   hashed_password: string

//   confirm_password: string
// };

/**
 * SET VALUES
 */

const addressInput = {
  street: randomString(5),

  country: randomString(5),

  street2: randomString(5),

  city: randomString(5),

  state_province_code: randomString(5),

  state_province_name: randomString(5),

  postal_code: randomString(5),

  country_code: randomString(5),

  latitude: 100020002,

  longitude: 100020002,
};

let companyInput = {
  name: randomString(5),

  email: randomEmail(),

  website: randomString(5),

  size: randomString(5),

  //address input
  street: randomString(5),

  country: randomString(5),

  //optional
  street2: randomString(5),

  state_province_code: randomString(5),

  state_province_name: randomString(5),

  postal_code: randomString(5),

  country_code: randomString(5),
};

let hppInput = {
  period: randomString(5),

  status: false,
};

let jobInput = {
  title: randomString(5),

  subtitle: randomString(5),

  description: randomString(5),

  qualification: randomString(5),

  complimentary_qualification: randomString(5),

  job_type: randomString(5),

  visa_sponsorship: randomString(5),

  remote_posible: randomString(5),

  preferred_timezones: randomString(5),

  location: randomString(5),

  date_posted: randomString(5),

  relocation: randomString(5),

  skills: randomString(5),

  employer_hiring_contact: randomString(5),

  descriptionFormatting: randomString(5),

  probationaryPeriod: randomString(5),

  //METADATA
  atsName: randomString(5),

  employersName: randomString(5),

  //HPP
  period: randomString(5),

  status: false,

  //COMPANY
  name: randomString(5),

  email: randomEmail(),

  website: randomString(5),

  size: randomString(5),

  //address input
  street: randomString(5),

  country: randomString(5),
};

let metadataInput = {
  atsName: randomString(5),

  employersName: randomString(5),
};

let salaryInput = {
  currency: randomString(5),

  maximumMinor: randomString(5),

  minimumMinor: randomString(5),

  period: randomString(5),

  //TBS
  taskLengthMinutes: randomString(5),

  taskDescription: randomString(5),

  // FGS
  totalSalaryMinor: randomString(5),

  workingHours: randomInt(18, 30),

  fixedOvertimePay: true,
};

let tbsInput = {
  taskLengthMinutes: randomString(5),

  taskDescription: randomString(5),
};

let fgsInput = {
  totalSalaryMinor: randomString(5),

  workingHours: randomInt(18, 30),

  fixedOvertimePay: true,

  totalOvertimeHours: randomInt(18, 30),

  statutoryOvertimeHours: randomInt(18, 30),

  fixedOvertimeSalaryMinor: randomString(5),
};
const password = randomString(9).trim();

// let userInput = {
//   email: "e1mail14@email.com",
//   username: "u1sernam1e",
//   first_name: "first_name",
//   last_name: "last_name",
//   hashed_password: "abcd1234",
//   confirm_password: "abcd1234",
//   street: "street",
//   country: "country",
// };
let userInput = {
  email: randomEmail().trim(),

  username: randomString(5).trim(),

  first_name: randomString(5).trim(),

  last_name: randomString(5).trim(),

  hashed_password: password,

  confirm_password: password,

  street: randomString(4).trim(),

  country: randomString(4).trim(),
};

let sessionInput = {
  email: userInput.email,

  hashed_password: password,

  user_agent: randomString(5),
};

export {
  userInput,
  tbsInput,
  sessionInput,
  salaryInput,
  metadataInput,
  jobInput,
  hppInput,
  fgsInput,
  companyInput,
  addressInput,
};

//JOB

// {
//   "title": "title",
//   "subtitle": "subtitle",
//   "description": "description",
//   "qualification": "qualification",
//   "complimentary_qualification": "complimentary_qualification",
//   "job_type": "job_type",
//   "visa_sponsorship": "visa_sponsorship",
//   "remote_posible": "remote_posible",
//   "preferred_timezones": "preferred_timezones",
//   "location": "location",
//   "date_posted": "date_posted",
//   "relocation": "relocation",
//   "skills": "skills",
//   "employer_hiring_contact": "employer_hiring_contact",
//   "descriptionFormatting": "descriptionFormatting",
//   "probationaryPeriod": "probationaryPeriod",

//   "atsName": "atsName",
//   "employersName": "employersName",

//   "period": "period",
//   "status": false,

//   "company_id": "118d1a3f-f44f-4c2f-9e0b-f725cc65edd4",

//   "currency": "currency",
//   "maximumMinor": "maximumMinor",
//   "minimumMinor": "minimumMinor",

//   "totalSalaryMinor": "totalSalaryMinor",
//   "workingHours": 32,
//   "totalOvertimeHours": 32,
//   "statutoryOvertimeHours": 32,
//   "fixedOvertimeSalaryMinor": "fixedOvertimeSalaryMinor",
//   "fixedOvertimePay": true,

//   "taskLengthMinutes": "taskLengthMinutes",
//   "taskDescription": "taskDescription"
//   }
