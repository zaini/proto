import { AuthenticationError } from "apollo-server-errors";
import { sign, verify } from "jsonwebtoken";

const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET as string;

const createAccessToken = (data: any, duration = "2h") => {
  try {
    return sign({ ...data }, JWT_TOKEN_SECRET, {
      expiresIn: duration,
    });
  } catch (error) {
    throw new Error(`${error}`);
  }
};

const authenticateToken = (token: string) => {
  if (token) {
    try {
      return verify(token, JWT_TOKEN_SECRET);
    } catch (error) {
      throw new AuthenticationError("Invalid Login Token");
    }
  }
  throw new AuthenticationError("Invalid Login Token");
};

export { createAccessToken, authenticateToken };
