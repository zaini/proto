import { sign, verify } from "jsonwebtoken";
import { logger } from "../logger";

const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET as string;

const createAccessToken = (data: any, duration = "8h") => {
  logger.info("Creating access token", { meta: JSON.stringify({ duration }) });
  try {
    return sign({ ...data }, JWT_TOKEN_SECRET, {
      expiresIn: duration,
    });
  } catch (error) {
    logger.error("Failed to create access token", error);
    throw new Error(`${error}`);
  }
};

const authenticateToken = (token: string) => {
  logger.info("Attempting to authenticate access token", {
    meta: JSON.stringify({ token }),
  });
  if (token) {
    try {
      logger.info("Successfully authenticated access token");
      return verify(token, JWT_TOKEN_SECRET);
    } catch (error) {
      logger.error("Failed to authenticate access token", {
        meta: JSON.stringify(token),
        error,
      });
      throw new Error("Invalid Login Token");
    }
  }
  logger.error("Failed to authenticate access token as it did not exist", {
    meta: JSON.stringify(token),
  });
  throw new Error("Invalid Login Token");
};

export { createAccessToken, authenticateToken };
