/*
  Warnings:

  - You are about to drop the column `userId` on the `Assignment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "ProblemsOnAssignments" (
    "assignmentId" INTEGER NOT NULL,
    "problemId" INTEGER NOT NULL,

    CONSTRAINT "ProblemsOnAssignments_pkey" PRIMARY KEY ("assignmentId","problemId")
);

-- AddForeignKey
ALTER TABLE "ProblemsOnAssignments" ADD CONSTRAINT "ProblemsOnAssignments_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemsOnAssignments" ADD CONSTRAINT "ProblemsOnAssignments_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
