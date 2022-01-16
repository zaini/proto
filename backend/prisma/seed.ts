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

  const problem1 = await prisma.problem.create({
    data: {
      userId: 1,
      specification: {
        title: "Addition",
        description: "Add two numbers together and return the result",
        initialCode: "def add(a, b):\n  return a + b",
      },
      likes: 27,
      dislikes: 3,
    },
  });
  const problem2 = await prisma.problem.create({
    data: {
      userId: 2,
      specification: {
        title: "Two Sum",
        description: "Add two numbers together and return the result",
        initialCode: "def add(a, b):\n  return a + b",
      },
    },
  });
  const problem3 = await prisma.problem.create({
    data: {
      userId: 3,
      specification: {
        title: "Three Sum",
        description: "Add two numbers together and return the result",
        initialCode: "def add(a, b):\n  return a + b",
      },
    },
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
      { problemId: problem1.id, assignmentId: 1 },
      { problemId: problem3.id, assignmentId: 2 },
      { problemId: problem2.id, assignmentId: 3 },
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
