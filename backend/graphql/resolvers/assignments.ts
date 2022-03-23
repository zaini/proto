import { ApolloError } from "apollo-server";
import {
  MutationCreateAssignmentArgs,
  MutationRemoveAssignmentArgs,
  MutationRemoveAssignmentProblemSubmissionArgs,
  MutationSetAssignmentProblemSubmissionArgs,
  MutationSetAssignmentSubmissionMarkArgs,
  QueryGetAssignmentArgs,
  QueryGetAssignmentProblemSubmissionsArgs,
  QueryGetAssignmentSubmissionsArgs,
  QueryGetAssignmentSubmissionsAsTeacherArgs,
} from "../../gql-types";
import { prisma } from "../../index";
import { logger } from "../../logger";
import { isAuth } from "../../utils/isAuth";

module.exports = {
  Query: {
    getAssignments: async (_: any, __: any, context: any) => {
      logger.info("GraphQL assignmnets/getAssignments");

      // Return all the assignments in all the classrooms the user is a student in.

      const user = isAuth(context);

      const classrooms = await prisma.usersOnClassrooms.findMany({
        where: {
          userId: user.id,
        },
      });

      if (classrooms) {
        const assignments = await prisma.$transaction(
          classrooms.map((classroom) =>
            prisma.assignment.findMany({
              where: {
                classroomId: classroom.classroomId,
                dueDate: { gt: new Date() },
              },
              include: {
                classroom: { include: { creator: true } },
              },
            })
          )
        );

        return assignments.flat();
      }

      return [];
    },
    getAssignment: async (
      _: any,
      { assignmentId, classroomId }: QueryGetAssignmentArgs,
      context: any
    ) => {
      logger.info("GraphQL assignment/assignmentId");

      // Return all information for a single assignment based on the assignmentId and classroomId for teachers and students to view

      const user = isAuth(context);

      // TODO add return stats
      const assignment = await prisma.assignment.findUnique({
        where: {
          id: parseInt(assignmentId),
        },
        include: {
          classroom: { include: { creator: true } },
          problems: {
            include: {
              problem: {
                include: {
                  specification: true,
                },
              },
            },
          },
        },
      });

      if (!assignment || assignment.classroomId !== parseInt(classroomId)) {
        throw new ApolloError(
          "Cannot find that assignment for that classroom."
        );
      }

      const userInClassroom = await prisma.usersOnClassrooms.findUnique({
        where: {
          userId_classroomId: {
            classroomId: assignment.classroom.id,
            userId: user.id,
          },
        },
      });

      // If you don't own the classroom or are not a student in the classroom, you cannot view this assignment
      if (!(assignment.classroom.creator.id === user.id || userInClassroom)) {
        throw new ApolloError(
          "You cannot get an assignment you are not associated with."
        );
      }

      return {
        ...assignment,
        problems: assignment.problems.map((e) => e.problem),
      };
    },
    getAssignmentProblemSubmissions: async (
      _: any,
      { assignmentId }: QueryGetAssignmentProblemSubmissionsArgs,
      context: any
    ) => {
      logger.info("GraphQL submissions/getAssignmentProblemSubmissions");

      // Returns the submissions made for the problems in an assignment

      // get problems for assignment
      // get submissions for each problem
      // filter for submissions made after assignment was created
      // return each problem with it's associated submissions

      const user = isAuth(context);

      const assignment = await prisma.assignment.findUnique({
        where: {
          id: parseInt(assignmentId),
        },
        include: {
          problems: {
            include: {
              problem: {
                include: {
                  specification: true,
                },
              },
            },
          },
        },
      });

      if (!assignment) {
        throw new ApolloError("Assignment does not exist.");
      }

      const problems = assignment.problems.map((e) => e.problem);

      // Map each problem in the assignment to the submissions made
      const problemSubmissionsMap = await Promise.all(
        problems.map(async (problem) => {
          const submissions = await prisma.submission.findMany({
            where: {
              createdAt: {
                gte: assignment?.setDate,
              },
              problemId: problem.id,
              userId: parseInt(user.id),
            },
            include: {
              problem: { include: { specification: true } },
            },
          });

          return { problem, submissions };
        })
      );

      return problemSubmissionsMap;
    },
    getAssignmentSubmissions: async (
      _: any,
      { assignmentId, userId }: QueryGetAssignmentSubmissionsArgs,
      context: any
    ) => {
      logger.info("GraphQL submissions/getAssignmentSubmissions");

      // Gets the AssignmentSubmission for an assignment.

      // TODO add validation based on how this is used
      if (!userId) {
        const user = isAuth(context);
        userId = user.id as string;
      }

      const userObj = await prisma.user.findUnique({
        where: {
          id: parseInt(userId),
        },
      });

      if (!userObj) {
        throw new ApolloError("User does not exist.");
      }

      const assignment = await prisma.assignment.findUnique({
        where: {
          id: parseInt(assignmentId),
        },
        include: {
          problems: {
            include: {
              problem: {
                include: {
                  specification: true,
                },
              },
            },
          },
        },
      });

      if (!assignment) {
        throw new ApolloError("Assignment does not exist.");
      }

      const problems = assignment.problems.map((e) => e.problem);

      const assignmentSubmission = await Promise.all(
        problems.map(async (problem) => {
          const assignmentSubmission =
            await prisma.assignmentSubmission.findUnique({
              where: {
                userId_assignmentId_problemId: {
                  userId: userObj.id,
                  problemId: problem.id,
                  assignmentId: assignment.id,
                },
              },
              include: {
                assignment: true,
                user: true,
                submission: {
                  include: {
                    testCaseSubmissions: {
                      include: {
                        testCase: true,
                      },
                    },
                    problem: {
                      include: {
                        specification: true,
                      },
                    },
                  },
                },
                problem: {
                  include: {
                    specification: true,
                  },
                },
              },
            });
          if (assignmentSubmission) {
            return assignmentSubmission;
          } else {
            return { problem, assignment, user: userObj };
          }
        })
      );

      return assignmentSubmission;
    },
    getAssignmentSubmissionsAsTeacher: async (
      _: any,
      { assignmentId }: QueryGetAssignmentSubmissionsAsTeacherArgs,
      context: any
    ) => {
      logger.info("GraphQL submissions/getAssignmentSubmissionsAsTeacher");

      // Used by teacher to view all the assignment submissions on a table

      const user = isAuth(context);

      const assignment = await prisma.assignment.findUnique({
        where: {
          id: parseInt(assignmentId),
        },
        include: {
          problems: { include: { problem: true } },
          classroom: { include: { creator: true } },
        },
      });

      if (!assignment) {
        throw new ApolloError("This assignment does not exist.");
      }

      // Only the creator of the classroom for the assignment can view all the submissions
      // TODO uncomment this
      // if (assignment.classroom.creator.id != user.id) {
      //   throw new ApolloError(
      //     "This user is the not the creator of this assignment."
      //   );
      // }

      const learners = await prisma.usersOnClassrooms.findMany({
        where: {
          classroomId: assignment.classroomId,
        },
        include: {
          user: true,
        },
      });

      const userAssignmentSubmission = await Promise.all(
        learners.map(async ({ user }) => {
          const assignmentSubmissions =
            await prisma.assignmentSubmission.findMany({
              where: {
                userId: user.id,
                assignmentId: assignment.id,
              },
              include: {
                submission: true,
                problem: {
                  include: {
                    specification: true,
                  },
                },
              },
            });
          return { user, assignmentSubmissions };
        })
      );

      return userAssignmentSubmission;
    },
  },
  Mutation: {
    createAssignment: async (
      _: any,
      {
        classroomId,
        assignmentName,
        dueDate,
        problemIds,
      }: MutationCreateAssignmentArgs,
      context: any
    ) => {
      logger.info("GraphQL assignments/createAssignment");

      // Used by teachers to create an assignment

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

      const dueDateObject = new Date(dueDate);
      if (
        !(dueDateObject instanceof Date && !isNaN(dueDateObject.getTime())) ||
        new Date() > dueDateObject
      ) {
        throw new ApolloError(
          "Failed to create assignment due to invalid due date."
        );
      }

      const existingAssignment = await prisma.assignment.findFirst({
        where: {
          name: assignmentName,
          classroomId: classroom.id,
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

      if (problems.length === 0) {
        throw new ApolloError(
          "Cannot create assignment without valid problems."
        );
      }

      try {
        const assignment = await prisma.assignment.create({
          data: {
            name: assignmentName,
            classroomId: classroom.id,
            setDate: new Date(),
            createdAt: new Date(),
            dueDate: dueDateObject,
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
      } catch (error) {
        throw new ApolloError("Failed to create assignment.");
      }
    },
    removeAssignment: async (
      _: any,
      { assignmentId, assignmentName }: MutationRemoveAssignmentArgs,
      context: any
    ) => {
      logger.info("GraphQL assignments/removeAssignment");

      // Remove an assignment from a classroom. User must enter assignment name correctly.

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

      await prisma.assignment.delete({
        where: {
          id: assignment.id,
        },
      });

      return true;
    },
    setAssignmentSubmissionMark: async (
      _: any,
      {
        userId,
        assignmentId,
        problemId,
        mark,
      }: MutationSetAssignmentSubmissionMarkArgs,
      context: any
    ) => {
      logger.info("GraphQL submissions/setAssignmentSubmissionMark");

      // Updates the mark for an assignment submission
      // Only creator of the classroom for the assignment can set the mark

      const user = isAuth(context);

      const assignmentSubmission = await prisma.assignmentSubmission.findUnique(
        {
          where: {
            userId_assignmentId_problemId: {
              userId: parseInt(userId),
              assignmentId: parseInt(assignmentId),
              problemId: parseInt(problemId),
            },
          },
          include: {
            assignment: {
              include: {
                classroom: {
                  include: {
                    creator: true,
                  },
                },
              },
            },
          },
        }
      );

      if (!assignmentSubmission) {
        throw new ApolloError("Failed to find assignment submission.");
      }

      if (assignmentSubmission.assignment.classroom.creator.id !== user.id) {
        throw new ApolloError(
          "You do not have permission to set the mark for this assignment submission."
        );
      }

      if (mark < 0 || mark > 100) {
        throw new ApolloError("Mark is not valid. Must be between 1-100.");
      }

      return await prisma.assignmentSubmission.update({
        where: {
          userId_assignmentId_problemId: {
            userId: assignmentSubmission.userId,
            assignmentId: assignmentSubmission.assignmentId,
            problemId: assignmentSubmission.problemId,
          },
        },
        data: {
          mark,
        },
        include: {
          assignment: true,
          user: true,
          submission: {
            include: {
              testCaseSubmissions: {
                include: {
                  testCase: true,
                },
              },
              problem: {
                include: {
                  specification: true,
                },
              },
            },
          },
          problem: {
            include: {
              specification: true,
            },
          },
        },
      });
    },
    setAssignmentProblemSubmission: async (
      _: any,
      {
        assignmentId,
        submissionId,
      }: MutationSetAssignmentProblemSubmissionArgs,
      context: any
    ) => {
      logger.info("GraphQL submissions/setAssignmentProblemSubmission");

      // Used by student to set their submission for a problem in an assignment

      const assignment = await prisma.assignment.findUnique({
        where: {
          id: parseInt(assignmentId),
        },
        include: {
          problems: { include: { problem: true } },
        },
      });

      if (!assignment) {
        throw new ApolloError("This assignment does not exist.");
      }

      // TODO check if a submission for this problem was already done
      const submission = await prisma.submission.findUnique({
        where: {
          id: parseInt(submissionId),
        },
        include: {
          user: true,
          problem: true,
        },
      });

      if (!submission) {
        throw new ApolloError("Submission does not exist.");
      }

      const problems = assignment.problems.map((e) => e.problem);

      if (!problems) {
        // This error shouldn't occur since we validate when problems are created.
        throw new ApolloError("This assignment has no problems.");
      }

      if (problems.some((problem) => problem.id === submission.problemId)) {
        try {
          await prisma.assignmentSubmission.delete({
            where: {
              userId_assignmentId_problemId: {
                userId: submission.userId,
                problemId: submission.problemId,
                assignmentId: assignment.id,
              },
            },
          });
        } catch (error) {
          // throw new ApolloError(error as string);
        }

        const assignmentSubmission = await prisma.assignmentSubmission.create({
          data: {
            userId: submission.userId,
            problemId: submission.problemId,
            assignmentId: assignment.id,
            submissionId: submission.id,
            createdAt: new Date(),
          },
        });

        return assignmentSubmission;
      } else {
        throw new ApolloError(
          "The problem this submission solves is not part of this assignment."
        );
      }
    },
    removeAssignmentProblemSubmission: async (
      _: any,
      {
        assignmentId,
        problemId,
      }: MutationRemoveAssignmentProblemSubmissionArgs,
      context: any
    ) => {
      logger.info("GraphQL submissions/removeAssignmentProblemSubmission");

      // Removes an assignment submission

      const user = isAuth(context);

      const assignment = await prisma.assignment.findUnique({
        where: {
          id: parseInt(assignmentId),
        },
        include: {
          problems: { include: { problem: true } },
        },
      });

      if (!assignment) {
        throw new ApolloError("This assignment does not exist");
      }
      try {
        await prisma.assignmentSubmission.delete({
          where: {
            userId_assignmentId_problemId: {
              userId: user.id,
              problemId: parseInt(problemId),
              assignmentId: assignment.id,
            },
          },
        });
        return true;
      } catch (error) {
        throw new ApolloError(
          "Could not delete your submission for this assignment problem. It might not exist."
        );
      }
    },
  },
};
