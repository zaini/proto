import { MockedProvider } from "@apollo/client/testing";
import { act, cleanup, render, screen } from "@testing-library/react";
import { Routes, Route, MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import wait from "waait";
import { AuthContext } from "../../context/Auth";
import NotFound from "./NotFound";

afterEach(cleanup);

const notFoundSetup = async () => {
  act(() => {
    render(
      <AuthContext.Provider value={{ user: {} } as any}>
        <MockedProvider addTypename={false}>
          <MemoryRouter initialEntries={["/invalidroute"]}>
            <Routes>
              <Route path="/invalidroute" element={<NotFound />} />
            </Routes>
          </MemoryRouter>
        </MockedProvider>
      </AuthContext.Provider>
    );
  });
};

describe("not found", () => {
  it("should render without crashing", () => {
    expect(notFoundSetup).toBeTruthy();
  });
  it("shows page not found message", async () => {
    notFoundSetup();
    await act(async () => await wait(0));
    expect(screen.getByTestId("page-not-found")).toHaveTextContent(
      "Page Not Found"
    );
  });
});
