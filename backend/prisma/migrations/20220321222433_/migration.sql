-- DropForeignKey
ALTER TABLE "TestCase" DROP CONSTRAINT "TestCase_userId_fkey";

-- DropForeignKey
ALTER TABLE "TestCaseSubmission" DROP CONSTRAINT "TestCaseSubmission_userId_fkey";

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCaseSubmission" ADD CONSTRAINT "TestCaseSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
