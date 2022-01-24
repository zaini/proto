import { prisma } from "../../index";
import { logger } from "../../logger";

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
    createClassroom: (_: any, data: any, context: any) => {},
  },
};
