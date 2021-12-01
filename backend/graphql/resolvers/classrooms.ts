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
  },
  Mutation: {
    createClassroom: (_: any, data: any, context: any) => {},
  },
};
