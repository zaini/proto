import React, { useState } from "react";
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

const CreateClassroom = ({ isOpen, onClose, createClassroom }: any) => {
  const [classroomName, setClassroomName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Classroom</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <InputGroup>
              <InputLeftAddon children="Name" />
              <Input
                type="text"
                placeholder="FC2 Class A"
                onChange={(e) => setClassroomName(e.target.value)}
              />
            </InputGroup>
            <InputGroup>
              <InputLeftAddon children="Password" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="(optional)"
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
            <Code fontWeight={"bold"} p={2}>
              Leave the password blank if you want anyone to be able to join. If
              you include a password, it will be required for people to join.
            </Code>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => {
              createClassroom({
                variables: {
                  classroomName: classroomName,
                  password: password,
                },
              });
            }}
          >
            Submit
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateClassroom;
