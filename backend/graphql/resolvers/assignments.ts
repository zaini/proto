import { ApolloError } from "apollo-server";
import { prisma } from "../../index";
import { logger } from "../../logger";
import { isAuth } from "../../utils/isAuth";

module.exports = {
  Query: {
    getAssignments: async () => {
      logger.info("GraphQL assignmnets/getAssignments");
      let assignments = await prisma.assignment.findMany({
        include: {
          classroom: {
            include: { UsersOnClassrooms: { include: { user: true } } },
          },
          ProblemsOnAssignments: { include: { problem: true } },
        },
      });

      const parsedAssignments = assignments.map((assignment) => {
        const problemsInAssignment = assignment.ProblemsOnAssignments.map(
          (x) => x.problem
        );
        return { ...assignment, problems: problemsInAssignment };
      });

      return parsedAssignments;
    },
  },
  Mutation: {
    createAssignment: async (
      _: any,
      { classroomId, problems }: any,
      context: any
    ) => {
      // check if the current user owns this classroom
      // find the problems
      // create the assignments and assign them with these problems and to the relavent classroom
      // return the new assignment and the classrooms

      const classroom = await prisma.classroom.findUnique({
        where: {
          id: classroomId,
        },
      });

      return {
        assignments: [],
        classroom: classroom,
      };
    },
  },
};
