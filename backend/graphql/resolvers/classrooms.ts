import { ApolloError } from "apollo-server";
import { prisma } from "../../index";
import { logger } from "../../logger";
import { isAuth } from "../../utils/isAuth";
import * as argon2 from "argon2";

module.exports = {
  Query: {
    getClassrooms: async (_: any, __: any, context: any) => {
      logger.info("GraphQL classrooms/getClassrooms");
      const user = isAuth(context);

      let classrooms = await prisma.classroom.findMany({
        where: {
          userId: user.id,
        },
        include: {
          creator: true,
          UsersOnClassrooms: { include: { user: true } },
        },
      });

      const res = classrooms.map((classroom) => {
        return {
          ...classroom,
          users: classroom.UsersOnClassrooms.map((user) => {
            return {
              ...user,
              ...user.user,
            };
          }),
        };
      });

      return res;
    },
    getClassroom: async (_: any, { classroomId }: any, context: any) => {
      logger.info("GraphQL classrooms/getClassroom");

      let classroom = await prisma.classroom.findUnique({
        where: {
          id: parseInt(classroomId),
        },
        include: {
          assignments: {
            include: { ProblemsOnAssignments: { include: { problem: true } } },
          },
          creator: true,
          UsersOnClassrooms: { include: { user: true } },
        },
      });

      const res = {
        id: classroom?.id,
        name: classroom?.name,
        password: classroom?.password,
        creator: classroom?.creator,
        createdAt: classroom?.createdAt,
        users: classroom?.UsersOnClassrooms.map((e) => e.user),
        assignments: classroom?.assignments.map((assignment) => {
          return {
            id: assignment.id,
            name: assignment.name,
            problems: assignment.ProblemsOnAssignments.map((e) => e.problem),
            setDate: assignment.setDate,
            dueDate: assignment.dueDate,
          };
        }),
      };

      return res;
    },
  },
  Mutation: {
    createClassroom: async (
      _: any,
      { classroomName, password }: any,
      context: any
    ) => {
      if (classroomName === "") {
        throw new ApolloError("Classroom name cannot be empty.");
      }

      const user = isAuth(context);

      const existingClassroom = await prisma.classroom.findFirst({
        where: {
          name: classroomName,
          userId: user.id,
        },
      });

      if (existingClassroom) {
        throw new ApolloError(
          "Cannot create classroom as you already have a classroom with the same name."
        );
      }

      if (password) {
        password = await argon2.hash(password);
      }

      const classroom = await prisma.classroom.create({
        data: {
          userId: user.id,
          name: classroomName,
          password: password,
        },
      });

      return classroom;
    },
    joinClassroom: async (
      _: any,
      { classroomId, password }: any,
      context: any
    ) => {
      const user = isAuth(context);

      const classroom = await prisma.classroom.findUnique({
        where: {
          id: parseInt(classroomId),
        },
      });

      if (!classroom) {
        throw new ApolloError(
          "Failed to find classroom you are attempting to join."
        );
      }

      if (classroom.password) {
        const isValidPasword = await argon2.verify(
          classroom.password,
          password
        );

        if (!isValidPasword) {
          throw new ApolloError(
            "Cannot join classroom due to invalid password."
          );
        }
      }

      // Check if the person trying to join is the classroom owner
      if (classroom.userId === user.id) {
        throw new ApolloError(
          "You cannot join a classroom as you are its creator."
        );
      }

      // Check if the user is already a member of this classroom
      const userInClassroom = await prisma.usersOnClassrooms.findFirst({
        where: {
          userId: user.id,
          classroomId: classroom.id,
        },
      });
      if (userInClassroom) {
        throw new ApolloError("You are already a member of this classroom.");
      }

      await prisma.usersOnClassrooms.create({
        data: {
          userId: user.id,
          classroomId: classroom.id,
        },
      });

      return classroom;
    },
    deleteClassroom: async (
      _: any,
      { classroomId, classroomName, password }: any,
      context: any
    ) => {
      const user = isAuth(context);

      const classroom = await prisma.classroom.findFirst({
        where: {
          id: parseInt(classroomId),
          userId: user.id,
        },
      });

      if (!classroom) {
        throw new ApolloError(
          "Failed to find classroom you are attempting to delete."
        );
      }

      if (classroom.password) {
        const isValidPasword = await argon2.verify(
          classroom.password,
          password
        );

        if (!isValidPasword) {
          throw new ApolloError(
            "Cannot delete classroom due to invalid password."
          );
        }
      }

      if (classroom.name !== classroomName) {
        throw new ApolloError(
          "Failed to delete classroom as you are not entering the name you entered is not correct."
        );
      }

      await prisma.usersOnClassrooms.deleteMany({
        where: {
          classroomId: classroom.id,
        },
      });

      await prisma.classroom.delete({
        where: {
          id: classroom.id,
        },
      });

      return true;
    },
  },
};
