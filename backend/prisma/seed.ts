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
