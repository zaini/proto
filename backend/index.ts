import { ApolloServer } from "apollo-server-express";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { Strategy as GitHubStrategy } from "passport-github2";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { createAccessToken } from "./graphql/resolvers/utils/tokens";

const typeDefs = require("./graphql/typeDefs/typeDefs");
const resolvers = require("./graphql/resolvers");

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID as string;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET as string;
const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI as string;

const app = express();
app.use(express.json());
// https://studio.apollographql.com is there so I can test GraphQL locally, will remove for deployment.
app.use(
  cors({
    origin: ["http://localhost:3000", "https://studio.apollographql.com"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.set("trust proxy", 1);
app.use(
  session({
    secret: "sfhnekfj",
    resave: true,
    saveUninitialized: true,
    // Doesn't work locally if I use this
    // cookie: {
    //   sameSite: "none",
    //   secure: true,
    //   maxAge: 1000 * 60 * 60 * 24 * 7, // One Week
    // },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// TODO Only store IDs in 'user', change this!
passport.serializeUser((user: any, done) => {
  return done(null, user.id);
});

passport.deserializeUser(async (user_id: any, done) => {
  const user = await prisma.user.findUnique({
    where: {
      id: user_id,
    },
  });
  // This is what is sent to the frontend
  return done(null, createAccessToken(user));
});

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      // called on successful authentication (step 2)
      let user = await prisma.user.findUnique({
        where: {
          githubId: profile.id,
        },
      });

      if (user === null) {
        user = await prisma.user.create({
          data: { username: profile.username, githubId: profile.id },
        });
      }

      return done(null, user);
    }
  )
);

// Called when trying to authenticate (step 1)
app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// Called when authentication has been completed (step 3)
app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: GITHUB_REDIRECT_URI }),
  (req, res) => {
    // Redirect them back to the website
    res.redirect("http://localhost:3000/");
  }
);

app.get("/auth/logout", (req, res) => {
  if (req.user) {
    req.logout();
  }
  res.send("done");
});

app.get("/getUserToken", (req, res) => {
  res.send(req.user);
});

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

export { app, apolloServer, prisma };
