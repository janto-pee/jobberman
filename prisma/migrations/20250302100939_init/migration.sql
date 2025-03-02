-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "hashed_password" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "website" VARCHAR(255) NOT NULL,
    "size" VARCHAR(255) NOT NULL,
    "country" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "refresh_token" VARCHAR(255) NOT NULL,
    "user_agent" VARCHAR(255) NOT NULL,
    "client_ip" VARCHAR(255) NOT NULL,
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "username" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "subtitle" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "qualification" VARCHAR(255) NOT NULL,
    "complimentary_qualification" VARCHAR(255) NOT NULL,
    "job_type" VARCHAR(255) NOT NULL,
    "visa_sponsorship" VARCHAR(255) NOT NULL,
    "remote_posible" VARCHAR(255) NOT NULL,
    "preferred_timezones" VARCHAR(255) NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "date_posted" VARCHAR(255) NOT NULL,
    "relocation" VARCHAR(255) NOT NULL,
    "skills" VARCHAR(255) NOT NULL,
    "employer_hiring_contact" VARCHAR(255) NOT NULL,
    "descriptionFormatting" VARCHAR(255) NOT NULL,
    "probationaryPeriod" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" VARCHAR(255) NOT NULL,
    "username" TEXT NOT NULL,
    "street" VARCHAR(255) NOT NULL,
    "street2" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "state_province_code" VARCHAR(255) NOT NULL,
    "state_province_name" VARCHAR(255) NOT NULL,
    "postal_code" VARCHAR(255) NOT NULL,
    "country_code" VARCHAR(255) NOT NULL,
    "latitude" INTEGER NOT NULL,
    "longitude" INTEGER NOT NULL,
    "country" VARCHAR(255) NOT NULL
);

-- CreateTable
CREATE TABLE "Salary" (
    "id" TEXT NOT NULL,
    "currency" VARCHAR(255) NOT NULL,
    "maximumMinor" VARCHAR(255) NOT NULL,
    "minimumMinor" VARCHAR(255) NOT NULL,
    "period" VARCHAR(255) NOT NULL,
    "jobId" TEXT NOT NULL,

    CONSTRAINT "Salary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FineGrainedSalaryInformation" (
    "id" TEXT NOT NULL,
    "totalSalaryMinor" VARCHAR(255) NOT NULL,
    "workingHours" INTEGER NOT NULL,
    "totalOvertimeHours" INTEGER NOT NULL,
    "statutoryOvertimeHours" INTEGER NOT NULL,
    "fixedOvertimeSalaryMinor" VARCHAR(255) NOT NULL,
    "fixedOvertimePay" BOOLEAN NOT NULL,
    "salaryId" TEXT NOT NULL,

    CONSTRAINT "FineGrainedSalaryInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskBasedSalaryInformation" (
    "id" TEXT NOT NULL,
    "taskLengthMinutes" VARCHAR(255) NOT NULL,
    "taskDescription" VARCHAR(255) NOT NULL,
    "salaryId" TEXT NOT NULL,

    CONSTRAINT "TaskBasedSalaryInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HasProbationaryPeriod" (
    "id" TEXT NOT NULL,
    "job_id" BIGINT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "jobId" TEXT NOT NULL,

    CONSTRAINT "HasProbationaryPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetaData" (
    "id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "atsName" VARCHAR(255) NOT NULL,
    "employersName" VARCHAR(255) NOT NULL,
    "jobId" TEXT NOT NULL,

    CONSTRAINT "MetaData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_username_key" ON "Session"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Job_username_key" ON "Job"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Address_username_key" ON "Address"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Salary_jobId_key" ON "Salary"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "FineGrainedSalaryInformation_salaryId_key" ON "FineGrainedSalaryInformation"("salaryId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskBasedSalaryInformation_salaryId_key" ON "TaskBasedSalaryInformation"("salaryId");

-- CreateIndex
CREATE UNIQUE INDEX "HasProbationaryPeriod_jobId_key" ON "HasProbationaryPeriod"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "MetaData_jobId_key" ON "MetaData"("jobId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Salary" ADD CONSTRAINT "Salary_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FineGrainedSalaryInformation" ADD CONSTRAINT "FineGrainedSalaryInformation_salaryId_fkey" FOREIGN KEY ("salaryId") REFERENCES "Salary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskBasedSalaryInformation" ADD CONSTRAINT "TaskBasedSalaryInformation_salaryId_fkey" FOREIGN KEY ("salaryId") REFERENCES "Salary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HasProbationaryPeriod" ADD CONSTRAINT "HasProbationaryPeriod_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetaData" ADD CONSTRAINT "MetaData_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
