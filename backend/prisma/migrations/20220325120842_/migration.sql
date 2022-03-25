/*
  Warnings:

  - A unique constraint covering the columns `[organisationId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "organisationId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_organisationId_key" ON "User"("organisationId");
