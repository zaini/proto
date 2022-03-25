import axios from "axios";
import { createAccessToken } from "../../utils/tokens";

const GRAPHQL_BACKEND_URL = "http://localhost:5000/graphql";

describe("assignments resolvers", () => {
  test("getAssignments", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getAssignments {
          getAssignments {
            id
            name
            classroom {
              id
              name
            }
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
        getAssignments: [
          {
            id: "3",
            name: "HW1",
            classroom: {
              id: "2",
              name: "Classroom B",
            },
          },
        ],
      },
    });
  });
  test("getAssignment for valid assignment id and classroom id", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getAssignment($assignmentId: ID!, $classroomId: ID!) {
          getAssignment(assignmentId: $assignmentId, classroomId: $classroomId) {
            id
          }
        }`,
        variables: {
          assignmentId: "1",
          classroomId: "1",
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
        getAssignment: {
          id: "1",
        },
      },
    });
  });
  test("getAssignment for invalid assignment id and valid classroom id", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getAssignment($assignmentId: ID!, $classroomId: ID!) {
          getAssignment(assignmentId: $assignmentId, classroomId: $classroomId) {
            id
          }
        }`,
        variables: {
          assignmentId: "-1",
          classroomId: "1",
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
      "Cannot find that assignment for that classroom."
    );
  });
  test("getAssignment for valid assignment id and invalid classroom id", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getAssignment($assignmentId: ID!, $classroomId: ID!) {
          getAssignment(assignmentId: $assignmentId, classroomId: $classroomId) {
            id
          }
        }`,
        variables: {
          assignmentId: "1",
          classroomId: "-1",
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
      "Cannot find that assignment for that classroom."
    );
  });
  test("getAssignmentProblemSubmissions for valid assignment id", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getAssignmentProblemSubmissions($assignmentId: ID!) {
          getAssignmentProblemSubmissions(assignmentId: $assignmentId) {
            problem {
              id
            }
            submissions {
              id
            }
          }
        }`,
        variables: {
          assignmentId: "3",
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
        getAssignmentProblemSubmissions: [
          {
            problem: {
              id: "1",
            },
            submissions: [
              {
                id: "3",
              },
            ],
          },
          {
            problem: {
              id: "2",
            },
            submissions: [],
          },
        ],
      },
    });
  });
  test("getAssignmentProblemSubmissions for invalid assignment id", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getAssignmentProblemSubmissions($assignmentId: ID!) {
          getAssignmentProblemSubmissions(assignmentId: $assignmentId) {
            problem {
              id
            }
            submissions {
              id
            }
          }
        }`,
        variables: {
          assignmentId: "-1",
        },
      },
      {
        headers: {
          Authorization: validUserAccessToken,
        },
      }
    );

    const { data } = response;

    expect(data.errors[0].message).toBe("Assignment does not exist.");
  });
  test("getAssignmentProblemSubmissions for assignment id student is not in", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getAssignmentProblemSubmissions($assignmentId: ID!) {
          getAssignmentProblemSubmissions(assignmentId: $assignmentId) {
            problem {
              id
            }
            submissions {
              id
            }
          }
        }`,
        variables: {
          assignmentId: "1",
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
      "You do you have access to this assignment."
    );
  });
  test("getAssignmentSubmissions for user", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getAssignmentSubmissions($assignmentId: ID!) {
          getAssignmentSubmissions(assignmentId: $assignmentId) {
            mark
            comments
            user {
              id
            }
            submission {
              id
            }
            problem {
              id
            }
          }
        }`,
        variables: {
          assignmentId: "3",
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
        getAssignmentSubmissions: [
          {
            mark: null,
            comments: null,
            user: {
              id: "1",
            },
            submission: {
              id: "3",
            },
            problem: {
              id: "1",
            },
          },
          {
            mark: null,
            comments: null,
            user: {
              id: "1",
            },
            submission: null,
            problem: {
              id: "2",
            },
          },
        ],
      },
    });
  });
  test("getAssignmentSubmissions for another user in a classroom that this user owns", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getAssignmentSubmissions($assignmentId: ID!, $userId: ID) {
          getAssignmentSubmissions(assignmentId: $assignmentId, userId: $userId) {
            mark
            comments
            user {
              id
            }
            submission {
              id
            }
            problem {
              id
            }
          }
        }`,
        variables: {
          assignmentId: "1",
          userId: "3",
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
        getAssignmentSubmissions: [
          {
            mark: null,
            comments: null,
            user: {
              id: "3",
            },
            submission: null,
            problem: {
              id: "1",
            },
          },
          {
            mark: null,
            comments: null,
            user: {
              id: "3",
            },
            submission: null,
            problem: {
              id: "2",
            },
          },
          {
            mark: null,
            comments: null,
            user: {
              id: "3",
            },
            submission: null,
            problem: {
              id: "3",
            },
          },
        ],
      },
    });
  });
  test("getAssignmentSubmissions for user that does not exist", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getAssignmentSubmissions($assignmentId: ID!, $userId: ID) {
          getAssignmentSubmissions(assignmentId: $assignmentId, userId: $userId) {
            mark
            comments
            user {
              id
            }
            submission {
              id
            }
            problem {
              id
            }
          }
        }`,
        variables: {
          assignmentId: "1",
          userId: "-1",
        },
      },
      {
        headers: {
          Authorization: validUserAccessToken,
        },
      }
    );

    const { data } = response;

    expect(data.errors[0].message).toBe("User does not exist.");
  });
  test("getAssignmentSubmissions for assignment that does not exist", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getAssignmentSubmissions($assignmentId: ID!) {
          getAssignmentSubmissions(assignmentId: $assignmentId) {
            mark
            comments
            user {
              id
            }
            submission {
              id
            }
            problem {
              id
            }
          }
        }`,
        variables: {
          assignmentId: "-1",
        },
      },
      {
        headers: {
          Authorization: validUserAccessToken,
        },
      }
    );

    const { data } = response;

    expect(data.errors[0].message).toBe("Assignment does not exist.");
  });
  test("getAssignmentSubmissions for another user in a classroom that this user does not own", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getAssignmentSubmissions($assignmentId: ID!, $userId: ID) {
          getAssignmentSubmissions(assignmentId: $assignmentId, userId: $userId) {
            mark
            comments
            user {
              id
            }
            submission {
              id
            }
            problem {
              id
            }
          }
        }`,
        variables: {
          assignmentId: "4",
          userId: "2",
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
      "You do not have permission to get this assignment submission."
    );
  });
  test("getAssignmentSubmissions for user in classroom where the user is not in", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getAssignmentSubmissions($assignmentId: ID!, $userId: ID) {
          getAssignmentSubmissions(assignmentId: $assignmentId, userId: $userId) {
            mark
            comments
            user {
              id
            }
            submission {
              id
            }
            problem {
              id
            }
          }
        }`,
        variables: {
          assignmentId: "1",
          userId: "5",
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
      "Could not find user for this assignment."
    );
  });
  test("getAssignmentSubmissionsAsTeacher for assignment that user owns", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getAssignmentSubmissionsAsTeacher($assignmentId: ID!) {
          getAssignmentSubmissionsAsTeacher(assignmentId: $assignmentId) {
            user {
              id
            }
            assignmentSubmissions {
              user {
                id
              }
            }
          }
        }`,
        variables: {
          assignmentId: "1",
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
        getAssignmentSubmissionsAsTeacher: [
          {
            user: {
              id: "2",
            },
            assignmentSubmissions: [
              {
                user: {
                  id: "2",
                },
              },
            ],
          },
          {
            user: {
              id: "3",
            },
            assignmentSubmissions: [],
          },
        ],
      },
    });
  });
  test("getAssignmentSubmissionsAsTeacher for assignment that user does not own", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getAssignmentSubmissionsAsTeacher($assignmentId: ID!) {
          getAssignmentSubmissionsAsTeacher(assignmentId: $assignmentId) {
            user {
              id
            }
            assignmentSubmissions {
              user {
                id
              }
            }
          }
        }`,
        variables: {
          assignmentId: "3",
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
      "This user is the not the creator of this assignment."
    );
  });
  test("getAssignmentSubmissionsAsTeacher for assignment that does not exist", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getAssignmentSubmissionsAsTeacher($assignmentId: ID!) {
          getAssignmentSubmissionsAsTeacher(assignmentId: $assignmentId) {
            user {
              id
            }
            assignmentSubmissions {
              user {
                id
              }
            }
          }
        }`,
        variables: {
          assignmentId: "-1",
        },
      },
      {
        headers: {
          Authorization: validUserAccessToken,
        },
      }
    );

    const { data } = response;

    expect(data.errors[0].message).toBe("This assignment does not exist.");
  });
  test("createAssignment with valid args", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation createAssignment(
          $classroomId: ID!
          $assignmentName: String!
          $dueDate: String!
          $problemIds: [ID!]!
        ) {
          createAssignment(
            classroomId: $classroomId
            dueDate: $dueDate
            problemIds: $problemIds
            assignmentName: $assignmentName
          ) {
            id
            name
            dueDate
            problems {
              id
              specification {
                title
              }
            }
          }
        }`,
        variables: {
          classroomId: "1",
          assignmentName: "New Assignment",
          dueDate: new Date("1/1/3000"),
          problemIds: [1, 2, 3],
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
        createAssignment: {
          id: "5",
          name: "New Assignment",
          dueDate: "32503680000000",
          problems: [
            {
              id: "1",
              specification: {
                title: "Addition",
              },
            },
            {
              id: "2",
              specification: {
                title: "Subtraction",
              },
            },
            {
              id: "3",
              specification: {
                title: "Double Word",
              },
            },
          ],
        },
      },
    });
  });
  test("createAssignment with classroom id that user does not own", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation createAssignment(
          $classroomId: ID!
          $assignmentName: String!
          $dueDate: String!
          $problemIds: [ID!]!
        ) {
          createAssignment(
            classroomId: $classroomId
            dueDate: $dueDate
            problemIds: $problemIds
            assignmentName: $assignmentName
          ) {
            id
            name
            dueDate
            problems {
              id
              specification {
                title
              }
            }
          }
        }`,
        variables: {
          classroomId: "-1",
          assignmentName: "New Assignment",
          dueDate: new Date("1/1/3000"),
          problemIds: [1, 2, 3],
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
      "You cannot create an assignment for a classroom you do not own."
    );
  });
  test("createAssignment with no problems", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation createAssignment(
          $classroomId: ID!
          $assignmentName: String!
          $dueDate: String!
          $problemIds: [ID!]!
        ) {
          createAssignment(
            classroomId: $classroomId
            dueDate: $dueDate
            problemIds: $problemIds
            assignmentName: $assignmentName
          ) {
            id
            name
            dueDate
            problems {
              id
              specification {
                title
              }
            }
          }
        }`,
        variables: {
          classroomId: "1",
          assignmentName: "New Assignment",
          dueDate: new Date("1/1/3000"),
          problemIds: [],
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
      "Cannot create assignment without valid problems."
    );
  });
  test("createAssignment with invalid problem ids", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation createAssignment(
          $classroomId: ID!
          $assignmentName: String!
          $dueDate: String!
          $problemIds: [ID!]!
        ) {
          createAssignment(
            classroomId: $classroomId
            dueDate: $dueDate
            problemIds: $problemIds
            assignmentName: $assignmentName
          ) {
            id
            name
            dueDate
            problems {
              id
              specification {
                title
              }
            }
          }
        }`,
        variables: {
          classroomId: "1",
          assignmentName: "New Assignment",
          dueDate: new Date("1/1/3000"),
          problemIds: [-1],
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
      "Cannot create assignment without valid problems."
    );
  });
  test("createAssignment twice with the same name", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation createAssignment(
          $classroomId: ID!
          $assignmentName: String!
          $dueDate: String!
          $problemIds: [ID!]!
        ) {
          createAssignment(
            classroomId: $classroomId
            dueDate: $dueDate
            problemIds: $problemIds
            assignmentName: $assignmentName
          ) {
            id
            name
            dueDate
            problems {
              id
              specification {
                title
              }
            }
          }
        }`,
        variables: {
          classroomId: "1",
          assignmentName: "New Assignment",
          dueDate: new Date("1/1/3000"),
          problemIds: [1, 2, 3],
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
        createAssignment: {
          id: "5",
          name: "New Assignment",
          dueDate: "32503680000000",
          problems: [
            {
              id: "1",
              specification: {
                title: "Addition",
              },
            },
            {
              id: "2",
              specification: {
                title: "Subtraction",
              },
            },
            {
              id: "3",
              specification: {
                title: "Double Word",
              },
            },
          ],
        },
      },
    });

    const response2 = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation createAssignment(
          $classroomId: ID!
          $assignmentName: String!
          $dueDate: String!
          $problemIds: [ID!]!
        ) {
          createAssignment(
            classroomId: $classroomId
            dueDate: $dueDate
            problemIds: $problemIds
            assignmentName: $assignmentName
          ) {
            id
            name
            dueDate
            problems {
              id
              specification {
                title
              }
            }
          }
        }`,
        variables: {
          classroomId: "1",
          assignmentName: "New Assignment",
          dueDate: new Date("1/1/3000"),
          problemIds: [1, 2, 3],
        },
      },
      {
        headers: {
          Authorization: validUserAccessToken,
        },
      }
    );

    const { data: data2 } = response2;

    expect(data2.errors[0].message).toBe(
      "Cannot create assignment as you already have an assignment with the same name."
    );
  });
  test("createAssignment with due date in the past", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation createAssignment(
          $classroomId: ID!
          $assignmentName: String!
          $dueDate: String!
          $problemIds: [ID!]!
        ) {
          createAssignment(
            classroomId: $classroomId
            dueDate: $dueDate
            problemIds: $problemIds
            assignmentName: $assignmentName
          ) {
            id
            name
            dueDate
            problems {
              id
              specification {
                title
              }
            }
          }
        }`,
        variables: {
          classroomId: "1",
          assignmentName: "New Assignment",
          dueDate: new Date("1/1/2000"),
          problemIds: [1],
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
      "Failed to create assignment due to invalid due date."
    );
  });
  test("createAssignment with no name", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation createAssignment(
          $classroomId: ID!
          $assignmentName: String!
          $dueDate: String!
          $problemIds: [ID!]!
        ) {
          createAssignment(
            classroomId: $classroomId
            dueDate: $dueDate
            problemIds: $problemIds
            assignmentName: $assignmentName
          ) {
            id
            name
            dueDate
            problems {
              id
              specification {
                title
              }
            }
          }
        }`,
        variables: {
          classroomId: "1",
          assignmentName: "",
          dueDate: new Date("1/1/3000"),
          problemIds: [1],
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
      "Cannot create assignment with empty name."
    );
  });
  test("removeAssignment with valid id and name", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation removeAssignment($assignmentId: ID!, $assignmentName: String!) {
          removeAssignment(assignmentId: $assignmentId, assignmentName: $assignmentName)
        }
        `,
        variables: {
          assignmentId: "1",
          assignmentName: "HW1",
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
        removeAssignment: true,
      },
    });
  });
  test("removeAssignment with valid id and invalid name", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation removeAssignment($assignmentId: ID!, $assignmentName: String!) {
          removeAssignment(assignmentId: $assignmentId, assignmentName: $assignmentName)
        }
        `,
        variables: {
          assignmentId: "1",
          assignmentName: "INVALID",
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
      "Failed to remove assignment as the name you entered is not correct."
    );
  });
  test("removeAssignment with invalid id", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation removeAssignment($assignmentId: ID!, $assignmentName: String!) {
          removeAssignment(assignmentId: $assignmentId, assignmentName: $assignmentName)
        }
        `,
        variables: {
          assignmentId: "-1",
          assignmentName: "INVALID",
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
      "Failed to find assignment you are attempting to remove."
    );
  });
  test("removeAssignment which user does not own", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation removeAssignment($assignmentId: ID!, $assignmentName: String!) {
          removeAssignment(assignmentId: $assignmentId, assignmentName: $assignmentName)
        }
        `,
        variables: {
          assignmentId: "3",
          assignmentName: "HW1",
        },
      },
      {
        headers: {
          Authorization: validUserAccessToken,
        },
      }
    );

    const { data } = response;

    expect(data.errors[0].message).toBe("You do not own this assignment.");
  });
  test("setAssignmentSubmissionFeedback with valid arguments", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation setAssignmentSubmissionFeedback(
          $userId: ID!
          $problemId: ID!
          $mark: Float!
          $comments: String!
          $assignmentId: ID!
        ) {
          setAssignmentSubmissionFeedback(
            userId: $userId
            problemId: $problemId
            mark: $mark
            comments: $comments
            assignmentId: $assignmentId
          ) {
            mark
            comments
          }
        }`,
        variables: {
          assignmentId: "1",
          problemId: "1",
          mark: 50,
          comments: "Good Work!",
          userId: "2",
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
        setAssignmentSubmissionFeedback: {
          mark: 50,
          comments: "Good Work!",
        },
      },
    });
  });
  test("setAssignmentSubmissionFeedback when user has not made a submission", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation setAssignmentSubmissionFeedback(
          $userId: ID!
          $problemId: ID!
          $mark: Float!
          $comments: String!
          $assignmentId: ID!
        ) {
          setAssignmentSubmissionFeedback(
            userId: $userId
            problemId: $problemId
            mark: $mark
            comments: $comments
            assignmentId: $assignmentId
          ) {
            mark
            comments
          }
        }`,
        variables: {
          assignmentId: "1",
          problemId: "1",
          mark: 50,
          comments: "Good Work!",
          userId: "3",
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
      "Failed to find assignment submission."
    );
  });
  test("setAssignmentSubmissionFeedback with mark of 0", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const mark = 0;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation setAssignmentSubmissionFeedback(
          $userId: ID!
          $problemId: ID!
          $mark: Float!
          $comments: String!
          $assignmentId: ID!
        ) {
          setAssignmentSubmissionFeedback(
            userId: $userId
            problemId: $problemId
            mark: $mark
            comments: $comments
            assignmentId: $assignmentId
          ) {
            mark
            comments
          }
        }`,
        variables: {
          assignmentId: "1",
          problemId: "1",
          mark,
          comments: "Good Work!",
          userId: "2",
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
        setAssignmentSubmissionFeedback: {
          mark: mark,
          comments: "Good Work!",
        },
      },
    });
  });
  test("setAssignmentSubmissionFeedback with mark of 100", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const mark = 100;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation setAssignmentSubmissionFeedback(
          $userId: ID!
          $problemId: ID!
          $mark: Float!
          $comments: String!
          $assignmentId: ID!
        ) {
          setAssignmentSubmissionFeedback(
            userId: $userId
            problemId: $problemId
            mark: $mark
            comments: $comments
            assignmentId: $assignmentId
          ) {
            mark
            comments
          }
        }`,
        variables: {
          assignmentId: "1",
          problemId: "1",
          mark,
          comments: "Good Work!",
          userId: "2",
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
        setAssignmentSubmissionFeedback: {
          mark: mark,
          comments: "Good Work!",
        },
      },
    });
  });
  test("setAssignmentSubmissionFeedback with mark of -1", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const mark = -1;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation setAssignmentSubmissionFeedback(
          $userId: ID!
          $problemId: ID!
          $mark: Float!
          $comments: String!
          $assignmentId: ID!
        ) {
          setAssignmentSubmissionFeedback(
            userId: $userId
            problemId: $problemId
            mark: $mark
            comments: $comments
            assignmentId: $assignmentId
          ) {
            mark
            comments
          }
        }`,
        variables: {
          assignmentId: "1",
          problemId: "1",
          mark,
          comments: "Good Work!",
          userId: "2",
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
      "Mark is not valid. Must be between 0-100."
    );
  });
  test("setAssignmentSubmissionFeedback with mark of 101", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const mark = 101;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation setAssignmentSubmissionFeedback(
          $userId: ID!
          $problemId: ID!
          $mark: Float!
          $comments: String!
          $assignmentId: ID!
        ) {
          setAssignmentSubmissionFeedback(
            userId: $userId
            problemId: $problemId
            mark: $mark
            comments: $comments
            assignmentId: $assignmentId
          ) {
            mark
            comments
          }
        }`,
        variables: {
          assignmentId: "1",
          problemId: "1",
          mark,
          comments: "Good Work!",
          userId: "2",
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
      "Mark is not valid. Must be between 0-100."
    );
  });
  test("setAssignmentSubmissionFeedback for assignment user does not own", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation setAssignmentSubmissionFeedback(
          $userId: ID!
          $problemId: ID!
          $mark: Float!
          $comments: String!
          $assignmentId: ID!
        ) {
          setAssignmentSubmissionFeedback(
            userId: $userId
            problemId: $problemId
            mark: $mark
            comments: $comments
            assignmentId: $assignmentId
          ) {
            mark
            comments
          }
        }`,
        variables: {
          assignmentId: "4",
          problemId: "1",
          mark: 1,
          comments: "Good Work!",
          userId: "3",
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
      "You do not have permission to set the mark for this assignment submission."
    );
  });
  test("setAssignmentProblemSubmission with valid arguments", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation setAssignmentProblemSubmission(
          $assignmentId: ID!
          $submissionId: ID!
        ) {
          setAssignmentProblemSubmission(
            assignmentId: $assignmentId
            submissionId: $submissionId
          ) {
            assignment {
              id
            }
            submission {
              id
            }
            user {
              id
            }
            problem {
              id
            }
          }
        }`,
        variables: {
          assignmentId: "3",
          submissionId: "3",
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
        setAssignmentProblemSubmission: {
          assignment: {
            id: "3",
          },
          submission: {
            id: "3",
          },
          user: {
            id: "1",
          },
          problem: {
            id: "1",
          },
        },
      },
    });
  });
  test("setAssignmentProblemSubmission with invalid assignment id", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation setAssignmentProblemSubmission(
          $assignmentId: ID!
          $submissionId: ID!
        ) {
          setAssignmentProblemSubmission(
            assignmentId: $assignmentId
            submissionId: $submissionId
          ) {
            assignment {
              id
            }
            submission {
              id
            }
            user {
              id
            }
            problem {
              id
            }
          }
        }`,
        variables: {
          assignmentId: "-1",
          submissionId: "3",
        },
      },
      {
        headers: {
          Authorization: validUserAccessToken,
        },
      }
    );

    const { data } = response;

    expect(data.errors[0].message).toBe("This assignment does not exist.");
  });
  test("setAssignmentProblemSubmission with invalid submission id", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation setAssignmentProblemSubmission(
          $assignmentId: ID!
          $submissionId: ID!
        ) {
          setAssignmentProblemSubmission(
            assignmentId: $assignmentId
            submissionId: $submissionId
          ) {
            assignment {
              id
            }
            submission {
              id
            }
            user {
              id
            }
            problem {
              id
            }
          }
        }`,
        variables: {
          assignmentId: "3",
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

    expect(data.errors[0].message).toBe("Invalid submission.");
  });
  test("setAssignmentProblemSubmission for assignment user is not part of", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation setAssignmentProblemSubmission(
          $assignmentId: ID!
          $submissionId: ID!
        ) {
          setAssignmentProblemSubmission(
            assignmentId: $assignmentId
            submissionId: $submissionId
          ) {
            assignment {
              id
            }
            submission {
              id
            }
            user {
              id
            }
            problem {
              id
            }
          }
        }`,
        variables: {
          assignmentId: "4",
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

    expect(data.errors[0].message).toBe(
      "You are not a student for this assignment."
    );
  });
  test("removeAssignmentProblemSubmission with valid arguments", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation removeAssignmentProblemSubmission(
          $assignmentId: ID!
          $problemId: ID!
        ) {
          removeAssignmentProblemSubmission(
            assignmentId: $assignmentId
            problemId: $problemId
          )
        }`,
        variables: {
          assignmentId: "3",
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
        removeAssignmentProblemSubmission: true,
      },
    });
  });
  test("removeAssignmentProblemSubmission with for problem that is not solved", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation removeAssignmentProblemSubmission(
          $assignmentId: ID!
          $problemId: ID!
        ) {
          removeAssignmentProblemSubmission(
            assignmentId: $assignmentId
            problemId: $problemId
          )
        }`,
        variables: {
          assignmentId: "3",
          problemId: "2",
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
      "Could not delete your submission for this assignment problem. It might not exist."
    );
  });
  test("removeAssignmentProblemSubmission with assignment user is not in", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation removeAssignmentProblemSubmission(
          $assignmentId: ID!
          $problemId: ID!
        ) {
          removeAssignmentProblemSubmission(
            assignmentId: $assignmentId
            problemId: $problemId
          )
        }`,
        variables: {
          assignmentId: "1",
          problemId: "2",
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
      "Could not delete your submission for this assignment problem. It might not exist."
    );
  });
  test("getAssignmentExportData for assignment that user owns", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 4 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getAssignmentExportData($assignmentId: ID!) {
          getAssignmentExportData(assignmentId: $assignmentId) {
            userAssignmentSubmission {
              user {
                id
                username
                organisationId
              }
              assignmentSubmissions {
                problem {
                  id
                  specification {
                    title
                  }
                }
                submission {
                  id
                  code
                  language
                  avgTime
                  avgMemory
                  passed
                  userId
                }
                mark
                comments
              }
            }
            avgMark
            solves
            attempts
            numOfProblems
            comments
          }
        }`,
        variables: {
          assignmentId: "4",
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
        getAssignmentExportData: [
          {
            userAssignmentSubmission: {
              user: {
                id: "3",
                username: "cathy",
                organisationId: "cathy@school.ac.uk",
              },
              assignmentSubmissions: [
                {
                  problem: {
                    id: "1",
                    specification: {
                      title: "Addition",
                    },
                  },
                  submission: {
                    id: "1",
                    code: "random code",
                    language: 71,
                    avgTime: 3,
                    avgMemory: 3,
                    passed: false,
                    userId: "3",
                  },
                  mark: null,
                  comments: null,
                },
              ],
            },
            avgMark: 0,
            solves: 0,
            attempts: 1,
            numOfProblems: 1,
            comments: "Addition - null",
          },
        ],
      },
    });
  });
  test("getAssignmentExportData for assignment that user does not own", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getAssignmentExportData($assignmentId: ID!) {
          getAssignmentExportData(assignmentId: $assignmentId) {
            userAssignmentSubmission {
              user {
                id
              }
            }
          }
        }`,
        variables: {
          assignmentId: "4",
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
      "This user is the not the creator of this assignment."
    );
  });
  test("getAssignmentExportData for assignment that does not exist", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getAssignmentExportData($assignmentId: ID!) {
          getAssignmentExportData(assignmentId: $assignmentId) {
            userAssignmentSubmission {
              user {
                id
              }
            }
          }
        }`,
        variables: {
          assignmentId: "-1",
        },
      },
      {
        headers: {
          Authorization: validUserAccessToken,
        },
      }
    );

    const { data } = response;

    expect(data.errors[0].message).toBe("This assignment does not exist.");
  });
});
