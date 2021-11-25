import { prisma } from "../../index";
import { UserInputError } from "apollo-server-errors";

module.exports = {
  Mutation: {
    signup: async (_: any, { email, password, passwordConfirmation }: any) => {
      if (password !== passwordConfirmation) {
        throw new UserInputError("Passwords must match");
      }
      try {
        const user = prisma.user.create({ data: { email, password } });
        return user;
      } catch (error) {
        throw new UserInputError(
          "This account does not have proper validation. e.g. email might already be in use or password is too weak."
        );
      }
    },
    login: (data: any) => {
      console.log(data);
    },
  },
  Query: {
    getUsers: () => {
      const users = prisma.user.findMany();
      return users;
    },
    isLoggedIn: (data: any) => {
      console.log(data);
    },
  },
};
