import { prisma } from "../../index";
import { logger } from "../../logger";
import axios from "axios";
import e from "express";

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
      { code, language, testCases }: any,
      context: any
    ) => {
      var axios = require("axios").default;
      let options;
      let res: {
        id: number;
        testCase: any;
        passed: boolean;
        stdout: any;
        stderr: any;
        time: any;
        memory: any;
      }[] = [];

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
          const result = {
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
      return res;
    },
  },
};
