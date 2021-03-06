import axios from "axios";
import { createAccessToken } from "../../utils/tokens";

const GRAPHQL_BACKEND_URL = "http://localhost:5000/graphql";

describe("users resolvers", () => {
  test("getUser that exists", async () => {
    const response = await axios.post(GRAPHQL_BACKEND_URL, {
      query: `query getUser($userId: ID!) {
                getUser(userId: $userId) {
                  id
                  username
                  githubId
                  problems {
                    id
                    rating {
                      numberOfRatings
                      totalRating
                    }
                    specification {
                      difficulty
                      title
                    }
                  }
                  recentSubmissions {
                    id
                    passed
                    avgTime
                    avgMemory
                    language
                    problem {
                      id
                      specification {
                        title
                      }
                    }
                  }
                }
              }`,
      variables: {
        userId: "1",
      },
    });

    const { data } = response;

    expect(data).toMatchObject({
      data: {
        getUser: {
          id: "1",
          username: "ali",
          githubId: "11",
          problems: [
            {
              id: "1",
              rating: {
                numberOfRatings: 3,
                totalRating: 8,
              },
              specification: {
                difficulty: "EASY",
                title: "Addition",
              },
            },
            {
              id: "2",
              rating: {
                numberOfRatings: 0,
                totalRating: 0,
              },
              specification: {
                difficulty: "EASY",
                title: "Subtraction",
              },
            },
            {
              id: "3",
              rating: {
                numberOfRatings: 0,
                totalRating: 0,
              },
              specification: {
                difficulty: "EASY",
                title: "Double Word",
              },
            },
          ],
          recentSubmissions: [
            {
              id: "3",
              passed: false,
              avgTime: 3,
              avgMemory: 3,
              language: 71,
              problem: {
                id: "1",
                specification: {
                  title: "Addition",
                },
              },
            },
          ],
        },
      },
    });
  });
  test("getUser that does not exist", async () => {
    const response = await axios.post(GRAPHQL_BACKEND_URL, {
      query: `
            query getUser($userId: ID!) {
                getUser(userId: $userId) {
                  id
                  username
                  githubId
                  problems {
                    id
                    rating {
                      numberOfRatings
                      totalRating
                    }
                    specification {
                      difficulty
                      title
                    }
                  }
                  recentSubmissions {
                    id
                    passed
                    avgTime
                    avgMemory
                    language
                    problem {
                      id
                      specification {
                        title
                      }
                    }
                  }
                }
              }`,
      variables: {
        userId: "100",
      },
    });

    const { data } = response;

    expect(data.errors[0].message).toBe("This user does not exist.");
  });
  test("isLoggedIn with valid auth headers", async () => {
    const userResponse = await axios.post(GRAPHQL_BACKEND_URL, {
      query: `
      query getUser($userId: ID!) {
        getUser(userId: $userId) {
          id
        }
      }
      `,
      variables: {
        userId: "1",
      },
    });

    const { data: userData } = userResponse;

    expect(userData).toMatchObject({
      data: {
        getUser: {
          id: "1",
        },
      },
    });

    const userObj = userData.data.getUser;

    const userToken = `Bearer ${createAccessToken(userObj)}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `
      query Query {
        isLoggedIn
      }`,
      },
      {
        headers: {
          Authorization: userToken,
        },
      }
    );

    const { data } = response;

    expect(data.data).toHaveProperty("isLoggedIn");

    const user = JSON.parse(data.data.isLoggedIn);

    expect(user.id).toBe(userObj.id);
  });
  test("isLoggedIn with no auth headers", async () => {
    const response = await axios.post(GRAPHQL_BACKEND_URL, {
      query: `
      query Query {
        isLoggedIn
      }`,
    });

    const { data } = response;

    expect(data).toMatchObject({
      data: {
        isLoggedIn: "false",
      },
    });
  });
  test("isLoggedIn with invalid auth headers", async () => {
    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `
      query Query {
        isLoggedIn
      }`,
      },
      {
        headers: {
          Authorization: "something invalid",
        },
      }
    );

    const { data } = response;

    expect(data.errors[0].message).toBe("Invalid Login Token");
  });
  test("deleteUser existing user with valid username and valid access token", async () => {
    const userToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `
      mutation DeleteUser($userId: ID!, $username: String!) {
        deleteUser(userId: $userId, username: $username)
      }      
      `,
        variables: {
          userId: "1",
          username: "ali",
        },
      },
      {
        headers: {
          Authorization: userToken,
        },
      }
    );

    const { data } = response;

    expect(data).toMatchObject({
      data: {
        deleteUser: true,
      },
    });
  });
  test("deleteUser existing user with valid username and invalid access token", async () => {
    const userToken = `Bearer INVALID`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `
      mutation DeleteUser($userId: ID!, $username: String!) {
        deleteUser(userId: $userId, username: $username)
      }      
      `,
        variables: {
          userId: "1",
          username: "ali",
        },
      },
      {
        headers: {
          Authorization: userToken,
        },
      }
    );

    const { data } = response;

    expect(data.errors[0].message).toBe("Invalid Login Token");
  });
  test("deleteUser existing user with invalid username and valid access token", async () => {
    const userToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `
      mutation DeleteUser($userId: ID!, $username: String!) {
        deleteUser(userId: $userId, username: $username)
      }      
      `,
        variables: {
          userId: "1",
          username: "wrong user name",
        },
      },
      {
        headers: {
          Authorization: userToken,
        },
      }
    );

    const { data } = response;

    expect(data.errors[0].message).toBe("Failed to delete user.");
  });
  test("deleteUser existing user with invalid username and invalid access token", async () => {
    const userToken = `Bearer INVALID`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `
      mutation DeleteUser($userId: ID!, $username: String!) {
        deleteUser(userId: $userId, username: $username)
      }      
      `,
        variables: {
          userId: "1",
          username: "wrong user name",
        },
      },
      {
        headers: {
          Authorization: userToken,
        },
      }
    );

    const { data } = response;

    expect(data.errors[0].message).toBe("Invalid Login Token");
  });
  test("setOrganisationId with new non-empty token", async () => {
    const userToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation setOrganisationId($organisationId: String!) {
          setOrganisationId(organisationId: $organisationId)
        }`,
        variables: {
          organisationId: "k123",
        },
      },
      {
        headers: {
          Authorization: userToken,
        },
      }
    );

    const { data } = response;

    expect(data).toMatchObject({
      data: {
        setOrganisationId: true,
      },
    });

    const userResponse = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getUser($userId: ID!) {
          getUser(userId: $userId) {
            id
            organisationId
          }
        }`,
        variables: {
          userId: "1",
        },
      },
      {
        headers: {
          Authorization: userToken,
        },
      }
    );

    const { data: userData } = userResponse;

    expect(userData).toMatchObject({
      data: {
        getUser: {
          id: "1",
          organisationId: "k123",
        },
      },
    });
  });
  test("setOrganisationId with new empty token", async () => {
    const userToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation setOrganisationId($organisationId: String!) {
          setOrganisationId(organisationId: $organisationId)
        }`,
        variables: {
          organisationId: "",
        },
      },
      {
        headers: {
          Authorization: userToken,
        },
      }
    );

    const { data } = response;

    expect(data).toMatchObject({
      data: {
        setOrganisationId: true,
      },
    });

    const userResponse = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getUser($userId: ID!) {
          getUser(userId: $userId) {
            id
            organisationId
          }
        }`,
        variables: {
          userId: "1",
        },
      },
      {
        headers: {
          Authorization: userToken,
        },
      }
    );

    const { data: userData } = userResponse;

    expect(userData).toMatchObject({
      data: {
        getUser: {
          id: "1",
          organisationId: null,
        },
      },
    });
  });
  test("setOrganisationId with non-unique, taken token", async () => {
    const userToken = `Bearer ${createAccessToken({ id: 1 })}`;

    const response = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `mutation setOrganisationId($organisationId: String!) {
          setOrganisationId(organisationId: $organisationId)
        }`,
        variables: {
          organisationId: "bob@school.ac.uk",
        },
      },
      {
        headers: {
          Authorization: userToken,
        },
      }
    );

    const { data } = response;

    expect(data.errors[0].message).toBe(
      "Failed to set users unique organisation ID. It may be taken."
    );

    const userResponse = await axios.post(
      GRAPHQL_BACKEND_URL,
      {
        query: `query getUser($userId: ID!) {
          getUser(userId: $userId) {
            id
            organisationId
          }
        }`,
        variables: {
          userId: "1",
        },
      },
      {
        headers: {
          Authorization: userToken,
        },
      }
    );

    const { data: userData } = userResponse;

    expect(userData).toMatchObject({
      data: {
        getUser: {
          id: "1",
          organisationId: "123",
        },
      },
    });
  });
});
