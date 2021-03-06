import { gql } from "apollo-server-core";

module.exports = gql`
  enum Difficulty {
    EASY
    MEDIUM
    HARD
  }
  input TestCaseInput {
    stdin: String!
    expectedOutput: String!
    isHidden: Boolean!
  }
  input SpecificationInput {
    title: String!
    description: String!
    initialCode: String! # This is a JSON object, mapping from a language to the initial code for the question for all supported languages
    testCases: [TestCaseInput!]!
    difficulty: Difficulty!
  }
  type AuthResponse {
    accessToken: String
  }
  type User {
    id: ID!
    githubId: String!
    username: String!
    organisationId: String
    createdAt: String!
    ownedClassrooms: [Classroom!]! # Classrooms this user owns
    problems: [Problem!]! # Problems the user has created
    recentSubmissions: [Submission!]!
    classrooms: [Classroom] # Classrooms this user is a student in
  }
  type Classroom {
    id: ID!
    name: String!
    creator: User!
    createdAt: String!
    users: [User!]! # students in the classroom
    assignments: [Assignment!]!
    password: String
  }
  type Assignment {
    id: ID!
    name: String!
    classroom: Classroom!
    problems: [Problem!]!
    createdAt: String!
    setDate: String!
    dueDate: String!
    submissions: [Submission!]!
  }
  type Rating {
    score: Float!
    user: User!
    problem: Problem!
  }
  type ProblemRating {
    numberOfRatings: Int!
    totalRating: Float!
    problem: Problem!
    ratings: [Rating!]!
    userRating: Rating
  }
  type Specification {
    title: String!
    description: String!
    initialCode: String! # This is a JSON object, mapping from a language to the initial code for the question for all supported languages
    testCases: [TestCase!]!
    difficulty: Difficulty!
  }
  type TestCase {
    id: ID!
    stdin: String!
    expectedOutput: String!
    isHidden: Boolean!
  }
  type Problem {
    id: ID!
    creator: User!
    specification: Specification!
    solved: Boolean
    rating: ProblemRating!
  }
  type TestCaseSubmission {
    id: ID!
    testCase: TestCase!
    passed: Boolean!
    stdout: String!
    stderr: String!
    description: String!
    compile_output: String!
    time: Float!
    memory: Float!
  }
  type Submission {
    id: ID!
    userId: ID!
    user: User!
    problem: Problem!
    testCaseSubmissions: [TestCaseSubmission!]!
    createdAt: String!
    passed: Boolean!
    avgMemory: Float!
    avgTime: Float!
    language: Int!
    code: String!
  }
  type AssignmentSubmission {
    user: User!
    assignment: Assignment!
    problem: Problem!
    submission: Submission
    createdAt: String!
    mark: Float
    comments: String
  }
  type UserAssignmentSubmission {
    user: User!
    assignmentSubmissions: [AssignmentSubmission!]!
  }
  type ProblemSubmissions {
    problem: Problem!
    submissions: [Submission!]!
  }
  type UserAssignmentSubmissionDataRow {
    userAssignmentSubmission: UserAssignmentSubmission!
    avgMark: Float
    solves: Int
    attempts: Int
    lastChange: String
    comments: String
    numOfProblems: Int
  }

  type Mutation {
    # User Mutations
    deleteUser(userId: ID!, username: String!): Boolean
    setOrganisationId(organisationId: String!): Boolean
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
      problemIds: [ID!]!
      dueDate: String!
    ): Assignment!
    removeAssignment(assignmentId: ID!, assignmentName: String!): Boolean
    # End of Assignment Mutations

    # Problem Mutations
    createProblem(specification: SpecificationInput!): Problem
    rateProblem(problemId: ID!, score: Float!): Boolean
    # End of Problem Mutations

    # Submission Mutations
    submitTests(
      code: String!
      language: Int!
      testCases: [TestCaseInput!]!
    ): [TestCaseSubmission!]!
    submitProblem(problemId: ID!, code: String!, language: Int!): Submission!
    setAssignmentProblemSubmission(
      assignmentId: ID!
      submissionId: ID!
    ): AssignmentSubmission
    removeAssignmentProblemSubmission(
      assignmentId: ID!
      problemId: ID!
    ): Boolean
    setAssignmentSubmissionFeedback(
      userId: ID!
      assignmentId: ID!
      problemId: ID!
      mark: Float!
      comments: String!
    ): AssignmentSubmission
    # End of Submission Mutations
  }

  type Query {
    # User Queries
    getUser(userId: ID!): User!
    isLoggedIn: String!
    # End of User Queries

    # Classroom Queries
    getTeacherClassrooms: [Classroom!]!
    getLearnerClassrooms: [Classroom!]!
    getClassroom(classroomId: ID!): Classroom!
    # End of Classroom Queries

    # Assignment Queries
    getAssignment(assignmentId: ID!, classroomId: ID!): Assignment!
    getAssignments: [Assignment!]!
    getAssignmentSubmissions(
      assignmentId: ID!
      userId: ID
    ): [AssignmentSubmission]!
    getAssignmentProblemSubmissions(assignmentId: ID!): [ProblemSubmissions!]!
    getAssignmentSubmissionsAsTeacher(
      assignmentId: ID!
    ): [UserAssignmentSubmission!]!
    getAssignmentExportData(
      assignmentId: ID!
    ): [UserAssignmentSubmissionDataRow!]!
    # End of Assignment Queries

    # Problem Queries
    getProblems(filter: String): [Problem!]!
    getProblem(problemId: ID!): Problem
    getDefaultInitialCodes: String!
    # End of Problem Queries

    # Submission Queries
    getTopKSubmissionForProblem(problemId: ID!, k: Int!): [Submission!]!
    getSubmissionsForProblem(problemId: ID!): [Submission!]!
    getSubmission(submissionId: ID!): Submission!
    # End of Submission Queries
  }
`;
