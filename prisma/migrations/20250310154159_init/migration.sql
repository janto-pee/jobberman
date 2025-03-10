/*
  Warnings:

  - You are about to drop the column `username` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Job` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[company_id]` on the table `Job` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `company_id` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_username_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_username_fkey";

-- DropIndex
DROP INDEX "Company_username_key";

-- DropIndex
DROP INDEX "Job_username_key";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "username";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "username",
ADD COLUMN     "company_id" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "companyId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Job_company_id_key" ON "Job"("company_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
