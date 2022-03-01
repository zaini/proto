/*
  Warnings:

  - The primary key for the `AssignmentSubmission` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "AssignmentSubmission" DROP CONSTRAINT "AssignmentSubmission_pkey",
ADD CONSTRAINT "AssignmentSubmission_pkey" PRIMARY KEY ("userId", "assignmentId", "problemId");
