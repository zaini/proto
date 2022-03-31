import { MockedProvider } from "@apollo/client/testing";
import { act, cleanup, render, screen } from "@testing-library/react";
import { Routes, Route, MemoryRouter } from "react-router-dom";
import wait from "waait";
import "@testing-library/jest-dom/extend-expect";
import { AuthContext } from "../../../context/Auth";
import Classrooms from "./Classrooms";
import {
  GET_CLASSROOMS as GET_TEACHER_CLASSROOMS,
  CREATE_CLASSROOM,
} from "./TeacherClassrooms";
import { GET_CLASSROOMS as GET_LEARNER_CLASSROOMS } from "./LearnerClassrooms";

const getTeacherClassroomsMock = {
  request: {
    query: GET_TEACHER_CLASSROOMS,
  },
  result: {
    data: {
      getTeacherClassrooms: [
        {
          id: "3",
          name: "Classroom Test",
          password: "",
          createdAt: "1648758573847",
          users: [
            {
              id: "3",
            },
          ],
        },
        {
          id: "4",
          name: "Classroom Test 2",
          password:
            "$argon2i$v=19$m=4096,t=3,p=1$0BqxRY3KilD0lY9J6t/izQ$zIo+B+7dCwCX+UyHra4umupMbE9fM8PMOY2b2iZ/LJc",
          createdAt: "1648758573847",
          users: [],
        },
      ],
    },
  },
};

const getLearnerClassroomsMock = {
  request: {
    query: GET_LEARNER_CLASSROOMS,
  },
  result: {
    data: {
      getLearnerClassrooms: [
        {
          id: "1",
          name: "Classroom A",
        },
      ],
    },
  },
};

const createClassroomMock = {
  request: {
    query: CREATE_CLASSROOM,
    variables: {
      classroomName: "Test",
      password: "pass",
    },
  },
  result: {
    data: {
      createClassroom: {
        id: "6",
        name: "Test",
      },
    },
  },
};

afterEach(cleanup);

const classroomsSetup = async (context: any = {}) => {
  act(() => {
    render(
      <AuthContext.Provider value={context}>
        <MockedProvider
          addTypename={false}
          mocks={[
            getTeacherClassroomsMock,
            getLearnerClassroomsMock,
            createClassroomMock,
          ]}
        >
          <MemoryRouter initialEntries={["/dashboard/classrooms"]}>
            <Routes>
              <Route path="/dashboard/classrooms" element={<Classrooms />} />
            </Routes>
          </MemoryRouter>
        </MockedProvider>
      </AuthContext.Provider>
    );
  });
};

describe("classrooms", () => {
  // beforeEach(async () => {
  //   Object.defineProperty(window, "matchMedia", {
  //     writable: true,
  //     value: jest.fn().mockImplementation((query) => ({
  //       matches: false,
  //       media: query,
  //       onchange: null,
  //       addListener: jest.fn(), // Deprecated
  //       removeListener: jest.fn(), // Deprecated
  //       addEventListener: jest.fn(),
  //       removeEventListener: jest.fn(),
  //       dispatchEvent: jest.fn(),
  //     })),
  //   });
  // });
  it("should render without crashing", () => {
    expect(classroomsSetup).toBeTruthy();
  });
  it("show create new classroom button to get started when logged in as teacher", async () => {
    classroomsSetup({ accountType: "teacher", user: { id: 1 } });
    await act(async () => await wait(0));
    expect(screen.getByTestId("create-new-classroom")).toBeTruthy();
    expect(screen.getByTestId("create-new-classroom")).toHaveTextContent(
      "Create Classroom"
    );
  });
  it("doesn't show create new classroom button to get started when logged in as student", async () => {
    classroomsSetup({ accountType: "student", user: { id: 1 } });
    await act(async () => await wait(0));
    expect(screen.queryByTestId("create-new-classroom")).toBeNull();
  });
  it("shows Classrooms in heading", async () => {
    classroomsSetup();
    await act(async () => await wait(0));
    expect(screen.getByText("Classrooms")).toBeTruthy();
  });
});
