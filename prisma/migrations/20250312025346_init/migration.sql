/*
  Warnings:

  - You are about to drop the column `addressId` on the `Company` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_addressId_fkey";

-- DropIndex
DROP INDEX "Company_addressId_key";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "addressId";
