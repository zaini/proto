/*
  Warnings:

  - Added the required column `avgMemory` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avgTime` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passed` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "avgMemory" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "avgTime" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "passed" BOOLEAN NOT NULL;
