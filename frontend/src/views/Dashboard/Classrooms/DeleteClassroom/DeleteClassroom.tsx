import React, { useContext, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Stack,
  Code,
  Input,
} from "@chakra-ui/react";
import { ClassroomContext } from "../Classroom/Classroom";
import { Classroom } from "../../../../gql-types";

const DeleteClassroom = ({ isOpen, onClose, deleteClassroom }: any) => {
  const [classroomName, setClassroomName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { classroom: x } = useContext(ClassroomContext);
  const classroom: Classroom = x;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Classroom</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <InputGroup>
              <InputLeftAddon children="Classroom Name" />
              <Input
                type="text"
                placeholder={classroom.name}
                onChange={(e) => setClassroomName(e.target.value)}
              />
            </InputGroup>
            {classroom.password && (
              <InputGroup>
                <InputLeftAddon children="Password" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="(required)"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            )}
            <Code fontWeight={"bold"} p={2}>
              WARNING: Deleting a classroom is NOT reversible.
            </Code>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="red"
            mr={3}
            onClick={() => {
              deleteClassroom({
                variables: {
                  classroomId: classroom.id,
                  classroomName: classroomName,
                  password: password,
                },
              });
            }}
          >
            Delete
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteClassroom;
