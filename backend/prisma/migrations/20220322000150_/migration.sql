-- DropForeignKey
ALTER TABLE "Problem" DROP CONSTRAINT "Problem_specificationId_fkey";

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_specificationId_fkey" FOREIGN KEY ("specificationId") REFERENCES "Specification"("id") ON DELETE CASCADE ON UPDATE CASCADE;
