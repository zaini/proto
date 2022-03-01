-- CreateTable
CREATE TABLE "AssignmentSubmission" (
    "userId" INTEGER NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "problemId" INTEGER NOT NULL,
    "submissionId" INTEGER NOT NULL,

    CONSTRAINT "AssignmentSubmission_pkey" PRIMARY KEY ("userId","assignmentId","problemId","submissionId")
);

-- AddForeignKey
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
