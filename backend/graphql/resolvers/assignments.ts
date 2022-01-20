import { prisma } from "../../index";
import { logger } from "../../logger";

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
    createAssignment: (_: any, data: any, context: any) => {},
  },
};
