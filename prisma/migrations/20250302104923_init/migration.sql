/*
  Warnings:

  - You are about to drop the column `refresh_token` on the `Session` table. All the data in the column will be lost.
  - Added the required column `valid` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "refresh_token",
ADD COLUMN     "valid" BOOLEAN NOT NULL;
