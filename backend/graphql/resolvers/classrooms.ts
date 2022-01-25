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

      return classrooms.map((classroom) => {
        return {
          ...classroom,
          users: classroom.UsersOnClassrooms,
        };
      });
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
        password: classroom?.password,
        creator: classroom?.creator,
        createdAt: classroom?.createdAt,
        users: classroom?.UsersOnClassrooms.map((e) => e.user),
        assignments: classroom?.assignments.map((assignment) => {
          return {
            id: assignment.id,
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
  },
};
