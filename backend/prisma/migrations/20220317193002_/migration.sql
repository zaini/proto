/*
  Warnings:

  - Added the required column `compile_output` to the `TestCaseSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestCaseSubmission" ADD COLUMN     "compile_output" TEXT NOT NULL;
