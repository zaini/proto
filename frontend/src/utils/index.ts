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

export const LanguageCodeToName: { [languageCode: number]: string } = {
  71: "Python (3.8.1)",
  36: "Python (2.7.9)",
  63: "JavaScript (Node.js 12.14.0)",
  74: "TypeScript (3.7.4)",
  28: "Java 7",
  27: "Java 8",
};

export const LangaugeCodeToLanguageSupport: { [languageCode: number]: any } = {
  71: "python",
  36: "python",
  63: "javascript",
  74: "typescript",
  28: "java",
  27: "java",
};
