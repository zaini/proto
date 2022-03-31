import { MockedProvider } from "@apollo/client/testing";
import { act, cleanup, render, screen } from "@testing-library/react";
import { Routes, Route, MemoryRouter } from "react-router-dom";
import wait from "waait";
import "@testing-library/jest-dom/extend-expect";
import { AuthContext } from "../../../context/Auth";
import Logout from "./Logout";

afterEach(cleanup);

const logoutSetup = async () => {
  act(() => {
    render(
      <AuthContext.Provider value={{ logout: () => {} } as any}>
        <MockedProvider addTypename={false} mocks={[]}>
          <MemoryRouter initialEntries={["/logout"]}>
            <Routes>
              <Route path="/logout" element={<Logout />} />
            </Routes>
          </MemoryRouter>
        </MockedProvider>
      </AuthContext.Provider>
    );
  });
};

describe("logout", () => {
  it("should render without crashing", () => {
    expect(logoutSetup).toBeTruthy();
  });
  it("shows logout in heading", async () => {
    logoutSetup();
    await act(async () => await wait(0));
    expect(screen.getByTestId("logout-heading")).toHaveTextContent("Logout");
  });
});
