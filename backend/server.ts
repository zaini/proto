import { app, apolloServer, prisma } from "./index";
import { logger } from "./logger";

const port = process.env.PORT || 5000;

app.listen(port, () => {
  logger.info(`Server started at http://localhost:${port}`);
  logger.info(`GraphQL at http://localhost:${port}${apolloServer.graphqlPath}`);
});
