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
  name: Scalars['String'];
  problems?: Maybe<Array<Problem>>;
  setDate: Scalars['String'];
  submissions?: Maybe<Array<Maybe<Submission>>>;
};

export type AssignmentProblemSubmissions = {
  __typename?: 'AssignmentProblemSubmissions';
  problem: Problem;
  submissions?: Maybe<Array<Submission>>;
};

export type AssignmentSubmission = {
  __typename?: 'AssignmentSubmission';
  createdAt: Scalars['String'];
  problem: Problem;
  submission?: Maybe<Submission>;
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

export enum Difficulty {
  Easy = 'EASY',
  Hard = 'HARD',
  Medium = 'MEDIUM'
}

export type Mutation = {
  __typename?: 'Mutation';
  createAssignment?: Maybe<Assignment>;
  createClassroom?: Maybe<Classroom>;
  createProblem?: Maybe<Problem>;
  deleteClassroom?: Maybe<Scalars['Boolean']>;
  joinClassroom?: Maybe<Classroom>;
  rateProblem?: Maybe<Scalars['Boolean']>;
  removeAssignment?: Maybe<Scalars['Boolean']>;
  removeAssignmentProblemSubmission?: Maybe<Scalars['Boolean']>;
  removeStudent?: Maybe<Scalars['Boolean']>;
  setAssignmentProblemSubmission?: Maybe<Scalars['Boolean']>;
  submitProblem: Submission;
  submitTests: TestSubmissionResult;
};


export type MutationCreateAssignmentArgs = {
  assignmentName: Scalars['String'];
  classroomId: Scalars['ID'];
  dueDate: Scalars['String'];
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


export type MutationDeleteClassroomArgs = {
  classroomId: Scalars['ID'];
  classroomName: Scalars['String'];
  password?: InputMaybe<Scalars['String']>;
};


export type MutationJoinClassroomArgs = {
  classroomId: Scalars['ID'];
  password?: InputMaybe<Scalars['String']>;
};


export type MutationRateProblemArgs = {
  problemId: Scalars['ID'];
  score: Scalars['Float'];
};


export type MutationRemoveAssignmentArgs = {
  assignmentId: Scalars['ID'];
  assignmentName: Scalars['String'];
};


export type MutationRemoveAssignmentProblemSubmissionArgs = {
  assignmentId: Scalars['ID'];
  problemId: Scalars['ID'];
};


export type MutationRemoveStudentArgs = {
  classroomId: Scalars['ID'];
  studentId: Scalars['ID'];
};


export type MutationSetAssignmentProblemSubmissionArgs = {
  assignmentId: Scalars['ID'];
  submissionId: Scalars['ID'];
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
  id: Scalars['ID'];
  rating: ProblemRating;
  solved?: Maybe<Scalars['Boolean']>;
  specification: Specification;
};

export type ProblemRating = {
  __typename?: 'ProblemRating';
  numberOfRatings: Scalars['Int'];
  problem: Problem;
  ratings: Array<Maybe<Rating>>;
  totalRating: Scalars['Float'];
  userRating?: Maybe<Rating>;
};

export type Query = {
  __typename?: 'Query';
  getAssignment?: Maybe<Assignment>;
  getAssignmentSubmissionForUser?: Maybe<UserAssignmentSubmission>;
  getAssignmentSubmissions?: Maybe<Array<Maybe<AssignmentSubmission>>>;
  getAssignmentSubmissionsAsTeacher?: Maybe<Array<Maybe<UserAssignmentSubmission>>>;
  getAssignments?: Maybe<Array<Assignment>>;
  getClassroom?: Maybe<Classroom>;
  getLearnerClassrooms?: Maybe<Array<Classroom>>;
  getProblem?: Maybe<Problem>;
  getProblemSubmissionsForAssignment?: Maybe<Array<Maybe<AssignmentProblemSubmissions>>>;
  getProblems?: Maybe<Array<Problem>>;
  getSubmission?: Maybe<Submission>;
  getTeacherClassrooms?: Maybe<Array<Classroom>>;
  getUser?: Maybe<User>;
  getUserSubmissionsForProblem?: Maybe<Array<Submission>>;
  getUsers?: Maybe<Array<User>>;
  isLoggedIn: Scalars['String'];
};


export type QueryGetAssignmentArgs = {
  assignmentId: Scalars['ID'];
  classroomId: Scalars['ID'];
};


export type QueryGetAssignmentSubmissionForUserArgs = {
  assignmentId: Scalars['ID'];
  userId: Scalars['ID'];
};


export type QueryGetAssignmentSubmissionsArgs = {
  assignmentId: Scalars['ID'];
};


export type QueryGetAssignmentSubmissionsAsTeacherArgs = {
  assignmentId: Scalars['ID'];
};


export type QueryGetClassroomArgs = {
  classroomId: Scalars['ID'];
};


export type QueryGetProblemArgs = {
  problemId: Scalars['ID'];
};


export type QueryGetProblemSubmissionsForAssignmentArgs = {
  assignmentId: Scalars['ID'];
};


export type QueryGetSubmissionArgs = {
  submissionId: Scalars['ID'];
};


export type QueryGetUserArgs = {
  userId: Scalars['ID'];
};


export type QueryGetUserSubmissionsForProblemArgs = {
  problemId: Scalars['ID'];
};

export type Rating = {
  __typename?: 'Rating';
  problem?: Maybe<Problem>;
  score: Scalars['Float'];
  user?: Maybe<User>;
};

export type Specification = {
  __typename?: 'Specification';
  description: Scalars['String'];
  difficulty: Difficulty;
  initialCode: Scalars['String'];
  testCases?: Maybe<Array<TestCase>>;
  title: Scalars['String'];
};

export type Submission = {
  __typename?: 'Submission';
  avgMemory: Scalars['Float'];
  avgTime: Scalars['Float'];
  code: Scalars['String'];
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  language: Scalars['Int'];
  passed: Scalars['Boolean'];
  problem: Problem;
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
  classrooms?: Maybe<Array<Maybe<Classroom>>>;
  createdAt: Scalars['String'];
  githubId: Scalars['String'];
  id: Scalars['ID'];
  problems?: Maybe<Array<Maybe<Problem>>>;
  username: Scalars['String'];
};

export type UserAssignmentSubmission = {
  __typename?: 'UserAssignmentSubmission';
  assignmentSubmission?: Maybe<Array<Maybe<AssignmentSubmission>>>;
  user: User;
};
