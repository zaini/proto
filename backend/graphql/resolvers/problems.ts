import { prisma } from "../../index";
import { logger } from "../../logger";
import axios from "axios";

module.exports = {
  Query: {
    getProblems: () => {
      logger.info("GraphQL users/getProblems");
      const problems = prisma.problem.findMany();
      return problems;
    },
    getProblem: async (_: any, { problemId }: any, context: any) => {
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
      { problemId, code, language, testCases }: any,
      context: any
    ) => {
      console.log(problemId, code, language, testCases);

      var axios = require("axios").default;

      var options = {
        method: "POST",
        url: "http://localhost:2358/submissions",
        params: { base64_encoded: "false", fields: "*" },
        headers: { "content-type": "application/json" },
        data: {
          language_id: language,
          source_code: code,
          stdin: "",
        },
      };

      let submission_token;
      await axios
        .request(options)
        .then(function (response: any) {
          console.log(response.data);
          submission_token = response.data.token;
        })
        .catch(function (error: any) {
          console.error(error);
          return [];
        });

      let time;
      let stdout;
      let x;
      while (!time) {
        x = await axios.get(
          `http://localhost:2358/submissions/${submission_token}`
        );
        console.log(x.data);
        time = x.data.time;
      }
      stdout = x.data.stdout;

      return [
        {
          id: 1,
          passed: true,
          stdout: stdout,
        },
      ];
    },
  },
};
