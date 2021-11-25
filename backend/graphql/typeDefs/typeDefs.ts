import { gql } from "apollo-server-core";

module.exports = gql`
  type AuthResponse {
    accessToken: String
  }
  type User {
    id: ID!
    email: String!
    password: String!
  }
  type Mutation {
    signup(
      email: String!
      password: String!
      passwordConfirmation: String!
    ): User
    login(email: String!, password: String!): AuthResponse
  }
  type Query {
    getUsers: [User!]
    isLoggedIn: String!
  }
`;
