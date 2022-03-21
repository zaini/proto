import axios from "axios";

const GRAPHQL_BACKEND_URL = "http://localhost:5000/graphql";

describe("users resolvers", () => {
  test("getUser", async () => {
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
          recentSubmissions: [],
        },
      },
    });
  });
});
