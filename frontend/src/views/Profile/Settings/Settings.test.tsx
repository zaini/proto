import { MockedProvider } from "@apollo/client/testing";
import { act, cleanup, render, screen } from "@testing-library/react";
import { Routes, Route, MemoryRouter } from "react-router-dom";
import wait from "waait";
import Settings, { SET_ORGANISATION_ID } from "./Settings";
import "@testing-library/jest-dom/extend-expect";
import { AuthContext } from "../../../context/Auth";

const setOrgansiationIdMock = {
  request: {
    query: SET_ORGANISATION_ID,
    variables: {
      organisationId: "k123",
    },
  },
  result: {},
};

afterEach(cleanup);

const settingsSetup = async () => {
  act(() => {
    render(
      <AuthContext.Provider value={{ user: { organisationId: "123" } } as any}>
        <MockedProvider addTypename={false} mocks={[setOrgansiationIdMock]}>
          <MemoryRouter initialEntries={["/profile/settings"]}>
            <Routes>
              <Route path="/profile/settings" element={<Settings />} />
            </Routes>
          </MemoryRouter>
        </MockedProvider>
      </AuthContext.Provider>
    );
  });
};

describe("profile settings", () => {
  it("should render without crashing", () => {
    expect(settingsSetup).toBeTruthy();
  });
  it("shows account settings header", async () => {
    settingsSetup();
    await act(async () => await wait(0));
    expect(screen.getByTestId("account-settings")).toHaveTextContent(
      "Account Settings"
    );
  });
  it("shows users organisation id", async () => {
    settingsSetup();
    await act(async () => await wait(0));
    expect(screen.getByTestId("organisation-id")).toHaveValue("123");
  });
});
