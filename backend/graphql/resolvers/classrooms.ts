import { ApolloError } from "apollo-server";
import { prisma } from "../../index";
import { logger } from "../../logger";
import { isAuth } from "../../utils/isAuth";

module.exports = {
  Query: {
    getClassrooms: async () => {
      logger.info("GraphQL classrooms/getClassrooms");
      let classrooms = await prisma.classroom.findMany({
        include: {
          assignments: true,
          creator: true,
          UsersOnClassrooms: { include: { user: true } },
        },
      });

      const parsedClassrooms = classrooms.map((classroom) => {
        const usersInClassroom = classroom.UsersOnClassrooms.map((x) => x.user);
        return { ...classroom, users: usersInClassroom };
      });

      return parsedClassrooms;
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
    createClassroom: async (_: any, { classroomName }: any, context: any) => {
      const user = isAuth(context);

      // Add validation

      const existingClassroom = await prisma.classroom.findFirst({
        where: {
          name: classroomName,
          userId: user.id,
        },
      });

      if (existingClassroom) {
        throw new ApolloError(
          "Cannot create classroom as this user already has a classroom with the same name."
        );
      }

      const classroom = await prisma.classroom.create({
        data: {
          userId: user.id,
          name: classroomName,
        },
      });

      return classroom;
    },
  },
};
