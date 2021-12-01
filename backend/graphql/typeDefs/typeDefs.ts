import { gql } from "apollo-server-core";

module.exports = gql`
  # enum AccountType {
  #   LEARNER
  #   TEACHER
  #   ADMIN
  # }

  type AuthResponse {
    accessToken: String
  }
  type User {
    id: ID!
    githubId: String!
    username: String!
    # accountType: AccountType!
    createdAt: String! # These could all be Date scalar
    problems: [Problem]!
    classrooms: [Classroom]!
    UsersOnClassrooms: [Classroom] # Rename to this something more clear - this is a list of the classrooms the user is a LEARNER in
  }
  type Classroom {
    id: ID!
    creator: User
    createdAt: String!
    users: [User]!
    assignments: [Assignment]!
  }
  type Assignment {
    id: ID!
    classroom: Classroom!
    problems: [Problem!]
    createdAt: String!
    setDate: String!
    dueDate: String!
  }
  type Problem {
    id: ID!
    creator: User!
    likes: Int
    dislikes: Int
    specification: String! # This could be a JSON scalar
  }

  type Mutation {
    # User Mutations
    # End of User Mutations

    # Classroom Mutations
    createClassroom(creatorId: ID!): Classroom
    # End of Classroom Mutations

    # Assignment Mutations
    # REMOVE THIS COMMENT: assuming only the owner can create assignments for a classroom
    createAssignment(classroomId: ID!, problemIds: [ID!]): Assignment
    # End of Assignment Mutations

    # Problem Mutations
    createProblem(creatorId: ID!, specification: String!): Problem
    # End of Problem Mutations
  }

  type Query {
    # User Queries
    getUsers: [User!]
    isLoggedIn: String!
    # End of User Queries

    # Classroom Queries
    getClassrooms: [Classroom!]
    # End of Classroom Queries

    # Assignment Queries
    getAssignments: [Assignment!]
    # End of Assignment Queries

    # Problem Queries
    getProblems: [Problem!]
    # End of Problem Queries
  }
`;
