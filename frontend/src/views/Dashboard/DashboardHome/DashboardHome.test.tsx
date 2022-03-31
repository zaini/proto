import { MockedProvider } from "@apollo/client/testing";
import { act, cleanup, render, screen } from "@testing-library/react";
import { Routes, Route, MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import wait from "waait";
import { AuthContext } from "../../../context/Auth";
import DashboardHome from "./DashboardHome";

afterEach(cleanup);

const dashboardHomeSetup = async () => {
  act(() => {
    render(
      <AuthContext.Provider value={{ user: {} } as any}>
        <MockedProvider addTypename={false} mocks={[]}>
          <MemoryRouter initialEntries={["/dashboard"]}>
            <Routes>
              <Route path="/dashboard" element={<DashboardHome />} />
            </Routes>
          </MemoryRouter>
        </MockedProvider>
      </AuthContext.Provider>
    );
  });
};

describe("dashboard home", () => {
  it("should render without crashing", () => {
    expect(dashboardHomeSetup).toBeTruthy();
  });
  it("shows new problem button", async () => {
    dashboardHomeSetup();
    await act(async () => await wait(0));
    expect(screen.getByTestId("new-problem-button")).toHaveTextContent(
      "+ Create New Problem"
    );
  });
});
