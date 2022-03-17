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
  submission?: Maybe<Submission>;
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
  createAssignment: Assignment;
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
  submitProblem: Submission;
  submitTests: Array<TestCaseSubmission>;
};


export type MutationCreateAssignmentArgs = {
  assignmentName: Scalars['String'];
  classroomId: Scalars['ID'];
  dueDate: Scalars['String'];
  problemIds: Array<Scalars['ID']>;
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
  code: Scalars['String'];
  language: Scalars['Int'];
  problemId: Scalars['ID'];
};


export type MutationSubmitTestsArgs = {
  code: Scalars['String'];
  language: Scalars['Int'];
  testCases: Array<TestCaseInput>;
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

export type ProblemSubmissions = {
  __typename?: 'ProblemSubmissions';
  problem: Problem;
  submissions: Array<Submission>;
};

export type Query = {
  __typename?: 'Query';
  getAssignment: Assignment;
  getAssignmentProblemSubmissions: Array<ProblemSubmissions>;
  getAssignmentSubmissions: Array<Maybe<AssignmentSubmission>>;
  getAssignmentSubmissionsAsTeacher: Array<UserAssignmentSubmission>;
  getAssignments: Array<Assignment>;
  getClassroom: Classroom;
  getDefaultInitialCodes: Scalars['String'];
  getLearnerClassrooms: Array<Classroom>;
  getProblem?: Maybe<Problem>;
  getProblems: Array<Problem>;
  getSubmission: Submission;
  getSubmissionsForProblem: Array<Submission>;
  getTeacherClassrooms: Array<Classroom>;
  getUser?: Maybe<User>;
  getUsers?: Maybe<Array<User>>;
  isLoggedIn: Scalars['String'];
};


export type QueryGetAssignmentArgs = {
  assignmentId: Scalars['ID'];
  classroomId: Scalars['ID'];
};


export type QueryGetAssignmentProblemSubmissionsArgs = {
  assignmentId: Scalars['ID'];
};


export type QueryGetAssignmentSubmissionsArgs = {
  assignmentId: Scalars['ID'];
  userId?: InputMaybe<Scalars['ID']>;
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


export type QueryGetSubmissionsForProblemArgs = {
  problemId: Scalars['ID'];
};


export type QueryGetUserArgs = {
  userId: Scalars['ID'];
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
  isHidden: Scalars['Boolean'];
  stdin: Scalars['String'];
};

export type TestCaseSubmission = {
  __typename?: 'TestCaseSubmission';
  compile_output: Scalars['String'];
  description: Scalars['String'];
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

export type UserAssignmentSubmission = {
  __typename?: 'UserAssignmentSubmission';
  assignmentSubmissions: Array<AssignmentSubmission>;
  user: User;
};
