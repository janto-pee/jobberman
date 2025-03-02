CREATE TABLE "users" (
  "id" BIGSERIAL PRIMARY KEY,
  "username" varchar UNIQUE NOT NULL,
  "hashed_password" varchar NOT NULL,
  "first_name" varchar NOT NULL,
  "last_name" varchar NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "is_email_verified" bool NOT NULL DEFAULT false,
  "password_changed_at" timestamptz NOT NULL DEFAULT '0001-01-01',
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);
CREATE TABLE "companies" (
  "id" BIGSERIAL PRIMARY KEY,
  "email" varchar UNIQUE NOT NULL,
  "address" varchar NOT NULL,
  "website" varchar NOT NULL,
  "size" varchar NOT NULL,
  "country" varchar NOT NULL,
  "is_email_verified" bool NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);
CREATE TABLE "sessions" (
  "id" uuid PRIMARY KEY,
  "username" varchar NOT NULL,
  "refresh_token" varchar NOT NULL,
  "user_agent" varchar NOT NULL,
  "client_ip" varchar NOT NULL,
  "is_blocked" boolean NOT NULL DEFAULT false,
  "expires_at" timestamptz NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);
CREATE TABLE "jobs" (
  "id" BIGSERIAL PRIMARY KEY,
  "employer_id" varchar NOT NULL,
  "title" varchar NOT NULL,
  "subtitle" varchar NOT NULL,
  "description" varchar NOT NULL,
  "qualification" varchar NOT NULL,
  "complimentary_qualification" varchar NOT NULL,
  "job_type" varchar NOT NULL,
  "visa_sponsorship" varchar NOT NULL,
  "remote_posible" varchar NOT NULL,
  "preferred_timezones" varchar NOT NULL,
  "location" varchar NOT NULL,
  "salary" varchar UNIQUE NOT NULL,
  "date_posted" varchar NOT NULL,
  "relocation" varchar NOT NULL,
  "skills" varchar NOT NULL,
  "employer_hiring_contact" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "descriptionFormatting" varchar NOT NULL,
  "hasProbationaryPeriod" varchar NOT NULL,
  "probationaryPeriod" varchar NOT NULL
);
CREATE TABLE "address" (
  "id" varchar NOT NULL,
  "username" varchar UNIQUE NOT NULL,
  "street" varchar NOT NULL,
  "street2" varchar NOT NULL,
  "city" varchar NOT NULL,
  "state_province_code" varchar NOT NULL,
  "state_province_name" varchar NOT NULL,
  "postal_code" varchar NOT NULL,
  "country_code" varchar NOT NULL,
  "latitude" int NOT NULL,
  "longitude" INT NOT NULL,
  "country" varchar NOT NULL
);
CREATE TABLE "salary" (
  "id" BIGSERIAL PRIMARY KEY,
  "currency" varchar NOT NULL,
  "maximumMinor" varchar NOT NULL,
  "minimumMinor" varchar NOT NULL,
  "period" varchar NOT NULL,
  "fineGrainedSalaryInformation" varchar NOT NULL,
  "taskBasedSalaryInformation" varchar NOT NULL
);
CREATE TABLE "fineGrainedSalaryInformation" (
  "id" BIGSERIAL PRIMARY KEY,
  "totalSalaryMinor" varchar NOT NULL,
  "workingHours" Int NOT NULL,
  "totalOvertimeHours" Int NOT NULL,
  "statutoryOvertimeHours" Int NOT NULL,
  "fixedOvertimeSalaryMinor" varchar NOT NULL,
  "fixedOvertimePay" boolean NOT NULL
);
CREATE TABLE "taskBasedSalaryInformation" (
  "id" BIGSERIAL PRIMARY KEY,
  "taskLengthMinutes" varchar NOT NULL,
  "taskDescription" varchar NOT NULL
);
CREATE TABLE "hasProbationaryPeriod" (
  "id" BIGSERIAL NOT NULL,
  "job_id" BigInt NOT NULL,
  "status" boolean
);
CREATE TABLE "metaData" (
  "id" BIGSERIAL PRIMARY KEY,
  "job_id" BIGSERIAL NOT NULL,
  "atsName" varchar NOT NULL,
  "employersName" varchar NOT NULL
);
CREATE INDEX ON "jobs" ("employer_id");
ALTER TABLE "users"
ADD FOREIGN KEY ("company") REFERENCES "companies" ("id");
ALTER TABLE "address"
ADD FOREIGN KEY ("username") REFERENCES "users" ("username");
ALTER TABLE "jobs"
ADD FOREIGN KEY ("employer_id") REFERENCES "users" ("id");
ALTER TABLE "sessions"
ADD FOREIGN KEY ("username") REFERENCES "users" ("username");
ALTER TABLE "salary"
ADD FOREIGN KEY ("id") REFERENCES "jobs" ("salary");
ALTER TABLE "metaData"
ADD FOREIGN KEY ("job_id") REFERENCES "jobs" ("id");
ALTER TABLE "hasProbationaryPeriod"
ADD FOREIGN KEY ("job_id") REFERENCES "jobs" ("id");
ALTER TABLE "salary"
ADD FOREIGN KEY ("fineGrainedSalaryInformation") REFERENCES "fineGrainedSalaryInformation" ("id");
ALTER TABLE "salary"
ADD FOREIGN KEY ("taskBasedSalaryInformation") REFERENCES "taskBasedSalaryInformation" ("id");