-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "website" VARCHAR(255) NOT NULL,
    "size" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "addressId" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "street" VARCHAR(255) NOT NULL,
    "street2" VARCHAR(255),
    "city" VARCHAR(255),
    "state_province_code" VARCHAR(255),
    "state_province_name" VARCHAR(255),
    "postal_code" VARCHAR(255),
    "country_code" VARCHAR(255),
    "latitude" INTEGER,
    "longitude" INTEGER,
    "country" VARCHAR(255) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
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
    "company_id" TEXT NOT NULL,
    "salaryId" TEXT NOT NULL,
    "metadataId" TEXT NOT NULL,
    "hasProbationPeriodId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HasProbationaryPeriod" (
    "id" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "HasProbationaryPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetaData" (
    "id" TEXT NOT NULL,
    "atsName" VARCHAR(255) NOT NULL,
    "employersName" VARCHAR(255) NOT NULL,

    CONSTRAINT "MetaData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Salary" (
    "id" TEXT NOT NULL,
    "currency" VARCHAR(255) NOT NULL,
    "maximumMinor" VARCHAR(255) NOT NULL,
    "minimumMinor" VARCHAR(255) NOT NULL,
    "fineGrainedSalaryInformationId" TEXT NOT NULL,
    "taskBasedSalaryInformationId" TEXT NOT NULL,

    CONSTRAINT "Salary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FineGrainedSalaryInformation" (
    "id" TEXT NOT NULL,
    "totalSalaryMinor" VARCHAR(255) NOT NULL,
    "workingHours" INTEGER NOT NULL,
    "totalOvertimeHours" INTEGER,
    "statutoryOvertimeHours" INTEGER,
    "fixedOvertimeSalaryMinor" VARCHAR(255),
    "fixedOvertimePay" BOOLEAN NOT NULL,

    CONSTRAINT "FineGrainedSalaryInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskBasedSalaryInformation" (
    "id" TEXT NOT NULL,
    "taskLengthMinutes" VARCHAR(255) NOT NULL,
    "taskDescription" VARCHAR(255),

    CONSTRAINT "TaskBasedSalaryInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "hashed_password" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "verificationCode" TEXT,
    "passwordResetCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT,
    "addressId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "user_agent" VARCHAR(255) NOT NULL,
    "client_ip" VARCHAR(255) NOT NULL,
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_addressId_key" ON "Company"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "Job_salaryId_key" ON "Job"("salaryId");

-- CreateIndex
CREATE UNIQUE INDEX "Job_metadataId_key" ON "Job"("metadataId");

-- CreateIndex
CREATE UNIQUE INDEX "Job_hasProbationPeriodId_key" ON "Job"("hasProbationPeriodId");

-- CreateIndex
CREATE UNIQUE INDEX "Salary_fineGrainedSalaryInformationId_key" ON "Salary"("fineGrainedSalaryInformationId");

-- CreateIndex
CREATE UNIQUE INDEX "Salary_taskBasedSalaryInformationId_key" ON "Salary"("taskBasedSalaryInformationId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_addressId_key" ON "User"("addressId");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_salaryId_fkey" FOREIGN KEY ("salaryId") REFERENCES "Salary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_metadataId_fkey" FOREIGN KEY ("metadataId") REFERENCES "MetaData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_hasProbationPeriodId_fkey" FOREIGN KEY ("hasProbationPeriodId") REFERENCES "HasProbationaryPeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Salary" ADD CONSTRAINT "Salary_fineGrainedSalaryInformationId_fkey" FOREIGN KEY ("fineGrainedSalaryInformationId") REFERENCES "FineGrainedSalaryInformation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Salary" ADD CONSTRAINT "Salary_taskBasedSalaryInformationId_fkey" FOREIGN KEY ("taskBasedSalaryInformationId") REFERENCES "TaskBasedSalaryInformation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
