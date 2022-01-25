import React, { createContext, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import { Tabs, Tab, TabList, TabPanels, TabPanel } from "@chakra-ui/react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import {
  Assignment,
  Classroom as ClassroomType,
  User,
} from "../../../../gql-types";
import CustomTable from "../../../../components/CustomTable/CustomTable";

const ClassroomContext = createContext<ClassroomType | any>({});

const GET_CLASSROOM = gql`
  query getClassroom($classroomId: ID!) {
    getClassroom(classroomId: $classroomId) {
      id
      password
      creator {
        username
      }
      createdAt
      users {
        id
        username
      }
      assignments {
        id
        setDate
        dueDate
        problems {
          id
          specification {
            title
          }
        }
      }
    }
  }
`;

const Classroom = () => {
  const { classroomId } = useParams();

  const [tabIndex, setTabIndex] = useState(0);

  const { loading, error, data } = useQuery(GET_CLASSROOM, {
    variables: {
      classroomId: classroomId,
    },
  });

  if (loading)
    return (
      <Center h="1000px">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Center>
    );
  // TODO have an actual error page and log this
  if (error) return <>Error! ${error.message}</>;

  const classroomData: ClassroomType = data.getClassroom;

  return (
    <ClassroomContext.Provider value={classroomData}>
      <Box mx={4}>
        <Link to={`/dashboard/classrooms`}>
          <Button my={4}>&lt;- All Classrooms</Button>
        </Link>

        <Heading>Classroom {classroomId}</Heading>
        <Heading size={"sm"}>Created: {new Date().toLocaleString()}</Heading>
        <Heading fontSize={"0.9em"}>
          {classroomData.password === ""
            ? "public"
            : "private (password required to join)"}
        </Heading>
        <Heading size={"sm"}>
          Owner: {`${classroomData.creator!.username}`}
        </Heading>

        <Center>
          <ButtonGroup>
            <Button>Set Assignment</Button>
            <Button>Copy Invite Link</Button>
            <Button colorScheme={"red"}>Delete Classroom</Button>
          </ButtonGroup>
        </Center>

        <Tabs
          index={tabIndex}
          onChange={(index) => {
            setTabIndex(index);
          }}
        >
          <TabList>
            <Tab>Students</Tab>
            <Tab>Assignments</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <CustomTable
                columns={[
                  {
                    Header: "Username",
                    accessor: "username",
                  },
                  {
                    Header: "Options",
                    accessor: "options",
                  },
                ]}
                data={classroomData.users.map((student: User, i: number) => {
                  return {
                    username: student.username,
                    options: (
                      <ButtonGroup>
                        <Link to={`/dashboard/classrooms/${1}`}>
                          <Button colorScheme={"blue"}>View</Button>
                        </Link>
                        <Button colorScheme={"blue"}>View Submissions</Button>
                        <Button colorScheme={"red"}>Remove</Button>
                      </ButtonGroup>
                    ),
                  };
                })}
              />
            </TabPanel>
            <TabPanel>
              <CustomTable
                columns={[
                  {
                    Header: "Assignment ID",
                    accessor: "assignmentId",
                  },
                  {
                    Header: "Set Date",
                    accessor: "setDate",
                  },
                  {
                    Header: "Due Date",
                    accessor: "dueDate",
                  },
                  {
                    Header: "Submissions",
                    accessor: "numberOfSubmissions",
                  },

                  {
                    Header: "Options",
                    accessor: "options",
                  },
                ]}
                data={classroomData.assignments.map(
                  (assignment: Assignment, i: number) => {
                    return {
                      assignmentId: assignment.id,
                      setDate: new Date(
                        parseInt(assignment.setDate)
                      ).toLocaleString(),
                      dueDate: new Date(
                        parseInt(assignment.dueDate)
                      ).toLocaleString(),
                      numberOfSubmissions: assignment.submissions
                        ? assignment.submissions.length
                        : 0,
                      options: (
                        <ButtonGroup>
                          <Link to={`/dashboard/classrooms/${1}`}>
                            <Button colorScheme={"blue"}>View</Button>
                          </Link>
                          <Button colorScheme={"blue"}>View Submissions</Button>
                          <Button colorScheme={"red"}>Remove</Button>
                        </ButtonGroup>
                      ),
                    };
                  }
                )}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </ClassroomContext.Provider>
  );
};

export { Classroom, ClassroomContext };
