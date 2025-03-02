/*
  Warnings:

  - You are about to drop the column `job_id` on the `HasProbationaryPeriod` table. All the data in the column will be lost.
  - You are about to drop the column `jobId` on the `MetaData` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[job_id]` on the table `MetaData` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `period` to the `HasProbationaryPeriod` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MetaData" DROP CONSTRAINT "MetaData_jobId_fkey";

-- DropIndex
DROP INDEX "MetaData_jobId_key";

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Address_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "HasProbationaryPeriod" DROP COLUMN "job_id",
ADD COLUMN     "period" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MetaData" DROP COLUMN "jobId";

-- CreateIndex
CREATE UNIQUE INDEX "MetaData_job_id_key" ON "MetaData"("job_id");

-- AddForeignKey
ALTER TABLE "MetaData" ADD CONSTRAINT "MetaData_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
