import axios from "axios";
import { createAccessToken } from "../utils/tokens";

const GRAPHQL_BACKEND_URL = "http://localhost:5000/graphql";

describe("submissions resolvers", () => {
  test("getSubmissionsForProblem with no submissions made", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getSubmissionsForProblem($problemId: ID!) {
          getSubmissionsForProblem(problemId: $problemId) {
            id
          }
        }`,
        variables: {
          problemId: "1",
        },
      },
      {
        headers: {
          Authorization: validUserAccessToken,
        },
      }
    );

    const { data } = response;

    expect(data).toMatchObject({
      data: {
        getSubmissionsForProblem: [],
      },
    });
  });
  test("getSubmissionsForProblem with invalid problem id", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getSubmissionsForProblem($problemId: ID!) {
          getSubmissionsForProblem(problemId: $problemId) {
            id
          }
        }`,
        variables: {
          problemId: "-1",
        },
      },
      {
        headers: {
          Authorization: validUserAccessToken,
        },
      }
    );

    const { data } = response;

    expect(data.errors[0].message).toBe("This problem does not exist.");
  });
  test("getSubmissionsForProblem with one submissions made", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const submissionResponse = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation submitProblem($problemId: ID!, $code: String!, $language: Int!) {
          submitProblem(problemId: $problemId, code: $code, language: $language) {
            id
            userId
            passed
            language
          }
        }`,
        variables: {
          problemId: "1",
          code: "random code",
          language: 71,
        },
      },
      {
        headers: {
          Authorization: validUserAccessToken,
        },
      }
    );

    const { data: submissionData } = submissionResponse;

    expect(submissionData).toMatchObject({
      data: {
        submitProblem: {
          id: "2",
          userId: "1",
          passed: false,
          language: 71,
        },
      },
    });

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getSubmissionsForProblem($problemId: ID!) {
          getSubmissionsForProblem(problemId: $problemId) {
            id
          }
        }`,
        variables: {
          problemId: "1",
        },
      },
      {
        headers: {
          Authorization: validUserAccessToken,
        },
      }
    );

    const { data } = response;

    expect(data).toMatchObject({
      data: {
        getSubmissionsForProblem: [
          {
            id: "2",
          },
        ],
      },
    });
  });
  test("getSubmission for invalid submission id", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getSubmission($submissionId: ID!) {
          getSubmission(submissionId: $submissionId) {
            id
          }
        }`,
        variables: {
          submissionId: "-1",
        },
      },
      {
        headers: {
          Authorization: validUserAccessToken,
        },
      }
    );

    const { data } = response;

    expect(data.errors[0].message).toBe(
      "Could not find submission with that ID."
    );
  });
  test("getSubmission for valid submission id", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const submissionResponse = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation submitProblem($problemId: ID!, $code: String!, $language: Int!) {
          submitProblem(problemId: $problemId, code: $code, language: $language) {
            id
            userId
            passed
            language
          }
        }`,
        variables: {
          problemId: "1",
          code: "random code",
          language: 71,
        },
      },
      {
        headers: {
          Authorization: validUserAccessToken,
        },
      }
    );

    const { data: submissionData } = submissionResponse;

    expect(submissionData).toMatchObject({
      data: {
        submitProblem: {
          id: "2",
          userId: "1",
          passed: false,
          language: 71,
        },
      },
    });

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getSubmission($submissionId: ID!) {
          getSubmission(submissionId: $submissionId) {
            id
          }
        }`,
        variables: {
          submissionId: "1",
        },
      },
      {
        headers: {
          Authorization: validUserAccessToken,
        },
      }
    );

    const { data } = response;

    expect(data).toMatchObject({
      data: {
        getSubmission: {
          id: "1",
        },
      },
    });
  });
  test("submitTests with valid arguments", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation submitTests(
          $code: String!
          $language: Int!
          $testCases: [TestCaseInput!]!
        ) {
          submitTests(code: $code, language: $language, testCases: $testCases) {
            passed
            stdout
            stderr
            compile_output
            description
            testCase {
              stdin
              expectedOutput
              isHidden
            }
          }
        }`,
        variables: {
          language: 71,
          code: 'print("hello")',
          testCases: [
            {
              stdin: "",
              expectedOutput: "hello",
              isHidden: false,
            },
            {
              stdin: "input",
              expectedOutput: "output",
              isHidden: true,
            },
          ],
        },
      },
      {
        headers: {
          Authorization: validUserAccessToken,
        },
      }
    );

    const { data } = response;

    expect(data).toMatchObject({
      data: {
        submitTests: [
          {
            passed: true,
            stdout: "hello\n",
            stderr: "",
            compile_output: "",
            description: "Accepted",
            testCase: {
              stdin: "",
              expectedOutput: "hello",
              isHidden: false,
            },
          },
          {
            passed: false,
            stdout: "hello\n",
            stderr: "",
            compile_output: "",
            description: "Wrong Answer",
            testCase: {
              stdin: "input",
              expectedOutput: "output",
              isHidden: true,
            },
          },
        ],
      },
    });
  });
  test("submitTests with invalid language", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation submitTests(
          $code: String!
          $language: Int!
          $testCases: [TestCaseInput!]!
        ) {
          submitTests(code: $code, language: $language, testCases: $testCases) {
            id
          }
        }`,
        variables: {
          language: -1,
          code: 'print("hello")',
          testCases: [
            {
              stdin: "",
              expectedOutput: "hello",
              isHidden: false,
            },
          ],
        },
      },
      {
        headers: {
          Authorization: validUserAccessToken,
        },
      }
    );

    const { data } = response;

    expect(data.errors[0].message).toBe("This language is not supported.");
  });
  test("submitTests with no test cases", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation submitTests(
          $code: String!
          $language: Int!
          $testCases: [TestCaseInput!]!
        ) {
          submitTests(code: $code, language: $language, testCases: $testCases) {
            id
          }
        }`,
        variables: {
          language: 71,
          code: 'print("hello")',
          testCases: [],
        },
      },
      {
        headers: {
          Authorization: validUserAccessToken,
        },
      }
    );

    const { data } = response;

    expect(data.errors[0].message).toBe(
      "Cannot submit tests without test cases."
    );
  });
  test("submitProblem with valid arguments", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation submitProblem($problemId: ID!, $code: String!, $language: Int!) {
          submitProblem(problemId: $problemId, code: $code, language: $language) {
            id
            userId
            passed
            language
          }
        }`,
        variables: {
          language: 71,
          code: 'print("hello")',
          problemId: "1",
        },
      },
      {
        headers: {
          Authorization: validUserAccessToken,
        },
      }
    );

    const { data } = response;

    expect(data).toMatchObject({
      data: {
        submitProblem: {
          id: "2",
          userId: "1",
          passed: false,
          language: 71,
        },
      },
    });
  });
  test("submitProblem with invalid language", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation submitProblem($problemId: ID!, $code: String!, $language: Int!) {
          submitProblem(problemId: $problemId, code: $code, language: $language) {
            id
            userId
            passed
            language
          }
        }`,
        variables: {
          language: -1,
          code: 'print("hello")',
          problemId: "1",
        },
      },
      {
        headers: {
          Authorization: validUserAccessToken,
        },
      }
    );

    const { data } = response;

    expect(data.errors[0].message).toBe("This language is not supported.");
  });
  test("submitProblem with invalid problem id", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation submitProblem($problemId: ID!, $code: String!, $language: Int!) {
          submitProblem(problemId: $problemId, code: $code, language: $language) {
            id
            userId
            passed
            language
          }
        }`,
        variables: {
          language: 71,
          code: 'print("hello")',
          problemId: "-1",
        },
      },
      {
        headers: {
          Authorization: validUserAccessToken,
        },
      }
    );

    const { data } = response;

    expect(data.errors[0].message).toBe("This problem does not exist.");
  });
});
