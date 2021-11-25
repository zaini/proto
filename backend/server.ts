import { app, apolloServer, prisma } from "./index";

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
  console.log(`graphql at http://localhost:${port}${apolloServer.graphqlPath}`);
});
