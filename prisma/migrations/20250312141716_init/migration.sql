-- AlterTable
ALTER TABLE "FineGrainedSalaryInformation" ALTER COLUMN "totalOvertimeHours" DROP NOT NULL,
ALTER COLUMN "statutoryOvertimeHours" DROP NOT NULL,
ALTER COLUMN "fixedOvertimeSalaryMinor" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TaskBasedSalaryInformation" ALTER COLUMN "taskDescription" DROP NOT NULL;
