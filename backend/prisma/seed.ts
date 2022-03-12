import { prisma } from "../index";
import { logger } from "../logger";

enum Difficulty {
  Easy = "EASY",
  Hard = "HARD",
  Medium = "MEDIUM",
}

async function main() {
  logger.info("Starting seeding for database");
  await prisma.user.createMany({
    data: [
      { githubId: "11", username: "ali" },
      { githubId: "22", username: "bob" },
      { githubId: "33", username: "cathy" },
      { githubId: "51179189", username: "zaini" },
    ],
  });
  const allUsers = await prisma.user.findMany();
  logger.info("Successfully seeded users");
  logger.debug(JSON.stringify(allUsers));

  await prisma.classroom.createMany({
    data: [
      { userId: 1, name: "Classroom A", password: "" },
      { userId: 2, name: "Classroom B", password: "" },
      { userId: 4, name: "Classroom Test", password: "" },
    ],
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
      { userId: 3, classroomId: 3 },
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
        difficulty: Difficulty.Easy,
        description: "Add two numbers together and return the result",
        initialCode: `#!/bin/python3

def add(a, b):
  return a + b

if __name__ == "__main__":
  stdin = input()
  a, b = stdin.split()
  a, b = int(a), int(b)
  print(add(a, b))
`,
        testCases: [
          { id: "1", stdin: "10 22", expectedOutput: "32", isHidden: false },
          { id: "2", stdin: "10 20", expectedOutput: "30", isHidden: false },
          { id: "3", stdin: "70 20", expectedOutput: "90", isHidden: true },
          {
            id: "4",
            stdin: "242323 22342340",
            expectedOutput: "22584663",
            isHidden: true,
          },
        ],
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
        difficulty: Difficulty.Medium,
        description: "Add two numbers together and return the result",
        initialCode: "def add(a, b):\n  return a + b",
        testCases: [
          { id: "1", stdin: "10 22", expectedOutput: "32", isHidden: false },
        ],
      },
    },
  });
  const problem3 = await prisma.problem.create({
    data: {
      userId: 3,
      specification: {
        title: "Three Sum",
        difficulty: Difficulty.Hard,
        description: "Add two numbers together and return the result",
        initialCode: "def add(a, b):\n  return a + b",
        testCases: [
          { id: "1", stdin: "10 22", expectedOutput: "32", isHidden: false },
        ],
      },
    },
  });
  const allProblems = await prisma.assignment.findMany();
  logger.info("Successfully seeded problems");
  logger.debug(JSON.stringify(allProblems));

  await prisma.assignment.createMany({
    data: [
      {
        classroomId: 1,
        name: "HW1",
        setDate: new Date(),
        dueDate: new Date("1/1/3000"),
      },
      {
        classroomId: 1,
        name: "HW2",
        setDate: new Date(),
        dueDate: new Date("1/1/3000"),
      },
      {
        classroomId: 2,
        name: "HW1",
        setDate: new Date(),
        dueDate: new Date("1/1/3000"),
      },
      {
        classroomId: 3,
        name: "HW1",
        setDate: new Date(),
        dueDate: new Date("1/1/3000"),
      },
    ],
  });
  const allAssignments = await prisma.assignment.findMany();
  logger.info("Successfully seeded assignments");
  logger.debug(JSON.stringify(allAssignments));

  await prisma.problemsOnAssignments.createMany({
    data: [
      { problemId: problem1.id, assignmentId: 1 },
      { problemId: problem3.id, assignmentId: 1 },
      { problemId: problem3.id, assignmentId: 2 },
      { problemId: problem2.id, assignmentId: 3 },
      { problemId: problem1.id, assignmentId: 4 },
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
