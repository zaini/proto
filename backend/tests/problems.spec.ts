import axios from "axios";
import { createAccessToken } from "../utils/tokens";

const GRAPHQL_BACKEND_URL = "http://localhost:5000/graphql";

describe("problems resolvers", () => {
  test("getProblems without a filter", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getProblems($filter: String) {
        getProblems(filter: $filter) {
          id
          creator {
            username
          }
          rating {
            numberOfRatings
            totalRating
          }
          specification {
            difficulty
            title
          }
          solved
        }
      }`,
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
        getProblems: [
          {
            id: "1",
            creator: {
              username: "ali",
            },
            rating: {
              numberOfRatings: 3,
              totalRating: 8,
            },
            specification: {
              difficulty: "EASY",
              title: "Addition",
            },
            solved: false,
          },
          {
            id: "2",
            creator: {
              username: "ali",
            },
            rating: {
              numberOfRatings: 0,
              totalRating: 0,
            },
            specification: {
              difficulty: "EASY",
              title: "Subtraction",
            },
            solved: false,
          },
          {
            id: "3",
            creator: {
              username: "ali",
            },
            rating: {
              numberOfRatings: 0,
              totalRating: 0,
            },
            specification: {
              difficulty: "EASY",
              title: "Double Word",
            },
            solved: false,
          },
        ],
      },
    });
  });
  test("getProblems with filter for 'double word'", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getProblems($filter: String) {
        getProblems(filter: $filter) {
          id
          creator {
            username
          }
          rating {
            numberOfRatings
            totalRating
          }
          specification {
            difficulty
            title
          }
          solved
        }
      }`,
        variables: {
          filter: "double word",
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
        getProblems: [
          {
            id: "3",
            creator: {
              username: "ali",
            },
            rating: {
              numberOfRatings: 0,
              totalRating: 0,
            },
            specification: {
              difficulty: "EASY",
              title: "Double Word",
            },
            solved: false,
          },
        ],
      },
    });
  });
  test("getProblem with existing problemId", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getProblem($problemId: ID!) {
          getProblem(problemId: $problemId) {
            id
            creator {
              username
            }
            rating {
              numberOfRatings
              totalRating
              userRating {
                score
              }
            }
            specification {
              title
              difficulty
              description
              initialCode
              testCases {
                id
                stdin
                expectedOutput
                isHidden
              }
            }
          }
        }
        `,
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
        getProblem: {
          id: "1",
          creator: {
            username: "ali",
          },
          rating: {
            numberOfRatings: 3,
            totalRating: 8,
            userRating: {
              score: 1,
            },
          },
          specification: {
            title: "Addition",
            difficulty: "EASY",
            description:
              "Add two numbers and return the result.\n\n## Example 1\n`Input: 1 2`\n\n`Output: 3`\n\n## Example 2\n`Input: 5 7`\n\n`Output: 12`",
            initialCode:
              '{"63":"const add = (a, b) => {\\n  return a + b;\\n}\\n\\nprocess.stdin.on(\\"data\\", buffer => {\\n  const ab = (buffer + \\"\\").split(\\" \\");\\n  const a = parseInt(ab[0]);\\n  const b = parseInt(ab[1]);\\n  console.log(add(a, b));\\n});\\n","71":"#!/bin/python3\\n  \\ndef add(a, b):\\n  return a + b\\n\\nif __name__ == \\"__main__\\":\\n  stdin = input()\\n  a, b = stdin.split()\\n  a, b = int(a), int(b)\\n  print(add(a, b))\\n"}',
            testCases: [
              {
                id: "1",
                stdin: "10 22",
                expectedOutput: "32",
                isHidden: false,
              },
              {
                id: "2",
                stdin: "10 20",
                expectedOutput: "30",
                isHidden: false,
              },
              {
                id: "3",
                stdin: "70 20",
                expectedOutput: "90",
                isHidden: true,
              },
              {
                id: "4",
                stdin: "242323 22342340",
                expectedOutput: "22584663",
                isHidden: true,
              },
            ],
          },
        },
      },
    });
  });
  test("getProblem with not existing problemId", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getProblem($problemId: ID!) {
          getProblem(problemId: $problemId) {
            id
            creator {
              username
            }
            rating {
              numberOfRatings
              totalRating
              userRating {
                score
              }
            }
            specification {
              title
              difficulty
              description
              initialCode
              testCases {
                id
                stdin
                expectedOutput
                isHidden
              }
            }
          }
        }
        `,
        variables: {
          problemId: "999",
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
        getProblem: null,
      },
    });
  });
  test("getProblem with invalid problemId", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getProblem($problemId: ID!) {
          getProblem(problemId: $problemId) {
            id
            creator {
              username
            }
            rating {
              numberOfRatings
              totalRating
              userRating {
                score
              }
            }
            specification {
              title
              difficulty
              description
              initialCode
              testCases {
                id
                stdin
                expectedOutput
                isHidden
              }
            }
          }
        }
        `,
        variables: {
          problemId: "INVALID",
        },
      },
      {
        headers: {
          Authorization: validUserAccessToken,
        },
      }
    );

    const { data } = response;

    expect(data.errors[0].message).toBe("Could not find problem.");
  });
  test("getDefaultInitialCodes", async () => {
    const response = await axios.post(GRAPHQL_BACKEND_URL, {
      query: `query getProblem {
          getDefaultInitialCodes
        }`,
    });

    const { data } = response;

    // This should be updated as new languages are added.
    expect(data).toMatchObject({
      data: {
        getDefaultInitialCodes:
          '{"62":"import java.util.Scanner;\\n\\npublic class Main {\\n    public static int add(int a, int b) {\\n        return a + b;\\n    }\\n\\n    public static void main(String[] args) {\\n        Scanner myObj = new Scanner(System.in);\\n        String stdin = myObj.nextLine();\\n\\n        String[] ab = stdin.split(\\"\\\\\\\\s+\\");\\n\\n        int a = Integer.parseInt(ab[0]);\\n        int b = Integer.parseInt(ab[1]);\\n\\n        int result = add(a, b);\\n\\n        System.out.println(result);\\n    }\\n}","63":"const add = (a, b) => {\\n  return a + b;\\n}\\n\\nprocess.stdin.on(\\"data\\", buffer => {\\n  const ab = (buffer + \\"\\").split(\\" \\");\\n  const a = parseInt(ab[0]);\\n  const b = parseInt(ab[1]);\\n  console.log(add(a, b));\\n});","70":"def add(a, b):\\n  return a + b\\n\\nif __name__ == \\"__main__\\":\\n  stdin = raw_input()\\n  a, b = stdin.split()\\n  a, b = int(a), int(b)\\n  print add(a, b)","71":"#!/bin/python3\\n\\ndef add(a, b):\\n  return a + b\\n\\nif __name__ == \\"__main__\\":\\n  stdin = input()\\n  a, b = stdin.split()\\n  a, b = int(a), int(b)\\n  print(add(a, b))"}',
      },
    });
  });
  test("createProblem with valid specification", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation createProblem($specification: SpecificationInput!) {
          createProblem(specification: $specification) {
            id
            solved
            specification {
              title
              description
              initialCode
              testCases {
                id
                stdin
                expectedOutput
                isHidden
              }
              difficulty
            }
          }
        }`,
        variables: {
          specification: {
            title: "New Problem",
            difficulty: "HARD",
            testCases: [
              {
                expectedOutput: "7",
                isHidden: false,
                stdin: "3, 4",
              },
              {
                expectedOutput: "3",
                isHidden: true,
                stdin: "whatever",
              },
            ],
            description: "Description text",
            initialCode: '{"71": "code for language with code 71 (python)"}',
          },
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
        createProblem: {
          id: "4",
          solved: null,
          specification: {
            title: "New Problem",
            description: "Description text",
            initialCode: '{"71": "code for language with code 71 (python)"}',
            testCases: [
              {
                stdin: "3, 4",
                expectedOutput: "7",
                isHidden: false,
              },
              {
                stdin: "whatever",
                expectedOutput: "3",
                isHidden: true,
              },
            ],
            difficulty: "HARD",
          },
        },
      },
    });
  });
  test("createProblem with invalid specification: no testcases", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation createProblem($specification: SpecificationInput!) {
          createProblem(specification: $specification) {
            id
            solved
            specification {
              title
              description
              initialCode
              testCases {
                id
                stdin
                expectedOutput
                isHidden
              }
              difficulty
            }
          }
        }`,
        variables: {
          specification: {
            title: "New Problem",
            difficulty: "HARD",
            testCases: [],
            description: "Description text",
            initialCode: '{"71": "code for language with code 71 (python)"}',
          },
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
      "Problem must have at least one test case."
    );
  });
  test("createProblem with invalid specification: no description", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation createProblem($specification: SpecificationInput!) {
          createProblem(specification: $specification) {
            id
            solved
            specification {
              title
              description
              initialCode
              testCases {
                id
                stdin
                expectedOutput
                isHidden
              }
              difficulty
            }
          }
        }`,
        variables: {
          specification: {
            title: "New Problem",
            difficulty: "HARD",
            testCases: [
              {
                stdin: "3, 4",
                expectedOutput: "7",
                isHidden: false,
              },
            ],
            description: "",
            initialCode: '{"71": "code for language with code 71 (python)"}',
          },
        },
      },
      {
        headers: {
          Authorization: validUserAccessToken,
        },
      }
    );

    const { data } = response;

    expect(data.errors[0].message).toBe("Problem description cannot be empty.");
  });
  test("createProblem with invalid specification: no problem name", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation createProblem($specification: SpecificationInput!) {
          createProblem(specification: $specification) {
            id
            solved
            specification {
              title
              description
              initialCode
              testCases {
                id
                stdin
                expectedOutput
                isHidden
              }
              difficulty
            }
          }
        }`,
        variables: {
          specification: {
            title: "",
            difficulty: "HARD",
            testCases: [
              {
                stdin: "3, 4",
                expectedOutput: "7",
                isHidden: false,
              },
            ],
            description: "Description text",
            initialCode: '{"71": "code for language with code 71 (python)"}',
          },
        },
      },
      {
        headers: {
          Authorization: validUserAccessToken,
        },
      }
    );

    const { data } = response;

    expect(data.errors[0].message).toBe("Problem name cannot be empty.");
  });
  test("createProblem with invalid specification: no valid initial code", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation createProblem($specification: SpecificationInput!) {
          createProblem(specification: $specification) {
            id
            solved
            specification {
              title
              description
              initialCode
              testCases {
                id
                stdin
                expectedOutput
                isHidden
              }
              difficulty
            }
          }
        }`,
        variables: {
          specification: {
            title: "New Problem",
            difficulty: "HARD",
            testCases: [
              {
                stdin: "3, 4",
                expectedOutput: "7",
                isHidden: false,
              },
            ],
            description: "Description text",
            initialCode:
              '{"invalid": "code for language with code 71 (python)"}',
          },
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
      "Problem must use at least one valid language."
    );
  });
  test("createProblem with invalid specification: no initial code", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation createProblem($specification: SpecificationInput!) {
          createProblem(specification: $specification) {
            id
            solved
            specification {
              title
              description
              initialCode
              testCases {
                id
                stdin
                expectedOutput
                isHidden
              }
              difficulty
            }
          }
        }`,
        variables: {
          specification: {
            title: "New Problem",
            difficulty: "HARD",
            testCases: [
              {
                expectedOutput: "7",
                isHidden: false,
                stdin: "3, 4",
              },
            ],
            description: "Description text",
            initialCode: "",
          },
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
      "Invalid initial code structure. Must be mapping from language code to string."
    );
  });
  test("rateProblem with valid problem ID and score", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const score = 50;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation rateProblem($problemId: ID!, $score: Float!) {
          rateProblem(problemId: $problemId, score: $score)
        }`,
        variables: {
          problemId: "1",
          score: score,
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
        rateProblem: true,
      },
    });

    const problemResponse = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getProblem($problemId: ID!) {
          getProblem(problemId: $problemId) {
            rating {
              numberOfRatings
              totalRating
              userRating {
                score
              }
            }
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

    const { data: problemData } = problemResponse;
    expect(problemData).toMatchObject({
      data: {
        getProblem: {
          rating: {
            numberOfRatings: 3,
            totalRating: 57,
            userRating: {
              score: 50,
            },
          },
        },
      },
    });
  });
  test("rateProblem with valid problem ID and score of 100", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const score = 100;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation rateProblem($problemId: ID!, $score: Float!) {
          rateProblem(problemId: $problemId, score: $score)
        }`,
        variables: {
          problemId: "1",
          score: score,
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
        rateProblem: true,
      },
    });

    const problemResponse = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getProblem($problemId: ID!) {
          getProblem(problemId: $problemId) {
            rating {
              numberOfRatings
              totalRating
              userRating {
                score
              }
            }
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

    const { data: problemData } = problemResponse;
    expect(problemData).toMatchObject({
      data: {
        getProblem: {
          rating: {
            numberOfRatings: 3,
            totalRating: 107,
            userRating: {
              score: 100,
            },
          },
        },
      },
    });
  });
  test("rateProblem with valid problem ID and score of 101", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const score = 101;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation rateProblem($problemId: ID!, $score: Float!) {
          rateProblem(problemId: $problemId, score: $score)
        }`,
        variables: {
          problemId: "1",
          score: score,
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
      "Invalid score. Must be between 0 and 100."
    );

    const problemResponse = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getProblem($problemId: ID!) {
          getProblem(problemId: $problemId) {
            rating {
              numberOfRatings
              totalRating
              userRating {
                score
              }
            }
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

    const { data: problemData } = problemResponse;
    expect(problemData).toMatchObject({
      data: {
        getProblem: {
          rating: {
            numberOfRatings: 3,
            totalRating: 8,
            userRating: {
              score: 1,
            },
          },
        },
      },
    });
  });
  test("rateProblem with valid problem ID and score of 0", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const score = 0;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation rateProblem($problemId: ID!, $score: Float!) {
          rateProblem(problemId: $problemId, score: $score)
        }`,
        variables: {
          problemId: "1",
          score: score,
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
        rateProblem: true,
      },
    });

    const problemResponse = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getProblem($problemId: ID!) {
          getProblem(problemId: $problemId) {
            rating {
              numberOfRatings
              totalRating
              userRating {
                score
              }
            }
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

    const { data: problemData } = problemResponse;
    expect(problemData).toMatchObject({
      data: {
        getProblem: {
          rating: {
            numberOfRatings: 3,
            totalRating: 7,
            userRating: {
              score: 0,
            },
          },
        },
      },
    });
  });
  test("rateProblem with valid problem ID and score of -1", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const score = -1;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation rateProblem($problemId: ID!, $score: Float!) {
          rateProblem(problemId: $problemId, score: $score)
        }`,
        variables: {
          problemId: "1",
          score: score,
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
      "Invalid score. Must be between 0 and 100."
    );

    const problemResponse = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getProblem($problemId: ID!) {
          getProblem(problemId: $problemId) {
            rating {
              numberOfRatings
              totalRating
              userRating {
                score
              }
            }
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

    const { data: problemData } = problemResponse;
    expect(problemData).toMatchObject({
      data: {
        getProblem: {
          rating: {
            numberOfRatings: 3,
            totalRating: 8,
            userRating: {
              score: 1,
            },
          },
        },
      },
    });
  });
});
