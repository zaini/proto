import { prisma } from "../index";
import { logger } from "../logger";
import { seed } from "../tests/setup/seed";

async function main() {
  await seed();
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
