/*
  Warnings:

  - The primary key for the `Problem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ProblemsOnAssignments` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "ProblemsOnAssignments" DROP CONSTRAINT "ProblemsOnAssignments_problemId_fkey";

-- AlterTable
ALTER TABLE "Problem" DROP CONSTRAINT "Problem_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Problem_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Problem_id_seq";

-- AlterTable
ALTER TABLE "ProblemsOnAssignments" DROP CONSTRAINT "ProblemsOnAssignments_pkey",
ALTER COLUMN "problemId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ProblemsOnAssignments_pkey" PRIMARY KEY ("problemId", "assignmentId");

-- AddForeignKey
ALTER TABLE "ProblemsOnAssignments" ADD CONSTRAINT "ProblemsOnAssignments_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
