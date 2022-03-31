import { MockedProvider } from "@apollo/client/testing";
import { act, cleanup, render, screen } from "@testing-library/react";
import { Routes, Route, MemoryRouter } from "react-router-dom";
import wait from "waait";
import "@testing-library/jest-dom/extend-expect";
import { AuthContext } from "../../../context/Auth";
import Login from "./Login";

afterEach(cleanup);

const loginSetup = async () => {
  act(() => {
    render(
      <AuthContext.Provider value={{ logout: () => {} } as any}>
        <MockedProvider addTypename={false} mocks={[]}>
          <MemoryRouter initialEntries={["/login"]}>
            <Routes>
              <Route path="/login" element={<Login />} />
            </Routes>
          </MemoryRouter>
        </MockedProvider>
      </AuthContext.Provider>
    );
  });
};

describe("login", () => {
  it("should render without crashing", () => {
    expect(loginSetup).toBeTruthy();
  });
  it("shows login with github button", async () => {
    loginSetup();
    await act(async () => await wait(0));
    expect(screen.getByTestId("login-button")).toHaveTextContent(
      "Login with GitHub"
    );
  });
});
