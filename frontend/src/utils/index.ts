import { AssignmentSubmission } from "../gql-types";

export enum AccountType {
  Learner = "learner",
  Teacher = "teacher",
}

export type AssignmentSubmissionMap = {
  [problemId: string]: AssignmentSubmission;
};

export type AssignmentSubmissionQueryData = {
  assignmentId: number;
  userId: number;
};
