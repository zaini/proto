/*
  Warnings:

  - The primary key for the `Problem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Problem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ProblemsOnAssignments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `problemId` on the `ProblemsOnAssignments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "ProblemsOnAssignments" DROP CONSTRAINT "ProblemsOnAssignments_problemId_fkey";

-- AlterTable
ALTER TABLE "Problem" DROP CONSTRAINT "Problem_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Problem_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProblemsOnAssignments" DROP CONSTRAINT "ProblemsOnAssignments_pkey",
DROP COLUMN "problemId",
ADD COLUMN     "problemId" INTEGER NOT NULL,
ADD CONSTRAINT "ProblemsOnAssignments_pkey" PRIMARY KEY ("problemId", "assignmentId");

-- AddForeignKey
ALTER TABLE "ProblemsOnAssignments" ADD CONSTRAINT "ProblemsOnAssignments_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
