/*
  Warnings:

  - Added the required column `userId` to the `TestCase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `TestCaseSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestCase" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TestCaseSubmission" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCaseSubmission" ADD CONSTRAINT "TestCaseSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
