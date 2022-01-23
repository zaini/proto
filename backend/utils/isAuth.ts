const { AuthenticationError, ApolloError } = require("apollo-server");
const { verify } = require("jsonwebtoken");

const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET as string;

// Returns user details if it is authenticated
const isAuth = (context: any) => {
  const authHeader = context.req.headers.authorization;
  const needle = "Bearer ";
  if (authHeader) {
    const token = authHeader.split(needle)[1];
    if (token) {
      try {
        const verifiedToken = verify(token, JWT_TOKEN_SECRET);
        return verifiedToken;
      } catch (error) {
        throw new AuthenticationError("Invalid Login Token");
      }
    }
    throw new ApolloError("Missing Authorization Token", "400");
  }
  throw new ApolloError("Missing Authorization Header", "400");
};

export { isAuth };
