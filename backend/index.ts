import { ApolloServer } from "apollo-server-express";
import express from "express";
import { PrismaClient } from "@prisma/client";

const typeDefs = require("./graphql/typeDefs/typeDefs");
const resolvers = require("./graphql/resolvers");

const app = express();
const port = process.env.PORT || 8080;

const prisma = new PrismaClient();

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

let apolloServer: any = null;
async function startApolloServer() {
  apolloServer = new ApolloServer({ typeDefs, resolvers });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: corsOptions });
}
startApolloServer();

app.get("/test", (req: any, res: any) => {
  res.send("test success");
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
  console.log(`graphql at http://localhost:${port}${apolloServer.graphqlPath}`);
});
