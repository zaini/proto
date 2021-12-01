import { prisma } from "../index";
import { logger } from "../logger";

async function main() {
  logger.info("Starting seeding for database");
  await prisma.user.createMany({
    data: [
      { githubId: "11", username: "ali" },
      { githubId: "22", username: "bob" },
      { githubId: "33", username: "cathy" },
    ],
  });
  const allUsers = await prisma.user.findMany();
  logger.info("Successfully seeded users");
  logger.debug(JSON.stringify(allUsers));

  await prisma.classroom.createMany({
    data: [{ userId: 1 }, { userId: 2 }],
  });
  const allClassrooms = await prisma.classroom.findMany();
  logger.info("Successfully seeded classrooms");
  logger.debug(JSON.stringify(allClassrooms));

  await prisma.usersOnClassrooms.createMany({
    data: [
      { userId: 1, classroomId: 2 },
      { userId: 2, classroomId: 1 },
      { userId: 3, classroomId: 1 },
      { userId: 3, classroomId: 2 },
    ],
  });
  const allUsersOnClassrooms = await prisma.usersOnClassrooms.findMany();
  logger.info("Successfully seeded users in classrooms");
  logger.debug(JSON.stringify(allUsersOnClassrooms));

  await prisma.problem.createMany({
    data: [
      { userId: 1, specification: { problem_name: "One Sum" }, likes: 10 },
      { userId: 2, specification: { problem_name: "Two Sum" } },
      { userId: 3, specification: { problem_name: "Three Sum" } },
    ],
  });
  const allProblems = await prisma.assignment.findMany();
  logger.info("Successfully seeded problems");
  logger.debug(JSON.stringify(allProblems));

  await prisma.assignment.createMany({
    data: [
      { classroomId: 1, setDate: new Date(), dueDate: new Date() },
      { classroomId: 1, setDate: new Date(), dueDate: new Date() },
      { classroomId: 2, setDate: new Date(), dueDate: new Date() },
    ],
  });
  const allAssignments = await prisma.assignment.findMany();
  logger.info("Successfully seeded assignments");
  logger.debug(JSON.stringify(allAssignments));

  await prisma.problemsOnAssignments.createMany({
    data: [
      { problemId: 1, assignmentId: 1 },
      { problemId: 3, assignmentId: 2 },
      { problemId: 2, assignmentId: 3 },
    ],
  });
  const allProblemsOnAssignments =
    await prisma.problemsOnAssignments.findMany();
  logger.info("Successfully seeded problems on assignments");
  logger.debug(JSON.stringify(allProblemsOnAssignments));
}
main()
  .catch((e) => {
    logger.error(e);
    throw e;
  })
  .finally(async () => {
    logger.info("Disconnecting from Prisma instance");
    await prisma.$disconnect();
  });
