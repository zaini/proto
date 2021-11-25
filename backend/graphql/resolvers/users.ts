import { prisma } from "../../index";
import { UserInputError } from "apollo-server-errors";
const argon2 = require("argon2");

module.exports = {
  Query: {
    getUsers: () => {
      const users = prisma.user.findMany();
      return users;
    },
    isLoggedIn: (data: any) => {
      console.log(data);
    },
  },
  Mutation: {
    changePassword: async () => {},
    deleteAccount: async () => {},
    signup: async (_: any, { email, password, passwordConfirmation }: any) => {
      if (password !== passwordConfirmation) {
        throw new UserInputError("Passwords must match");
      }
      try {
        const hashed_password = await argon2.hash(password);
        const user = await prisma.user.create({
          data: { email, password: hashed_password },
        });
        return user;
      } catch (error) {
        throw new UserInputError(
          "This account does not have proper validation. e.g. email might already be in use or password is too weak."
        );
      }
    },
    login: async (_: any, { email, password }: any) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new UserInputError("User with this email could not be found");
      }
      const is_password_valid: boolean = await argon2.verify(
        user.password,
        password
      );
      if (!is_password_valid) {
        throw new UserInputError("Invalid password");
      }
      return { accessToken: "VALID" };
    },
  },
};
