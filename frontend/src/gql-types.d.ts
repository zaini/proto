export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Assignment = {
  __typename?: "Assignment";
  classroom: Classroom;
  createdAt: Scalars["String"];
  dueDate: Scalars["String"];
  id: Scalars["ID"];
  problems?: Maybe<Array<Problem>>;
  setDate: Scalars["String"];
};

export type AuthResponse = {
  __typename?: "AuthResponse";
  accessToken?: Maybe<Scalars["String"]>;
};

export type Classroom = {
  __typename?: "Classroom";
  assignments: Array<Maybe<Assignment>>;
  createdAt: Scalars["String"];
  creator?: Maybe<User>;
  id: Scalars["ID"];
  users: Array<Maybe<User>>;
};

export type Mutation = {
  __typename?: "Mutation";
  createAssignment?: Maybe<Assignment>;
  createClassroom?: Maybe<Classroom>;
  createProblem?: Maybe<Problem>;
  submitTests?: Maybe<TestSubmissionResult>;
};

export type MutationCreateAssignmentArgs = {
  classroomId: Scalars["ID"];
  problemIds?: InputMaybe<Array<Scalars["ID"]>>;
};

export type MutationCreateClassroomArgs = {
  creatorId: Scalars["ID"];
};

export type MutationCreateProblemArgs = {
  creatorId: Scalars["ID"];
  specification: Scalars["String"];
};

export type MutationSubmitTestsArgs = {
  code?: InputMaybe<Scalars["String"]>;
  language?: InputMaybe<Scalars["Int"]>;
  problemId: Scalars["ID"];
  submissionType?: InputMaybe<SubmissionType>;
  testCases?: InputMaybe<Array<TestCaseInput>>;
};

export type Problem = {
  __typename?: "Problem";
  creator: User;
  dislikes?: Maybe<Scalars["Int"]>;
  id: Scalars["ID"];
  likes?: Maybe<Scalars["Int"]>;
  specification?: Maybe<Specification>;
};

export type Query = {
  __typename?: "Query";
  getAssignments?: Maybe<Array<Assignment>>;
  getClassrooms?: Maybe<Array<Classroom>>;
  getProblem?: Maybe<Problem>;
  getProblems?: Maybe<Array<Problem>>;
  getUsers?: Maybe<Array<User>>;
  isLoggedIn: Scalars["String"];
};

export type QueryGetProblemArgs = {
  problemId: Scalars["ID"];
};

export type Specification = {
  __typename?: "Specification";
  description?: Maybe<Scalars["String"]>;
  initialCode?: Maybe<Scalars["String"]>;
  title?: Maybe<Scalars["String"]>;
};

export enum SubmissionType {
  All = "ALL",
  Custom = "CUSTOM",
  Problem = "PROBLEM",
}

export type TestCase = {
  __typename?: "TestCase";
  expectedOutput: Scalars["String"];
  id: Scalars["ID"];
  stdin: Scalars["String"];
};

export type TestCaseInput = {
  expectedOutput: Scalars["String"];
  id: Scalars["ID"];
  stdin: Scalars["String"];
};

export type TestCaseResult = {
  __typename?: "TestCaseResult";
  id: Scalars["ID"];
  memory?: Maybe<Scalars["Float"]>;
  passed: Scalars["Boolean"];
  stderr?: Maybe<Scalars["String"]>;
  stdout?: Maybe<Scalars["String"]>;
  testCase: TestCase;
  time?: Maybe<Scalars["Float"]>;
};

export type TestSubmissionResult = {
  __typename?: "TestSubmissionResult";
  results?: Maybe<Array<Maybe<TestCaseResult>>>;
  submissionType?: Maybe<SubmissionType>;
};

export type User = {
  __typename?: "User";
  UsersOnClassrooms?: Maybe<Array<Maybe<Classroom>>>;
  classrooms: Array<Maybe<Classroom>>;
  createdAt: Scalars["String"];
  githubId: Scalars["String"];
  id: Scalars["ID"];
  problems: Array<Maybe<Problem>>;
  username: Scalars["String"];
};
