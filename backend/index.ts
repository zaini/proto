import { ApolloServer } from "apollo-server-express";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { Strategy as GitHubStrategy } from "passport-github2";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { createAccessToken } from "./utils/tokens";
import { logger } from "./logger";

const typeDefs = require("./graphql/typeDefs/typeDefs");
const resolvers = require("./graphql/resolvers");

const FRONTEND_URL = process.env.FRONTEND_URL as string;
const GITHUB_CLIENT_ID = process.env.CLIENT_ID_GITHUB as string;
const GITHUB_CLIENT_SECRET = process.env.CLIENT_SECRET_GITHUB as string;
const GITHUB_REDIRECT_URI = process.env.REDIRECT_URI_GITHUB as string;
const SESSION_SECRET = process.env.SESSION_SECRET as string;

let sessionConfig: any = {
  secret: SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
};
let originConfig = [FRONTEND_URL, "https://studio.apollographql.com"];

if (process.env.NODE_ENV === "production") {
  sessionConfig = {
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // One Week
    },
  };
  originConfig = [FRONTEND_URL];
} else if (process.env.NODE_ENV === "development") {
  // Use default configs
} else if (process.env.NODE_ENV === "test") {
  // Use default configs
}

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: originConfig,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.set("trust proxy", 1);
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

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
      logger.info("GitHub auth callback", {
        meta: JSON.stringify({ id: profile.id, username: profile.username }),
      });
      let user = await prisma.user.findUnique({
        where: {
          githubId: profile.id,
        },
      });

      if (user === null) {
        logger.info("New user created", {
          meta: JSON.stringify({ id: profile.id, username: profile.username }),
        });
        user = await prisma.user.create({
          data: { username: profile.username, githubId: profile.id },
        });
      } else {
      }
      logger.info("Completed GitHub auth callback");
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
    logger.info("Authentication complete, redirecting to frontend");
    res.redirect(FRONTEND_URL);
  }
);

app.get("/auth/logout", (req, res) => {
  logger.info("GET Logout");
  if (req.user) {
    req.logout();
  }
  logger.info("Logout complete");
  res.send("done");
});

app.get("/getUserToken", (req, res) => {
  logger.info("GET user JWT token");
  res.send(req.user);
});

const prisma = new PrismaClient();

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

let apolloServer: any = null;
const startApolloServer = async () => {
  logger.info("Attempting to start Apollo Server");
  try {
    apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => ({ req }),
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: corsOptions });
    logger.info("Successfully started Apollo Server");
  } catch (error) {
    logger.error("Failed to start Apollo Server", error);
  }
};
startApolloServer();

export { app, apolloServer, prisma };
