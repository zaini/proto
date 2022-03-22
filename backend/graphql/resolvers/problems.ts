import { MutationCreateProblemArgs } from "./../../gql-types.d";
import { ApolloError } from "apollo-server";
import { prisma } from "../../index";
import { logger } from "../../logger";
import { isAuth } from "../../utils/isAuth";
import { LanguageCodeToName } from "../../utils/types";
import { getUserProblemRatingInformation } from "../../utils/resolverUtils";
import { Prisma } from "@prisma/client";

module.exports = {
  Query: {
    getProblems: async (_: any, { filter }: any, context: any) => {
      logger.info("GraphQL problems/getProblems");

      // Get all problems with relavent user information such as ratings and whether they've solved it.

      const user = isAuth(context);

      const where: Prisma.ProblemWhereInput = filter
        ? {
            OR: [
              {
                id: { equals: isNaN(parseInt(filter)) ? -1 : parseInt(filter) },
              },
              {
                specification: {
                  title: {
                    contains: filter,
                    mode: "insensitive",
                  },
                },
              },
            ],
          }
        : {};

      const problems = await prisma.problem.findMany({
        where,
        include: { creator: true, ratings: true, specification: true },
      });

      const problemsWithSolved = await Promise.all(
        problems.map(async (problem) => {
          // Try to find a solved submission for this problem
          const submission = await prisma.submission.findFirst({
            where: {
              userId: user.id,
              problemId: problem.id,
              passed: true,
            },
          });

          // Get users rating for the problem
          const userRating = await prisma.rating.findFirst({
            where: {
              userId: user.id,
              problemId: problem.id,
            },
          });

          return {
            ...problem,
            rating: getUserProblemRatingInformation(userRating, problem),
            solved: submission ? true : false,
          };
        })
      );

      return problemsWithSolved;
    },
    getProblem: async (_: any, { problemId }: any, context: any) => {
      logger.info("GraphQL problems/getProblem");

      // Get problem, used when viewing a problem to solve it.

      const user = isAuth(context);

      try {
        const problem = await prisma.problem.findUnique({
          where: { id: parseInt(problemId) },
          include: {
            creator: true,
            ratings: true,
            specification: {
              include: {
                testCases: true,
              },
            },
          },
        });

        if (problem) {
          // Try to get user rating if they have made one.
          let userRating = {} as any;
          try {
            userRating = await prisma.rating.findFirst({
              where: {
                userId: user.id,
                problemId: problem.id,
              },
            });
          } catch {}

          return {
            ...problem,
            rating: getUserProblemRatingInformation(userRating, problem),
          };
        }
      } catch (error) {
        throw new ApolloError("Could not find problem.");
      }

      return null;
    },
    getDefaultInitialCodes: async (_: any, __: any, context: any) => {
      logger.info("GraphQL problems/getDefaultInitialCodes");

      // Return the default initial code for the supported languages.
      // Should also be in the types in the utils for the frontend and backend.
      // Used when creating a new problem.

      // 71: "Python (3.8.1)",
      // 70: "Python (2.7.9)",
      // 63: "JavaScript (Node.js 12.14.0)",
      // 74: "TypeScript (3.7.4)",
      // 62: "Java (OpenJDK 13.0.1)",

      return JSON.stringify({
        71: `#!/bin/python3

def add(a, b):
  return a + b

if __name__ == "__main__":
  stdin = input()
  a, b = stdin.split()
  a, b = int(a), int(b)
  print(add(a, b))`,
        70: `def add(a, b):
  return a + b

if __name__ == "__main__":
  stdin = raw_input()
  a, b = stdin.split()
  a, b = int(a), int(b)
  print add(a, b)`,
        63: `const add = (a, b) => {
  return a + b;
}

process.stdin.on("data", buffer => {
  const ab = (buffer + "").split(" ");
  const a = parseInt(ab[0]);
  const b = parseInt(ab[1]);
  console.log(add(a, b));
});`,
        62: `import java.util.Scanner;

public class Main {
    public static int add(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        Scanner myObj = new Scanner(System.in);
        String stdin = myObj.nextLine();

        String[] ab = stdin.split("\\\\s+");

        int a = Integer.parseInt(ab[0]);
        int b = Integer.parseInt(ab[1]);

        int result = add(a, b);

        System.out.println(result);
    }
}`,
      });
    },
  },
  Mutation: {
    createProblem: async (
      _: any,
      { specification }: MutationCreateProblemArgs,
      context: any
    ) => {
      logger.info("GraphQL problems/createProblem");

      // Creates a new problem from a given specification.

      const user = isAuth(context);

      const { title, description, testCases, initialCode, difficulty } =
        specification;

      let initialCodeObj;
      try {
        initialCodeObj = JSON.parse(initialCode);
      } catch (error) {
        throw new ApolloError(
          "Invalid initial code structure. Must be mapping from language code to string."
        );
      }

      if (title === "") {
        throw new ApolloError("Problem name cannot be empty.");
      } else if (description === "") {
        throw new ApolloError("Problem description cannot be empty.");
      } else if (!testCases || (testCases && testCases.length === 0)) {
        throw new ApolloError("Problem must have at least one test case.");
      } else if (
        Object.keys(initialCodeObj).length === 0 ||
        Object.keys(initialCodeObj).some(
          (code) => !(parseInt(code) in LanguageCodeToName)
        )
      ) {
        throw new ApolloError("Problem must use at least one valid language.");
      }

      const problem = await prisma.problem.create({
        data: {
          creator: {
            connect: {
              id: user.id,
            },
          },
          specification: {
            create: {
              title,
              difficulty,
              description,
              initialCode,
              testCases: {
                createMany: {
                  data: testCases.map((testCase) => {
                    return { ...testCase, userId: user.id };
                  }),
                },
              },
            },
          },
        },
        include: {
          specification: {
            include: {
              testCases: true,
            },
          },
        },
      });

      return problem;
    },
    rateProblem: async (_: any, { problemId, score }: any, context: any) => {
      logger.info("GraphQL problems/rateProblem");

      // User can rate a problem, either creating a new rating or updating their previous one.

      const user = isAuth(context);

      const problem = await prisma.problem.findUnique({
        where: {
          id: parseInt(problemId),
        },
      });

      if (!problem) {
        throw new ApolloError("This problem does not exist.");
      }

      if (score < 0 || score > 100) {
        throw new ApolloError("Invalid score. Must be between 0 and 100.");
      }

      const existingRating = await prisma.rating.findUnique({
        where: {
          problemId_userId: {
            problemId: problem.id,
            userId: user.id,
          },
        },
      });

      if (existingRating) {
        await prisma.rating.update({
          where: {
            problemId_userId: {
              problemId: problem.id,
              userId: user.id,
            },
          },
          data: {
            score: score,
          },
        });
      } else {
        await prisma.rating.create({
          data: {
            problemId: problem.id,
            userId: user.id,
            score: score,
          },
        });
      }

      return true;
    },
  },
};
