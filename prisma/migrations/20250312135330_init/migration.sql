/*
  Warnings:

  - You are about to drop the column `salaryId` on the `FineGrainedSalaryInformation` table. All the data in the column will be lost.
  - You are about to drop the column `jobId` on the `HasProbationaryPeriod` table. All the data in the column will be lost.
  - You are about to drop the column `job_id` on the `MetaData` table. All the data in the column will be lost.
  - You are about to drop the column `jobId` on the `Salary` table. All the data in the column will be lost.
  - You are about to drop the column `salaryId` on the `TaskBasedSalaryInformation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[salaryId]` on the table `Job` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[metadataId]` on the table `Job` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hasProbationPeriodId]` on the table `Job` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fineGrainedSalaryInformationId]` on the table `Salary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[taskBasedSalaryInformationId]` on the table `Salary` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hasProbationPeriodId` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metadataId` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salaryId` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fineGrainedSalaryInformationId` to the `Salary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taskBasedSalaryInformationId` to the `Salary` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FineGrainedSalaryInformation" DROP CONSTRAINT "FineGrainedSalaryInformation_salaryId_fkey";

-- DropForeignKey
ALTER TABLE "HasProbationaryPeriod" DROP CONSTRAINT "HasProbationaryPeriod_jobId_fkey";

-- DropForeignKey
ALTER TABLE "MetaData" DROP CONSTRAINT "MetaData_job_id_fkey";

-- DropForeignKey
ALTER TABLE "Salary" DROP CONSTRAINT "Salary_jobId_fkey";

-- DropForeignKey
ALTER TABLE "TaskBasedSalaryInformation" DROP CONSTRAINT "TaskBasedSalaryInformation_salaryId_fkey";

-- DropIndex
DROP INDEX "FineGrainedSalaryInformation_salaryId_key";

-- DropIndex
DROP INDEX "HasProbationaryPeriod_jobId_key";

-- DropIndex
DROP INDEX "MetaData_job_id_key";

-- DropIndex
DROP INDEX "Salary_jobId_key";

-- DropIndex
DROP INDEX "TaskBasedSalaryInformation_salaryId_key";

-- AlterTable
ALTER TABLE "FineGrainedSalaryInformation" DROP COLUMN "salaryId";

-- AlterTable
ALTER TABLE "HasProbationaryPeriod" DROP COLUMN "jobId";

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "hasProbationPeriodId" TEXT NOT NULL,
ADD COLUMN     "metadataId" TEXT NOT NULL,
ADD COLUMN     "salaryId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MetaData" DROP COLUMN "job_id";

-- AlterTable
ALTER TABLE "Salary" DROP COLUMN "jobId",
ADD COLUMN     "fineGrainedSalaryInformationId" TEXT NOT NULL,
ADD COLUMN     "taskBasedSalaryInformationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TaskBasedSalaryInformation" DROP COLUMN "salaryId";

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
