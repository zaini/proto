import axios from "axios";
import { prisma } from "../../index";
import { logger } from "../../logger";
import { TestCaseResult } from "../../../gql-types";

module.exports = {
  Query: {
    getProblems: () => {
      logger.info("GraphQL problems/getProblems");
      const problems = prisma.problem.findMany();
      return problems;
    },
    getProblem: async (_: any, { problemId }: any, context: any) => {
      logger.info("GraphQL problems/getProblem");
      const problem = await prisma.problem.findUnique({
        where: { id: parseInt(problemId) },
        include: { creator: true },
      });
      return problem;
    },
  },
  Mutation: {
    submitCustomTests: async (
      _: any,
      { code, language, testCases }: any,
      context: any
    ) => {
      logger.info("GraphQL problems/submitCustomTests");
      var axios = require("axios").default;
      let options;
      let res: TestCaseResult[] = [];

      await Promise.all(
        testCases.map(async (testCase: any) => {
          options = {
            method: "POST",
            url: "http://localhost:2358/submissions",
            params: { base64_encoded: "false", fields: "*" },
            headers: { "content-type": "application/json" },
            data: {
              language_id: language,
              source_code: code,
              stdin: testCase.input,
            },
          };

          let submission_token;
          await axios
            .request(options)
            .then(function (response: any) {
              submission_token = response.data.token;
            })
            .catch(function (error: any) {
              logger.error("Error submitting code to Judge0", error);
              return [];
            });

          let time;
          let x;
          while (!time) {
            x = await axios.get(
              `http://localhost:2358/submissions/${submission_token}`
            );
            time = x.data.time;
          }
          const result: TestCaseResult = {
            id: testCase.id,
            testCase,
            passed: x.data.stdout === testCase.expectedOutput,
            stdout: x.data.stdout,
            stderr: x.data.stderr,
            time: x.data.time,
            memory: x.data.memory,
          };

          res.push(result);
        })
      );
      logger.info("Test case results: ", {
        meta: JSON.stringify(res),
      });
      return res;
    },
  },
};
