import axios from "axios";
import { createAccessToken } from "../utils/tokens";

const GRAPHQL_BACKEND_URL = "http://localhost:5000/graphql";

describe("classrooms resolvers", () => {
  test("getTeacherClassrooms with one new classroom", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const classroomResponse = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation createClassroom($classroomName: String!, $password: String) {
          createClassroom(classroomName: $classroomName, password: $password) {
            id
            name
          }
        }`,
        variables: {
          classroomName: "New Test Classroom",
        },
      },
      {
        headers: {
          Authorization: validUserAccessToken,
        },
      }
    );

    const { data: classrooMData } = classroomResponse;

    expect(classrooMData).toMatchObject({
      data: {
        createClassroom: {
          id: "6",
          name: "New Test Classroom",
        },
      },
    });

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getTeacherClassrooms {
          getTeacherClassrooms {
            id
            name
            users {
              id
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
        getTeacherClassrooms: [
          {
            id: "1",
            name: "Classroom A",
            users: [
              {
                id: "2",
              },
              {
                id: "3",
              },
            ],
          },
          {
            id: "5",
            name: "Test Classroom",
            users: [],
          },
          {
            id: "6",
            name: "New Test Classroom",
            users: [],
          },
        ],
      },
    });
  });
  test("getLearnerClassrooms with after joining classroom", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const classroomResponse = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation joinClassroom($classroomId: ID!, $password: String) {
          joinClassroom(classroomId: $classroomId, password: $password) {
            id
          }
        }`,
        variables: {
          classroomId: "3",
        },
      },
      {
        headers: {
          Authorization: validUserAccessToken,
        },
      }
    );

    const { data: classrooMData } = classroomResponse;

    expect(classrooMData).toMatchObject({
      data: {
        joinClassroom: {
          id: "3",
        },
      },
    });

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getLearnerClassrooms {
          getLearnerClassrooms {
            id
            name
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
        getLearnerClassrooms: [
          {
            id: "2",
            name: "Classroom B",
          },
          {
            id: "3",
            name: "Classroom Test",
          },
        ],
      },
    });
  });
  test("getClassroom for valid classroom id", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getClassroom($classroomId: ID!) {
          getClassroom(classroomId: $classroomId) {
            id
            name
            password
            creator {
              username
            }
          }
        }`,
        variables: {
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
        getClassroom: {
          id: "1",
          name: "Classroom A",
          password: "",
          creator: {
            username: "ali",
          },
        },
      },
    });
  });
  test("getClassroom for invalid classroom id", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getClassroom($classroomId: ID!) {
          getClassroom(classroomId: $classroomId) {
            id
            name
            password
            creator {
              username
            }
          }
        }`,
        variables: {
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

    expect(data.errors[0].message).toBe("This classroom does not exist.");
  });
  test("createClassroom with unique name and password", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation createClassroom($classroomName: String!, $password: String) {
          createClassroom(classroomName: $classroomName, password: $password) {
            id
            name
            password
          }
        }`,
        variables: {
          classroomName: "New Test Classroom",
          password: "password123",
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
        createClassroom: {
          id: "6",
          name: "New Test Classroom",
        },
      },
    });

    // Checking password field is not empty
    expect(data.data.createClassroom).toHaveProperty("password");
    expect(data.data.createClassroom.password.length).toBeGreaterThanOrEqual(1);
  });
  test("createClassroom with unique name and no password", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation createClassroom($classroomName: String!, $password: String) {
          createClassroom(classroomName: $classroomName, password: $password) {
            id
            name
            password
          }
        }`,
        variables: {
          classroomName: "New Test Classroom",
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
        createClassroom: {
          id: "6",
          name: "New Test Classroom",
          password: "",
        },
      },
    });
  });
  test("createClassroom twice with same name", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation createClassroom($classroomName: String!, $password: String) {
          createClassroom(classroomName: $classroomName, password: $password) {
            id
            name
            password
          }
        }`,
        variables: {
          classroomName: "New Test Classroom",
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
        createClassroom: {
          id: "6",
          name: "New Test Classroom",
          password: "",
        },
      },
    });

    const response2 = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation createClassroom($classroomName: String!, $password: String) {
          createClassroom(classroomName: $classroomName, password: $password) {
            id
            name
            password
          }
        }`,
        variables: {
          classroomName: "New Test Classroom",
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
      "Cannot create classroom as you already have a classroom with the same name."
    );
  });
  test("createClassroom with empty name", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation createClassroom($classroomName: String!, $password: String) {
          createClassroom(classroomName: $classroomName, password: $password) {
            id
            name
            password
          }
        }`,
        variables: {
          classroomName: "",
        },
      },
      {
        headers: {
          Authorization: validUserAccessToken,
        },
      }
    );

    const { data } = response;

    expect(data.errors[0].message).toBe("Classroom name cannot be empty.");
  });
  test("joinClassroom with valid classroom id", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation joinClassroom($classroomId: ID!, $password: String) {
          joinClassroom(classroomId: $classroomId, password: $password) {
            id
          }
        }`,
        variables: {
          classroomId: "3",
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
        joinClassroom: {
          id: "3",
        },
      },
    });
  });
  test("joinClassroom with valid classroom id and valid password", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation joinClassroom($classroomId: ID!, $password: String) {
          joinClassroom(classroomId: $classroomId, password: $password) {
            id
          }
        }`,
        variables: {
          classroomId: "4",
          password: "password123",
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
        joinClassroom: {
          id: "4",
        },
      },
    });
  });
  test("joinClassroom with valid classroom id and invalid password", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation joinClassroom($classroomId: ID!, $password: String) {
          joinClassroom(classroomId: $classroomId, password: $password) {
            id
          }
        }`,
        variables: {
          classroomId: "4",
          password: "wrong password",
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
      "Cannot join classroom due to invalid password."
    );
  });
  test("joinClassroom with valid classroom id and no password when it should be required", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation joinClassroom($classroomId: ID!, $password: String) {
          joinClassroom(classroomId: $classroomId, password: $password) {
            id
          }
        }`,
        variables: {
          classroomId: "4",
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
      "Cannot join classroom due to invalid password."
    );
  });
  test("joinClassroom with valid classroom id twice", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation joinClassroom($classroomId: ID!, $password: String) {
          joinClassroom(classroomId: $classroomId, password: $password) {
            id
          }
        }`,
        variables: {
          classroomId: "3",
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
        joinClassroom: {
          id: "3",
        },
      },
    });

    const response2 = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation joinClassroom($classroomId: ID!, $password: String) {
          joinClassroom(classroomId: $classroomId, password: $password) {
            id
          }
        }`,
        variables: {
          classroomId: "3",
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
      "You are already a member of this classroom."
    );
  });
  test("joinClassroom with invalid classroom id", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation joinClassroom($classroomId: ID!, $password: String) {
          joinClassroom(classroomId: $classroomId, password: $password) {
            id
          }
        }`,
        variables: {
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
      "Failed to find classroom you are attempting to join."
    );
  });
  test("joinClassroom for classroom you own", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation joinClassroom($classroomId: ID!, $password: String) {
          joinClassroom(classroomId: $classroomId, password: $password) {
            id
          }
        }`,
        variables: {
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
      "You cannot join a classroom as you are its creator."
    );
  });
  test("deleteClassroom with valid args", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation DeleteClassroom(
          $classroomId: ID!
          $classroomName: String!
          $password: String
        ) {
          deleteClassroom(
            classroomId: $classroomId
            classroomName: $classroomName
            password: $password
          )
        }`,
        variables: {
          classroomId: "1",
          classroomName: "Classroom A",
          password: "",
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
        deleteClassroom: true,
      },
    });

    // Check if classroom exists
    const classroomResponse = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getClassroom($classroomId: ID!) {
          getClassroom(classroomId: $classroomId) {
            id
          }
        }`,
        variables: {
          classroomId: "1",
        },
      },
      {
        headers: {
          Authorization: validUserAccessToken,
        },
      }
    );

    const { data: classroomData } = classroomResponse;

    expect(classroomData.errors[0].message).toBe(
      "This classroom does not exist."
    );
  });
  test("deleteClassroom with wrong classroom name", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation DeleteClassroom(
          $classroomId: ID!
          $classroomName: String!
          $password: String
        ) {
          deleteClassroom(
            classroomId: $classroomId
            classroomName: $classroomName
            password: $password
          )
        }`,
        variables: {
          classroomId: "1",
          classroomName: "WRONG NAME",
          password: "",
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
      "Failed to delete classroom as the name you entered is not correct."
    );
  });
  test("deleteClassroom with wrong password", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation DeleteClassroom(
          $classroomId: ID!
          $classroomName: String!
          $password: String
        ) {
          deleteClassroom(
            classroomId: $classroomId
            classroomName: $classroomName
            password: $password
          )
        }`,
        variables: {
          classroomId: "5",
          classroomName: "Classroom A",
          password: "WRONG PASSWORD",
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
      "Cannot delete classroom due to invalid password."
    );
  });
  test("deleteClassroom with correct password", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation DeleteClassroom(
          $classroomId: ID!
          $classroomName: String!
          $password: String
        ) {
          deleteClassroom(
            classroomId: $classroomId
            classroomName: $classroomName
            password: $password
          )
        }`,
        variables: {
          classroomId: "5",
          classroomName: "Test Classroom",
          password: "password123",
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
        deleteClassroom: true,
      },
    });

    // Check if classroom exists
    const classroomResponse = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getClassroom($classroomId: ID!) {
              getClassroom(classroomId: $classroomId) {
                id
              }
            }`,
        variables: {
          classroomId: "5",
        },
      },
      {
        headers: {
          Authorization: validUserAccessToken,
        },
      }
    );

    const { data: classroomData } = classroomResponse;

    expect(classroomData.errors[0].message).toBe(
      "This classroom does not exist."
    );
  });
  test("deleteClassroom with invalid classroom id", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation DeleteClassroom(
          $classroomId: ID!
          $classroomName: String!
          $password: String
        ) {
          deleteClassroom(
            classroomId: $classroomId
            classroomName: $classroomName
            password: $password
          )
        }`,
        variables: {
          classroomId: "-1",
          classroomName: "Test Classroom",
          password: "password123",
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
      "Failed to find classroom you are attempting to delete."
    );
  });
  test("deleteClassroom with user is not the creator for", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation DeleteClassroom(
          $classroomId: ID!
          $classroomName: String!
          $password: String
        ) {
          deleteClassroom(
            classroomId: $classroomId
            classroomName: $classroomName
            password: $password
          )
        }`,
        variables: {
          classroomId: "3",
          classroomName: "Classroom Test",
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
      "Failed to find classroom you are attempting to delete."
    );
  });
  test("removeStudent with valid arguments for classroom user owns", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation removeStudent($studentId: ID!, $classroomId: ID!) {
          removeStudent(studentId: $studentId, classroomId: $classroomId)
        }`,
        variables: {
          classroomId: "1",
          studentId: "2",
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
        removeStudent: true,
      },
    });
  });
  test("removeStudent with valid arguments for classroom user is a student in", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation removeStudent($studentId: ID!, $classroomId: ID!) {
          removeStudent(studentId: $studentId, classroomId: $classroomId)
        }`,
        variables: {
          classroomId: "2",
          studentId: "1",
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
        removeStudent: true,
      },
    });
  });
  test("removeStudent from non existant classroom id", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation removeStudent($studentId: ID!, $classroomId: ID!) {
          removeStudent(studentId: $studentId, classroomId: $classroomId)
        }`,
        variables: {
          classroomId: "-1",
          studentId: "2",
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
      "Failed to find classroom you are attempting to remove student from."
    );
  });
  test("removeStudent from classroom which user does not own and is not themselves", async () => {
    const validUserAccessToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation removeStudent($studentId: ID!, $classroomId: ID!) {
          removeStudent(studentId: $studentId, classroomId: $classroomId)
        }`,
        variables: {
          classroomId: "2",
          studentId: "3",
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
      "You do not have permission to remove this student from this classroom."
    );
  });
});
