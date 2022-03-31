import Profile, { GET_USER } from "./Profile";
import { MockedProvider } from "@apollo/client/testing";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { Routes, Route, MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import wait from "waait";
import { AuthContext } from "../../context/Auth";

const getUserMockLoggedIn = {
  request: {
    query: GET_USER,
    variables: {
      userId: "1",
    },
  },
  result: {
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
            createdAt: "1648210151610",
            problem: {
              id: "1",
              specification: {
                title: "Addition",
              },
            },
          },
        ],
        createdAt: "1648210151566",
      },
    },
  },
};

afterEach(cleanup);

const profileSetup = async () => {
  act(() => {
    render(
      <AuthContext.Provider value={{ user: {} } as any}>
        <MockedProvider addTypename={false} mocks={[getUserMockLoggedIn]}>
          <MemoryRouter initialEntries={["/profile/1"]}>
            <Routes>
              <Route path="/profile/:userId" element={<Profile />} />
            </Routes>
          </MemoryRouter>
        </MockedProvider>
      </AuthContext.Provider>
    );
  });
};

describe("profile", () => {
  it("should render without crashing", () => {
    expect(profileSetup).toBeTruthy();
  });
  it("spinner shows on page load", () => {
    profileSetup();
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });
  it("shows profile information", async () => {
    profileSetup();
    await act(async () => await wait(0));
    expect(screen.getByTestId("username")).toHaveTextContent("ali");
  });
});
