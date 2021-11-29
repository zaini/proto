/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Classroom` table. All the data in the column will be lost.
  - The primary key for the `ProblemsOnAssignments` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Classroom" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "ProblemsOnAssignments" DROP CONSTRAINT "ProblemsOnAssignments_pkey",
ADD COLUMN     "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "ProblemsOnAssignments_pkey" PRIMARY KEY ("problemId", "assignmentId");

-- CreateTable
CREATE TABLE "UsersOnClassrooms" (
    "userId" INTEGER NOT NULL,
    "classroomId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsersOnClassrooms_pkey" PRIMARY KEY ("userId","classroomId")
);

-- CreateTable
CREATE TABLE "AssignmentsOnClassrooms" (
    "assignmentId" INTEGER NOT NULL,
    "classroomId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssignmentsOnClassrooms_pkey" PRIMARY KEY ("assignmentId","classroomId")
);

-- AddForeignKey
ALTER TABLE "UsersOnClassrooms" ADD CONSTRAINT "UsersOnClassrooms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnClassrooms" ADD CONSTRAINT "UsersOnClassrooms_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentsOnClassrooms" ADD CONSTRAINT "AssignmentsOnClassrooms_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentsOnClassrooms" ADD CONSTRAINT "AssignmentsOnClassrooms_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
