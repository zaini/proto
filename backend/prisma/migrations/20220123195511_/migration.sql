-- CreateTable
CREATE TABLE "Submission" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "submissionResults" JSONB NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
