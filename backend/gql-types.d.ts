export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Assignment = {
  __typename?: 'Assignment';
  classroom: Classroom;
  createdAt: Scalars['String'];
  dueDate: Scalars['String'];
  id: Scalars['ID'];
  problems?: Maybe<Array<Problem>>;
  setDate: Scalars['String'];
  submissions: Array<Submission>;
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  accessToken?: Maybe<Scalars['String']>;
};

export type Classroom = {
  __typename?: 'Classroom';
  assignments: Array<Assignment>;
  createdAt: Scalars['String'];
  creator: User;
  id: Scalars['ID'];
  name: Scalars['String'];
  password?: Maybe<Scalars['String']>;
  users?: Maybe<Array<User>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createAssignment?: Maybe<Assignment>;
  createClassroom?: Maybe<Classroom>;
  createProblem?: Maybe<Problem>;
  joinClassroom?: Maybe<Classroom>;
  submitProblem: Submission;
  submitTests: TestSubmissionResult;
};


export type MutationCreateAssignmentArgs = {
  classroomId: Scalars['ID'];
  problemIds?: InputMaybe<Array<Scalars['ID']>>;
};


export type MutationCreateClassroomArgs = {
  classroomName: Scalars['String'];
  password?: InputMaybe<Scalars['String']>;
};


export type MutationCreateProblemArgs = {
  creatorId: Scalars['ID'];
  specification: Scalars['String'];
};


export type MutationJoinClassroomArgs = {
  classroomId: Scalars['ID'];
  password?: InputMaybe<Scalars['String']>;
};


export type MutationSubmitProblemArgs = {
  code?: InputMaybe<Scalars['String']>;
  language?: InputMaybe<Scalars['Int']>;
  problemId: Scalars['ID'];
};


export type MutationSubmitTestsArgs = {
  code?: InputMaybe<Scalars['String']>;
  language?: InputMaybe<Scalars['Int']>;
  problemId: Scalars['ID'];
  testCases?: InputMaybe<Array<TestCaseInput>>;
};

export type Problem = {
  __typename?: 'Problem';
  creator: User;
  dislikes: Scalars['Int'];
  id: Scalars['ID'];
  likes: Scalars['Int'];
  specification: Specification;
};

export type Query = {
  __typename?: 'Query';
  getAssignments?: Maybe<Array<Assignment>>;
  getClassroom?: Maybe<Classroom>;
  getClassrooms?: Maybe<Array<Classroom>>;
  getProblem?: Maybe<Problem>;
  getProblems?: Maybe<Array<Problem>>;
  getUserSubmissionsForProblem?: Maybe<Array<Submission>>;
  getUsers?: Maybe<Array<User>>;
  isLoggedIn: Scalars['String'];
};


export type QueryGetClassroomArgs = {
  classroomId: Scalars['ID'];
};


export type QueryGetProblemArgs = {
  problemId: Scalars['ID'];
};


export type QueryGetUserSubmissionsForProblemArgs = {
  problemId: Scalars['ID'];
};

export type Specification = {
  __typename?: 'Specification';
  description: Scalars['String'];
  initialCode: Scalars['String'];
  testCases?: Maybe<Array<TestCase>>;
  title: Scalars['String'];
};

export type Submission = {
  __typename?: 'Submission';
  avgMemory: Scalars['Float'];
  avgTime: Scalars['Float'];
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  language: Scalars['Int'];
  passed: Scalars['Boolean'];
  problemId: Scalars['ID'];
  submissionResults?: Maybe<Array<TestCaseResult>>;
  userId: Scalars['ID'];
};

export type TestCase = {
  __typename?: 'TestCase';
  expectedOutput: Scalars['String'];
  id: Scalars['ID'];
  isHidden: Scalars['Boolean'];
  stdin: Scalars['String'];
};

export type TestCaseInput = {
  expectedOutput: Scalars['String'];
  id: Scalars['ID'];
  isHidden: Scalars['Boolean'];
  stdin: Scalars['String'];
};

export type TestCaseResult = {
  __typename?: 'TestCaseResult';
  id: Scalars['ID'];
  memory?: Maybe<Scalars['Float']>;
  passed: Scalars['Boolean'];
  stderr?: Maybe<Scalars['String']>;
  stdout?: Maybe<Scalars['String']>;
  testCase: TestCase;
  time?: Maybe<Scalars['Float']>;
};

export type TestSubmissionResult = {
  __typename?: 'TestSubmissionResult';
  results?: Maybe<Array<Maybe<TestCaseResult>>>;
};

export type User = {
  __typename?: 'User';
  UsersOnClassrooms?: Maybe<Array<Maybe<Classroom>>>;
  classrooms: Array<Maybe<Classroom>>;
  createdAt: Scalars['String'];
  githubId: Scalars['String'];
  id: Scalars['ID'];
  problems: Array<Maybe<Problem>>;
  username: Scalars['String'];
};
