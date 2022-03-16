import {
  Box,
  Button,
  Code,
  Heading,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../../context/Auth";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useMutation, gql } from "@apollo/client";

const DELETE_USER = gql`
  mutation deleteUser($userId: ID!, $username: String!) {
    deleteUser(userId: $userId, username: $username)
  }
`;

const Settings = () => {
  const { user }: any = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [username, setUsername] = useState("");

  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: ({ deleteUser }) => {
      window.location.href = `/logout`;
    },
    onError(err) {
      const message =
        (err.graphQLErrors &&
          err.graphQLErrors[0] &&
          err.graphQLErrors[0].message) ||
        err.message;
      window.alert(`Failed to delete user. \n\n${message}`);
    },
  });

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              Account details:
              <Box backgroundColor={"#EDF2F7"}>{JSON.stringify(user)}</Box>
              <br />
              <b>Enter username to confirm deletion:</b>
              <Input
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                placeholder={user.username}
              />
              <br />
              <br />
              <Code textAlign={"center"}>
                <b>WARNING:</b> This will delete your account, all submission,
                all assignment submissions, all classrooms and problems. You
                cannot recover these after deletion.
              </Code>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                deleteUser({
                  variables: {
                    userId: user.id,
                    username,
                  },
                });
              }}
            >
              Confirm Account Deletion
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box px={"12.5%"} py={8}>
        <Heading>Account Settings</Heading>
        <br />
        <Button onClick={onOpen} colorScheme={"red"}>
          Delete Account
        </Button>
      </Box>
    </>
  );
};

export default Settings;
