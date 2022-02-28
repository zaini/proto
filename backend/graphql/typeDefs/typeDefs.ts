import { gql } from "apollo-server-core";

module.exports = gql`
  # enum AccountType {
  #   LEARNER
  #   TEACHER
  #   ADMIN
  # }
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
  type Problem {
    id: ID!
    creator: User!
    likes: Int!
    dislikes: Int!
    specification: Specification!
  }
  type Submission {
    id: ID!
    userId: ID!
    problemId: ID!
    submissionResults: [TestCaseResult!]
    createdAt: String!
    passed: Boolean!
    avgMemory: Float!
    avgTime: Float!
    language: Int!
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
    # End of Problem Mutations
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
    # End of Submission Queries
  }
`;
