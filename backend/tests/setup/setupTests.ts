import { prisma } from "../..";
import { seed } from "./seed";

const deleteAll = async () => {
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;
  for (const { tablename } of tablenames) {
    if (tablename !== "_prisma_migrations") {
      try {
        await prisma.$executeRawUnsafe(
          `TRUNCATE TABLE "public"."${tablename}" CASCADE;`
        );
        await prisma.$executeRawUnsafe(
          `TRUNCATE TABLE "public"."${tablename}" RESTART IDENTITY CASCADE;`
        );
      } catch (error) {
        console.log({ error });
      }
    }
  }
};

const runSeed = async () => {
  await seed();
};

beforeEach(async () => {
  await deleteAll();
  await runSeed();
});

beforeAll(async () => {
  await deleteAll();
  await runSeed();
});

jest.setTimeout(30000);
