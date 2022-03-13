import { gql } from "apollo-server-core";

module.exports = gql`
  # enum AccountType {
  #   LEARNER
  #   TEACHER
  #   ADMIN
  # }
  enum Difficulty {
    EASY
    MEDIUM
    HARD
  }
  type TestCase {
    id: ID!
    stdin: String!
    expectedOutput: String!
    isHidden: Boolean!
  }
  input TestCaseInput {
    id: ID!
    stdin: String!
    expectedOutput: String!
    isHidden: Boolean!
  }
  type TestCaseResult {
    id: ID!
    testCase: TestCase!
    passed: Boolean!
    stdout: String
    stderr: String
    time: Float
    memory: Float
  }
  type TestSubmissionResult {
    results: [TestCaseResult]
  }
  type Specification {
    title: String!
    description: String!
    initialCode: String!
    testCases: [TestCase!]
    difficulty: Difficulty!
  }
  type AuthResponse {
    accessToken: String
  }

  type User {
    id: ID!
    githubId: String!
    username: String!
    # accountType: AccountType!
    createdAt: String! # These could all be Date scalar
    problems: [Problem]
    classrooms: [Classroom] # Classrooms this user owns
    UsersOnClassrooms: [Classroom] # Classrooms this user is a student in
  }
  type Classroom {
    id: ID!
    name: String!
    creator: User!
    createdAt: String!
    users: [User!]
    assignments: [Assignment!]!
    password: String
  }
  type Assignment {
    id: ID!
    name: String!
    classroom: Classroom!
    problems: [Problem!]
    createdAt: String!
    setDate: String!
    dueDate: String!
    submissions: [Submission]
  }
  type Rating {
    score: Float!
    user: User
    problem: Problem
  }
  type ProblemRating {
    numberOfRatings: Int!
    totalRating: Float!
    problem: Problem!
    ratings: [Rating]!
    userRating: Rating
  }
  type Problem {
    id: ID!
    creator: User!
    specification: Specification!
    solved: Boolean
    rating: ProblemRating!
  }
  type Submission {
    id: ID!
    userId: ID!
    problem: Problem!
    submissionResults: [TestCaseResult!]
    createdAt: String!
    passed: Boolean!
    avgMemory: Float!
    avgTime: Float!
    language: Int!
    code: String!
  }
  # These are submissions to problems which are related to an assignment, not the current submission for an assignment
  type AssignmentProblemSubmissions {
    problem: Problem!
    submissions: [Submission!]
  }
  type AssignmentSubmission {
    problem: Problem!
    submission: Submission
    createdAt: String!
  }
  type UserAssignmentSubmission {
    user: User!
    assignmentSubmission: [AssignmentSubmission]
  }

  type Mutation {
    # User Mutations
    # End of User Mutations

    # Classroom Mutations
    createClassroom(classroomName: String!, password: String): Classroom
    joinClassroom(classroomId: ID!, password: String): Classroom
    deleteClassroom(
      classroomId: ID!
      classroomName: String!
      password: String
    ): Boolean
    removeStudent(studentId: ID!, classroomId: ID!): Boolean
    # End of Classroom Mutations

    # Assignment Mutations
    createAssignment(
      classroomId: ID!
      assignmentName: String!
      problemIds: [ID!]
      dueDate: String!
    ): Assignment
    removeAssignment(assignmentId: ID!, assignmentName: String!): Boolean
    # End of Assignment Mutations

    # Problem Mutations
    createProblem(creatorId: ID!, specification: String!): Problem
    submitTests(
      problemId: ID!
      code: String
      language: Int
      testCases: [TestCaseInput!]
    ): TestSubmissionResult!
    submitProblem(problemId: ID!, code: String, language: Int): Submission!
    rateProblem(problemId: ID!, score: Float!): Boolean
    # End of Problem Mutations

    # Submission Mutations
    setAssignmentProblemSubmission(
      assignmentId: ID!
      submissionId: ID!
    ): Boolean
    removeAssignmentProblemSubmission(
      assignmentId: ID!
      problemId: ID!
    ): Boolean
    # End of Submission Mutations
  }

  type Query {
    # User Queries
    getUsers: [User!]
    getUser(userId: ID!): User
    isLoggedIn: String!
    # End of User Queries

    # Classroom Queries
    getTeacherClassrooms: [Classroom!]
    getLearnerClassrooms: [Classroom!]
    getClassroom(classroomId: ID!): Classroom
    # End of Classroom Queries

    # Assignment Queries
    getAssignment(assignmentId: ID!, classroomId: ID!): Assignment
    getAssignments: [Assignment!]
    # End of Assignment Queries

    # Problem Queries
    getProblems: [Problem!]
    getProblem(problemId: ID!): Problem
    # End of Problem Queries

    # Submission Queries
    getUserSubmissionsForProblem(problemId: ID!): [Submission!]
    getAssignmentSubmissions(assignmentId: ID!): [AssignmentSubmission]
    getProblemSubmissionsForAssignment(
      assignmentId: ID!
    ): [AssignmentProblemSubmissions]
    getAssignmentSubmissionsAsTeacher(
      assignmentId: ID!
    ): [UserAssignmentSubmission]
    getAssignmentSubmissionForUser(
      assignmentId: ID!
      userId: ID!
    ): UserAssignmentSubmission
    getSubmission(submissionId: ID!): Submission
    # End of Submission Queries
  }
`;
