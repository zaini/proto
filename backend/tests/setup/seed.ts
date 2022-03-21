import { prisma } from "../..";
import { logger } from "../../logger";

enum Difficulty {
  Easy = "EASY",
  Hard = "HARD",
  Medium = "MEDIUM",
}

const seed = async () => {
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
      creator: {
        connect: {
          id: 1,
        },
      },
      specification: {
        create: {
          title: "Addition",
          difficulty: Difficulty.Easy,
          description:
            "Add two numbers and return the result.\n\n## Example 1\n`Input: 1 2`\n\n`Output: 3`\n\n## Example 2\n`Input: 5 7`\n\n`Output: 12`",
          initialCode: JSON.stringify({
            71: `#!/bin/python3
  
def add(a, b):
  return a + b

if __name__ == "__main__":
  stdin = input()
  a, b = stdin.split()
  a, b = int(a), int(b)
  print(add(a, b))
`,
            63: `const add = (a, b) => {
  return a + b;
}

process.stdin.on("data", buffer => {
  const ab = (buffer + "").split(" ");
  const a = parseInt(ab[0]);
  const b = parseInt(ab[1]);
  console.log(add(a, b));
});
`,
          }),
          testCases: {
            createMany: {
              data: [
                {
                  stdin: "10 22",
                  expectedOutput: "32",
                  isHidden: false,
                  userId: 1,
                },
                {
                  stdin: "10 20",
                  expectedOutput: "30",
                  isHidden: false,
                  userId: 1,
                },
                {
                  stdin: "70 20",
                  expectedOutput: "90",
                  isHidden: true,
                  userId: 1,
                },
                {
                  stdin: "242323 22342340",
                  expectedOutput: "22584663",
                  isHidden: true,
                  userId: 1,
                },
              ],
            },
          },
        },
      },
    },
  });

  const problem2 = await prisma.problem.create({
    data: {
      creator: {
        connect: {
          id: 1,
        },
      },
      specification: {
        create: {
          title: "Subtraction",
          difficulty: Difficulty.Easy,
          description:
            "Subtract two numbers and return the result.\n\n## Example 1\n`Input: 2 1`\n\n`Output: 1`\n\n## Example 2\n`Input: 5 7`\n\n`Output: -2`",
          initialCode: JSON.stringify({
            71: `#!/bin/python3
  
def subtract(a, b):
  return a - b

if __name__ == "__main__":
  stdin = input()
  a, b = stdin.split()
  a, b = int(a), int(b)
  print(subtract(a, b))
`,
            63: `const subtract = (a, b) => {
  return a - b;
}

process.stdin.on("data", buffer => {
  const ab = (buffer + "").split(" ");
  const a = parseInt(ab[0]);
  const b = parseInt(ab[1]);
  console.log(subtract(a, b));
});
`,
          }),
          testCases: {
            createMany: {
              data: [
                {
                  stdin: "22 10",
                  expectedOutput: "12",
                  isHidden: false,
                  userId: 1,
                },
                {
                  stdin: "20 10",
                  expectedOutput: "10",
                  isHidden: false,
                  userId: 1,
                },
                {
                  stdin: "70 20",
                  expectedOutput: "50",
                  isHidden: true,
                  userId: 1,
                },
                {
                  stdin: "242323 22342340",
                  expectedOutput: "-22100017",
                  isHidden: true,
                  userId: 1,
                },
              ],
            },
          },
        },
      },
    },
  });

  const problem3 = await prisma.problem.create({
    data: {
      creator: {
        connect: {
          id: 1,
        },
      },
      specification: {
        create: {
          title: "Double Word",
          difficulty: Difficulty.Easy,
          description:
            'Return a word concatenated with itself.\n\n## Example 1\n`Input: "hello"`\n\n`Output: "hellohello"`\n',
          initialCode: JSON.stringify({
            71: `#!/bin/python3
  
def doubleup(word):
  return word + word

if __name__ == "__main__":
  stdin = input()
  word = stdin
  print(doubleup(word))
`,
            63: `const doubleup = (word) => {
  return \`\${word}\${word}\`;
}

process.stdin.on("data", buffer => {
  const word = (buffer + "");
  console.log(doubleup(word));
});
`,
          }),
          testCases: {
            createMany: {
              data: [
                {
                  stdin: "hello",
                  expectedOutput: "hellohello",
                  isHidden: false,
                  userId: 1,
                },
                {
                  stdin: "big work",
                  expectedOutput: "big workbig work",
                  isHidden: false,
                  userId: 1,
                },
                {
                  stdin: "xx",
                  expectedOutput: "xxxx",
                  isHidden: true,
                  userId: 1,
                },
                {
                  stdin: "test",
                  expectedOutput: "testtest",
                  isHidden: true,
                  userId: 1,
                },
              ],
            },
          },
        },
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
      { problemId: problem2.id, assignmentId: 1 },
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

  await prisma.rating.createMany({
    data: [
      { problemId: problem1.id, userId: 1, score: 1 },
      { problemId: problem1.id, userId: 2, score: 2 },
      { problemId: problem1.id, userId: 3, score: 5 },
    ],
  });
  const ratings = await prisma.rating.findMany();
  logger.info("Successfully seeded ratings");
  logger.debug(JSON.stringify(ratings));
};

export { seed };
