import { ApolloError } from "apollo-server";
import { prisma } from "../../index";
import { logger } from "../../logger";
import { isAuth } from "../../utils/isAuth";

module.exports = {
  Query: {
    getAssignments: async (_: any, __: any, context: any) => {
      logger.info("GraphQL assignmnets/getAssignments");
      const user = isAuth(context);

      const classrooms = await prisma.usersOnClassrooms.findMany({
        where: {
          userId: user.id,
        },
      });

      if (classrooms) {
        const assignments = await Promise.all(
          classrooms.map(async (classroom) => {
            return await prisma.assignment.findMany({
              where: {
                classroomId: classroom.classroomId,
                dueDate: { gt: new Date() },
              },
              include: {
                classroom: { include: { creator: true } },
              },
            });
          })
        );

        return assignments.flat();
      }

      return [];
    },
    getAssignment: async (
      _: any,
      { assignmentId, classroomId }: any,
      context: any
    ) => {
      logger.info("GraphQL assignment/assignmentId");

      const user = isAuth(context);

      // TODO add return stats
      let assignment = await prisma.assignment.findUnique({
        where: {
          id: parseInt(assignmentId),
        },
        include: {
          classroom: { include: { creator: true } },
          ProblemsOnAssignments: { include: { problem: true } },
        },
      });

      if (assignment?.classroomId !== parseInt(classroomId)) {
        throw new ApolloError(
          "Cannot find that assignment for that classroom."
        );
      }

      const usersInClassroom = await prisma.usersOnClassrooms.findMany({
        where: {
          classroomId: assignment?.classroom.id,
        },
        include: {
          user: true,
        },
      });

      // If you don't own the classroom or are not a student in the classroom, you cannot view this assignment
      if (
        !(
          assignment?.classroom.creator.id === user.id ||
          usersInClassroom.some((x) => x.user.id === user.id)
        )
      ) {
        throw new ApolloError(
          "You cannot get an assignment you are not associated with."
        );
      }

      return {
        ...assignment,
        problems: assignment.ProblemsOnAssignments.map((x) => {
          return { ...x.problem };
        }),
      };
    },
  },
  Mutation: {
    createAssignment: async (
      _: any,
      { classroomId, assignmentName, dueDate, problemIds }: any,
      context: any
    ) => {
      logger.info("GraphQL assignments/createAssignment");

      // check if the current user owns this classroom
      // find the problems
      // create the assignment and return it

      const user = isAuth(context);

      const classroom = await prisma.classroom.findUnique({
        where: {
          id: parseInt(classroomId),
        },
      });

      if (!classroom || user.id === classroom.id) {
        throw new ApolloError(
          "You cannot create an assignment for a classroom you do not own."
        );
      }

      const existingAssignment = await prisma.assignment.findFirst({
        where: {
          name: assignmentName,
          classroomId: classroom!.id,
        },
      });

      if (existingAssignment) {
        throw new ApolloError(
          "Cannot create assignment as you already have an assignment with the same name."
        );
      }

      const problems = await prisma.problem.findMany({
        where: {
          id: {
            in: problemIds.map((e: any) => parseInt(e)),
          },
        },
      });

      const assignment = await prisma.assignment.create({
        data: {
          name: assignmentName,
          classroomId: classroom!.id,
          setDate: new Date(),
          createdAt: new Date(),
          dueDate: new Date(dueDate),
        },
      });

      await prisma.problemsOnAssignments.createMany({
        data: [
          ...problems.map((problem) => {
            return {
              assignmentId: assignment.id,
              problemId: problem.id,
            };
          }),
        ],
      });

      const res = await prisma.assignment.findUnique({
        where: {
          id: assignment.id,
        },
      });

      logger.info("Created assignment", { meta: JSON.stringify(res) });

      return res;
    },
    removeAssignment: async (
      _: any,
      { assignmentId, assignmentName }: any,
      context: any
    ) => {
      const assignment = await prisma.assignment.findFirst({
        where: {
          id: parseInt(assignmentId),
        },
      });

      if (!assignment) {
        throw new ApolloError(
          "Failed to find assignment you are attempting to remove."
        );
      }

      if (assignment.name !== assignmentName) {
        throw new ApolloError(
          "Failed to remove assignment as the name you entered is not correct."
        );
      }

      // TODO: once a mechanism for creating submissions is added, we might decide to also delete submissions related to this assignment
      // await prisma.submissionsOnAssignment.deleteMany({
      //   where: {
      //     assignmentId: assignment.id,
      //   },
      // });

      await prisma.problemsOnAssignments.deleteMany({
        where: {
          assignmentId: assignment.id,
        },
      });

      await prisma.assignment.delete({
        where: {
          id: assignment.id,
        },
      });

      return true;
    },
  },
};
