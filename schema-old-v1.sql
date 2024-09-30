CREATE TABLE "persons" (
  "username" varchar PRIMARY KEY,
  "hashed_password" varchar NOT NULL,
  "first_name" varchar NOT NULL,
  "last_name" varchar NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "address" varchar NOT NULL,
  "address2" varchar NOT NULL,
  "city" varchar NOT NULL,
  "country" varchar NOT NULL,
  "is_email_verified" bool NOT NULL DEFAULT false,
  "password_changed_at" timestamptz NOT NULL DEFAULT '0001-01-01',
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);
CREATE TABLE "employers" (
  "id" BIGSERIAL PRIMARY KEY,
  "username" varchar NOT NULL,
  "employer_type" varchar NOT NULL,
  "employer_is_active" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);
CREATE TABLE "applicants" (
  "id" BIGSERIAL PRIMARY KEY,
  "username" varchar NOT NULL,
  "applicant_is_active" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT (now())
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
CREATE TABLE "verify_emails" (
  "id" BIGSERIAL PRIMARY KEY,
  "username" varchar NOT NULL,
  "email" varchar NOT NULL,
  "secret_code" varchar NOT NULL,
  "is_used" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "expired_at" timestamptz NOT NULL DEFAULT (now() + interval '15 minutes')
);
CREATE TABLE "jobs" (
  "id" BIGSERIAL PRIMARY KEY,
  "employer_id" varchar NOT NULL,
  "title" varchar NOT NULL,
  "description" varchar NOT NULL,
  "qualification" varchar NOT NULL,
  "complimentary_qualification" varchar NOT NULL,
  "job_type" varchar NOT NULL,
  "visa_sponsorship" varchar NOT NULL,
  "remote_posible" varchar NOT NULL,
  "preferred_timezones" varchar NOT NULL,
  "location" varchar NOT NULL,
  "salary" varchar NOT NULL,
  "date_posted" varchar NOT NULL,
  "relocation" varchar NOT NULL,
  "skills" varchar NOT NULL,
  "employer_hiring_contact" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);
CREATE TABLE "applications" (
  "id" BIGSERIAL PRIMARY KEY,
  "username" varchar NOT NULL,
  "job_id" BigInt NOT NULL,
  "application_text" varchar NOT NULL,
  "resume" boolean NOT NULL,
  "cover_letter" boolean NOT NULL,
  "referral_information" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);
CREATE TABLE "messages" (
  "id" BIGSERIAL PRIMARY KEY,
  "sender_username" varchar UNIQUE NOT NULL,
  "reciever_username" varchar NOT NULL,
  "content" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);
CREATE TABLE "notifications" (
  "id" BIGSERIAL PRIMARY KEY,
  "username" varchar UNIQUE NOT NULL,
  "content" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);
CREATE TABLE "ratings" (
  "id" BIGSERIAL PRIMARY KEY,
  "reviewer" varchar UNIQUE NOT NULL,
  "applicant_id" bigint NOT NULL,
  "ratings" bigint NOT NULL,
  "review_text" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);
CREATE INDEX ON "employers" ("username");
CREATE INDEX ON "applicants" ("username");
CREATE INDEX ON "jobs" ("employer_id");
CREATE INDEX ON "applications" ("job_id");
ALTER TABLE "verify_emails"
ADD FOREIGN KEY ("username") REFERENCES "persons" ("username");
ALTER TABLE "employers"
ADD FOREIGN KEY ("username") REFERENCES "persons" ("username");
ALTER TABLE "applicants"
ADD FOREIGN KEY ("username") REFERENCES "persons" ("username");
ALTER TABLE "jobs"
ADD FOREIGN KEY ("employer_id") REFERENCES "employers" ("id");
ALTER TABLE "messages"
ADD FOREIGN KEY ("sender_username") REFERENCES "persons" ("username");
ALTER TABLE "messages"
ADD FOREIGN KEY ("reciever_username") REFERENCES "persons" ("username");
ALTER TABLE "notifications"
ADD FOREIGN KEY ("username") REFERENCES "persons" ("username");
ALTER TABLE "sessions"
ADD FOREIGN KEY ("username") REFERENCES "persons" ("username");
ALTER TABLE "ratings"
ADD FOREIGN KEY ("reviewer") REFERENCES "applicants" ("username");
ALTER TABLE "applicantions"
ADD FOREIGN KEY ("username") REFERENCES "persons" ("username");
ALTER TABLE "applications"
ADD FOREIGN KEY ("job_id") REFERENCES "jobs" ("id");