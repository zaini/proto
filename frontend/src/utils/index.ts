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
  70: "Python (2.7.9)",
  63: "JavaScript (Node.js 12.14.0)",
  62: "Java (OpenJDK 13.0.1)",
};

export const LangaugeCodeToLanguageSupport: { [languageCode: number]: any } = {
  71: "python",
  70: "python",
  63: "javascript",
  62: "java",
};
