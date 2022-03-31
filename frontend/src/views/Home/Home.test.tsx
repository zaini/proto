import { MockedProvider } from "@apollo/client/testing";
import { act, cleanup, render, screen } from "@testing-library/react";
import { Routes, Route, MemoryRouter } from "react-router-dom";
import wait from "waait";
import "@testing-library/jest-dom/extend-expect";
import { AuthContext } from "../../context/Auth";
import Home from "./Home";

afterEach(cleanup);

const homeSetup = async (user: {} | null = {}) => {
  act(() => {
    render(
      <AuthContext.Provider value={{ user } as any}>
        <MockedProvider addTypename={false} mocks={[]}>
          <MemoryRouter initialEntries={["/"]}>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </MemoryRouter>
        </MockedProvider>
      </AuthContext.Provider>
    );
  });
};

describe("home", () => {
  beforeEach(async () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });
  it("should render without crashing", () => {
    expect(homeSetup).toBeTruthy();
  });
  it("shows button to dashboard when logged in", async () => {
    homeSetup();
    await act(async () => await wait(0));
    expect(screen.getByTestId("dashboard-button")).toBeTruthy();
    expect(screen.getByTestId("dashboard-button")).toHaveTextContent(
      "Dashboard"
    );
  });
  it("shows button to get started when not logged in", async () => {
    homeSetup(null);
    await act(async () => await wait(0));
    expect(screen.getByTestId("get-started-button")).toBeTruthy();
    expect(screen.getByTestId("get-started-button")).toHaveTextContent(
      "Get Started Now"
    );
  });
  it("shows proto in heading", async () => {
    homeSetup();
    await act(async () => await wait(0));
    expect(screen.getByTestId("home-heading")).toHaveTextContent("Proto");
  });
});
