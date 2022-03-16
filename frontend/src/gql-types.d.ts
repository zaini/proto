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
  problems: Array<Problem>;
  setDate: Scalars['String'];
  submissions: Array<Submission>;
};

export type AssignmentSubmission = {
  __typename?: 'AssignmentSubmission';
  assignment: Assignment;
  createdAt: Scalars['String'];
  problem: Problem;
  submission: Submission;
  user: User;
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
  users: Array<User>;
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
  deleteUser?: Maybe<Scalars['Boolean']>;
  joinClassroom?: Maybe<Classroom>;
  rateProblem?: Maybe<Scalars['Boolean']>;
  removeAssignment?: Maybe<Scalars['Boolean']>;
  removeAssignmentProblemSubmission?: Maybe<Scalars['Boolean']>;
  removeStudent?: Maybe<Scalars['Boolean']>;
  setAssignmentProblemSubmission?: Maybe<Scalars['Boolean']>;
  submitProblem?: Maybe<Submission>;
  submitTests?: Maybe<TestCaseSubmission>;
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
  specification: SpecificationInput;
};


export type MutationDeleteClassroomArgs = {
  classroomId: Scalars['ID'];
  classroomName: Scalars['String'];
  password?: InputMaybe<Scalars['String']>;
};


export type MutationDeleteUserArgs = {
  userId: Scalars['ID'];
  username: Scalars['String'];
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
  ratings: Array<Rating>;
  totalRating: Scalars['Float'];
  userRating?: Maybe<Rating>;
};

export type Query = {
  __typename?: 'Query';
  getAssignment?: Maybe<Assignment>;
  getAssignmentSubmission: Array<AssignmentSubmission>;
  getAssignmentSubmissionForUser?: Maybe<AssignmentSubmission>;
  getAssignmentSubmissions: Array<AssignmentSubmission>;
  getAssignmentSubmissionsAsTeacher: Array<AssignmentSubmission>;
  getAssignments?: Maybe<Array<Assignment>>;
  getClassroom?: Maybe<Classroom>;
  getDefaultInitialCodes: Scalars['String'];
  getLearnerClassrooms: Array<Classroom>;
  getProblem?: Maybe<Problem>;
  getProblems?: Maybe<Array<Problem>>;
  getSubmission?: Maybe<Submission>;
  getTeacherClassrooms: Array<Classroom>;
  getUser?: Maybe<User>;
  getUserSubmissionsForProblem: Array<Submission>;
  getUsers?: Maybe<Array<User>>;
  isLoggedIn: Scalars['String'];
};


export type QueryGetAssignmentArgs = {
  assignmentId: Scalars['ID'];
  classroomId: Scalars['ID'];
};


export type QueryGetAssignmentSubmissionArgs = {
  assignmentId: Scalars['ID'];
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
  problem: Problem;
  score: Scalars['Float'];
  user: User;
};

export type Specification = {
  __typename?: 'Specification';
  description: Scalars['String'];
  difficulty: Difficulty;
  initialCode: Scalars['String'];
  testCases: Array<TestCase>;
  title: Scalars['String'];
};

export type SpecificationInput = {
  description: Scalars['String'];
  difficulty: Difficulty;
  initialCode: Scalars['String'];
  testCases: Array<TestCaseInput>;
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
  testCaseSubmissions: Array<TestCaseSubmission>;
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

export type TestCaseSubmission = {
  __typename?: 'TestCaseSubmission';
  id: Scalars['ID'];
  memory: Scalars['Float'];
  passed: Scalars['Boolean'];
  stderr: Scalars['String'];
  stdout: Scalars['String'];
  testCase: TestCase;
  time: Scalars['Float'];
};

export type User = {
  __typename?: 'User';
  UsersOnClassrooms?: Maybe<Array<Maybe<Classroom>>>;
  classrooms: Array<Classroom>;
  createdAt: Scalars['String'];
  githubId: Scalars['String'];
  id: Scalars['ID'];
  problems: Array<Problem>;
  recentSubmissions: Array<Submission>;
  username: Scalars['String'];
};
