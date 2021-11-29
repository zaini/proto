import { prisma } from "../index";

async function main() {
  await prisma.user.createMany({
    data: [
      { githubId: "11", username: "ali" },
      { githubId: "22", username: "bob" },
      { githubId: "33", username: "cathy" },
    ],
  });
  const allUsers = await prisma.user.findMany();
  console.log(JSON.stringify(allUsers));
  await prisma.classroom.createMany({
    data: [{ userId: 1 }, { userId: 2 }],
  });
  const allClassrooms = await prisma.classroom.findMany();
  console.log(JSON.stringify(allClassrooms));
  await prisma.usersOnClassrooms.createMany({
    data: [
      { userId: 1, classroomId: 2 },
      { userId: 2, classroomId: 1 },
      { userId: 3, classroomId: 1 },
      { userId: 3, classroomId: 2 },
    ],
  });
  const allUsersOnClassrooms = await prisma.usersOnClassrooms.findMany();
  console.log(JSON.stringify(allUsersOnClassrooms));
  const classroom2students = await prisma.classroom.findFirst({
    where: { id: 1 },
    include: { UsersOnClassrooms: { include: { user: true } } },
  });
  console.log(JSON.stringify(classroom2students?.UsersOnClassrooms[0].user));
}
main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
