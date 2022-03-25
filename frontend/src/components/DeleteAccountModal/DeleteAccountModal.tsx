import React, { useContext, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Input,
  Code,
  Button,
} from "@chakra-ui/react";
import { AuthContext } from "../../context/Auth";
import { useMutation, gql } from "@apollo/client";

const DELETE_USER = gql`
  mutation deleteUser($userId: ID!, $username: String!) {
    deleteUser(userId: $userId, username: $username)
  }
`;

type Props = {
  isOpen: any;
  onClose: any;
};

const DeleteAccountModal = ({ isOpen, onClose }: Props) => {
  const { user, logout }: any = useContext(AuthContext);
  const [username, setUsername] = useState("");

  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: () => {
      logout();
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
    </>
  );
};

export default DeleteAccountModal;
