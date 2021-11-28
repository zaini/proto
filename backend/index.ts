import { ApolloServer } from "apollo-server-express";
import express from "express";
import { PrismaClient } from "@prisma/client";
import FormData from "form-data";
import fetch from "node-fetch";
import bodyParser from "body-parser";

const typeDefs = require("./graphql/typeDefs/typeDefs");
const resolvers = require("./graphql/resolvers");

const github_client_id = process.env.GITHUB_CLIENT_ID as string;
const github_redirect_uri = process.env.GITHUB_REDIRECT_URI as string;
const github_client_secret = process.env.GITHUB_CLIENT_SECRET as string;

const app = express();

const prisma = new PrismaClient();

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

let apolloServer: any = null;
async function startApolloServer() {
  try {
    apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => ({ req }),
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: corsOptions });
  } catch (error) {
    console.log(error);
  }
}
startApolloServer();

app.use(bodyParser.json());
app.use(bodyParser.json({ type: "text/*" }));
app.use(bodyParser.urlencoded({ extended: false }));
// Enabled Access-Control-Allow-Origin", "*" in the header so as to by-pass the CORS error.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// https://levelup.gitconnected.com/how-to-implement-login-with-github-in-a-react-app-bd3d704c64fc
app.post("/authenticate", (req, res) => {
  console.log(req.body);
  const { code } = req.body;

  const data = new FormData();
  data.append("client_id", github_client_id);
  data.append("client_secret", github_client_secret);
  data.append("code", code);
  data.append("redirect_uri", github_redirect_uri);

  // Request to exchange code for an access token
  fetch(`https://github.com/login/oauth/access_token`, {
    method: "POST",
    body: data as any,
  })
    .then((response: any) => response.text())
    .then(async (paramsString: any) => {
      let params = new URLSearchParams(paramsString);
      const access_token = params.get("access_token");

      // Request to return email data of a user that has been authenticated
      const emails = await fetch(`https://api.github.com/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      });
      const result = { access_token, emails: await emails.json() };

      return res.status(200).json(result);
    })
    .catch((error: any) => {
      return res.status(400).json(error);
    });
});

export { app, apolloServer, prisma };
