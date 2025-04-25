/*
  Warnings:

  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FineGrainedSalaryInformation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HasProbationaryPeriod` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Job` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MetaData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Salary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaskBasedSalaryInformation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY', 'INTERNSHIP', 'FREELANCE', 'REMOTE');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED', 'FILLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'REVIEWED', 'SHORTLISTED', 'INTERVIEW', 'REJECTED', 'HIRED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EMPLOYER', 'JOBSEEKER', 'RECRUITER');

-- CreateEnum
CREATE TYPE "PayPeriod" AS ENUM ('HOURLY', 'DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_addressId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_company_id_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_hasProbationPeriodId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_metadataId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_salaryId_fkey";

-- DropForeignKey
ALTER TABLE "Salary" DROP CONSTRAINT "Salary_fineGrainedSalaryInformationId_fkey";

-- DropForeignKey
ALTER TABLE "Salary" DROP CONSTRAINT "Salary_taskBasedSalaryInformationId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_username_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_addressId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_companyId_fkey";

-- DropTable
DROP TABLE "Address";

-- DropTable
DROP TABLE "Company";

-- DropTable
DROP TABLE "FineGrainedSalaryInformation";

-- DropTable
DROP TABLE "HasProbationaryPeriod";

-- DropTable
DROP TABLE "Job";

-- DropTable
DROP TABLE "MetaData";

-- DropTable
DROP TABLE "Salary";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "TaskBasedSalaryInformation";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "website" VARCHAR(255),
    "size" VARCHAR(100) NOT NULL,
    "industry" VARCHAR(100),
    "description" TEXT,
    "logo" VARCHAR(255),
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "addressId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "street" VARCHAR(255) NOT NULL,
    "street2" VARCHAR(255),
    "city" VARCHAR(100),
    "state_province_code" VARCHAR(20),
    "state_province_name" VARCHAR(100),
    "postal_code" VARCHAR(20),
    "country_code" VARCHAR(10),
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "country" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "subtitle" VARCHAR(255),
    "description" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "complimentary_qualification" TEXT,
    "job_type" "JobType" NOT NULL DEFAULT 'FULL_TIME',
    "visa_sponsorship" BOOLEAN NOT NULL DEFAULT false,
    "remote_possible" BOOLEAN NOT NULL DEFAULT false,
    "preferred_timezones" VARCHAR(255),
    "location" VARCHAR(255) NOT NULL,
    "date_posted" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "application_deadline" TIMESTAMP(3),
    "relocation" BOOLEAN NOT NULL DEFAULT false,
    "skills" VARCHAR(100)[],
    "employer_hiring_contact" VARCHAR(255),
    "status" "JobStatus" NOT NULL DEFAULT 'DRAFT',
    "company_id" TEXT NOT NULL,
    "salaryId" TEXT NOT NULL,
    "metadataId" TEXT NOT NULL,
    "hasProbationPeriodId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_applications" (
    "id" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "coverLetter" TEXT,
    "resumeUrl" VARCHAR(255),
    "jobId" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "probationary_periods" (
    "id" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "probationary_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_metadata" (
    "id" TEXT NOT NULL,
    "atsName" VARCHAR(255),
    "employersName" VARCHAR(255) NOT NULL,
    "sourceUrl" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salaries" (
    "id" TEXT NOT NULL,
    "currency" VARCHAR(10) NOT NULL,
    "maximumMinor" VARCHAR(255) NOT NULL,
    "minimumMinor" VARCHAR(255) NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "payPeriod" "PayPeriod" NOT NULL DEFAULT 'YEARLY',
    "fineGrainedSalaryInformationId" TEXT NOT NULL,
    "taskBasedSalaryInformationId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "salaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fine_grained_salary_info" (
    "id" TEXT NOT NULL,
    "totalSalaryMinor" VARCHAR(255) NOT NULL,
    "workingHours" INTEGER NOT NULL,
    "totalOvertimeHours" INTEGER,
    "statutoryOvertimeHours" INTEGER,
    "fixedOvertimeSalaryMinor" VARCHAR(255),
    "fixedOvertimePay" BOOLEAN NOT NULL DEFAULT false,
    "benefits" VARCHAR(255)[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fine_grained_salary_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_based_salary_info" (
    "id" TEXT NOT NULL,
    "taskLengthMinutes" INTEGER NOT NULL,
    "taskDescription" TEXT,
    "ratePerTask" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_based_salary_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "hashed_password" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" TEXT NOT NULL,
    "phone" VARCHAR(20),
    "bio" TEXT,
    "profile_image" VARCHAR(255),
    "role" "UserRole" NOT NULL DEFAULT 'JOBSEEKER',
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "verificationCode" TEXT,
    "passwordResetCode" TEXT,
    "passwordResetExpires" TIMESTAMP(3),
    "companyId" TEXT,
    "addressId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_skills" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "level" "SkillLevel" NOT NULL DEFAULT 'BEGINNER',
    "yearsOfExperience" INTEGER,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education" (
    "id" TEXT NOT NULL,
    "institution" VARCHAR(255) NOT NULL,
    "degree" VARCHAR(255) NOT NULL,
    "fieldOfStudy" VARCHAR(255) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_experience" (
    "id" TEXT NOT NULL,
    "company" VARCHAR(255) NOT NULL,
    "position" VARCHAR(255) NOT NULL,
    "location" VARCHAR(255),
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "current" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "user_agent" VARCHAR(255) NOT NULL,
    "client_ip" VARCHAR(100) NOT NULL,
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_email_key" ON "companies"("email");

-- CreateIndex
CREATE UNIQUE INDEX "companies_addressId_key" ON "companies"("addressId");

-- CreateIndex
CREATE INDEX "companies_name_idx" ON "companies"("name");

-- CreateIndex
CREATE INDEX "companies_industry_idx" ON "companies"("industry");

-- CreateIndex
CREATE INDEX "companies_size_idx" ON "companies"("size");

-- CreateIndex
CREATE INDEX "companies_created_at_idx" ON "companies"("created_at");

-- CreateIndex
CREATE INDEX "addresses_city_idx" ON "addresses"("city");

-- CreateIndex
CREATE INDEX "addresses_country_idx" ON "addresses"("country");

-- CreateIndex
CREATE INDEX "addresses_postal_code_idx" ON "addresses"("postal_code");

-- CreateIndex
CREATE INDEX "addresses_latitude_longitude_idx" ON "addresses"("latitude", "longitude");

-- CreateIndex
CREATE UNIQUE INDEX "jobs_salaryId_key" ON "jobs"("salaryId");

-- CreateIndex
CREATE UNIQUE INDEX "jobs_metadataId_key" ON "jobs"("metadataId");

-- CreateIndex
CREATE UNIQUE INDEX "jobs_hasProbationPeriodId_key" ON "jobs"("hasProbationPeriodId");

-- CreateIndex
CREATE INDEX "jobs_title_idx" ON "jobs"("title");

-- CreateIndex
CREATE INDEX "jobs_job_type_idx" ON "jobs"("job_type");

-- CreateIndex
CREATE INDEX "jobs_remote_possible_idx" ON "jobs"("remote_possible");

-- CreateIndex
CREATE INDEX "jobs_date_posted_idx" ON "jobs"("date_posted");

-- CreateIndex
CREATE INDEX "jobs_status_idx" ON "jobs"("status");

-- CreateIndex
CREATE INDEX "jobs_company_id_idx" ON "jobs"("company_id");

-- CreateIndex
CREATE INDEX "job_applications_status_idx" ON "job_applications"("status");

-- CreateIndex
CREATE INDEX "job_applications_jobId_idx" ON "job_applications"("jobId");

-- CreateIndex
CREATE INDEX "job_applications_applicantId_idx" ON "job_applications"("applicantId");

-- CreateIndex
CREATE INDEX "job_applications_created_at_idx" ON "job_applications"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "salaries_fineGrainedSalaryInformationId_key" ON "salaries"("fineGrainedSalaryInformationId");

-- CreateIndex
CREATE UNIQUE INDEX "salaries_taskBasedSalaryInformationId_key" ON "salaries"("taskBasedSalaryInformationId");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_addressId_key" ON "users"("addressId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_is_active_idx" ON "users"("is_active");

-- CreateIndex
CREATE INDEX "users_companyId_idx" ON "users"("companyId");

-- CreateIndex
CREATE INDEX "user_skills_name_idx" ON "user_skills"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_skills_userId_name_key" ON "user_skills"("userId", "name");

-- CreateIndex
CREATE INDEX "education_userId_idx" ON "education"("userId");

-- CreateIndex
CREATE INDEX "work_experience_userId_idx" ON "work_experience"("userId");

-- CreateIndex
CREATE INDEX "sessions_username_idx" ON "sessions"("username");

-- CreateIndex
CREATE INDEX "sessions_valid_idx" ON "sessions"("valid");

-- CreateIndex
CREATE INDEX "sessions_expires_at_idx" ON "sessions"("expires_at");

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_salaryId_fkey" FOREIGN KEY ("salaryId") REFERENCES "salaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_metadataId_fkey" FOREIGN KEY ("metadataId") REFERENCES "job_metadata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_hasProbationPeriodId_fkey" FOREIGN KEY ("hasProbationPeriodId") REFERENCES "probationary_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salaries" ADD CONSTRAINT "salaries_fineGrainedSalaryInformationId_fkey" FOREIGN KEY ("fineGrainedSalaryInformationId") REFERENCES "fine_grained_salary_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salaries" ADD CONSTRAINT "salaries_taskBasedSalaryInformationId_fkey" FOREIGN KEY ("taskBasedSalaryInformationId") REFERENCES "task_based_salary_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education" ADD CONSTRAINT "education_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_experience" ADD CONSTRAINT "work_experience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_username_fkey" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE CASCADE ON UPDATE CASCADE;
