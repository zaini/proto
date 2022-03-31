import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { AuthContext } from "../../../context/Auth";
import { useMutation, gql } from "@apollo/client";
import DeleteAccountModal from "../../../components/DeleteAccountModal/DeleteAccountModal";

export const SET_ORGANISATION_ID = gql`
  mutation setOrganisationId($organisationId: String!) {
    setOrganisationId(organisationId: $organisationId)
  }
`;

const Settings = () => {
  const { user }: any = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [organisationId, setOrganisationId] = useState(
    user.organisationId || ""
  );

  const [runSetOrganisationId] = useMutation(SET_ORGANISATION_ID, {
    onCompleted: () => {
      window.alert(`Successfully updated organisation ID.`);
      window.location.reload();
    },
    onError(err) {
      const message =
        (err.graphQLErrors &&
          err.graphQLErrors[0] &&
          err.graphQLErrors[0].message) ||
        err.message;
      window.alert(`Failed to set organisation ID. \n\n${message}`);
    },
  });

  return (
    <>
      <DeleteAccountModal isOpen={isOpen} onClose={onClose} />
      <Box px={"12.5%"} py={8}>
        <Heading data-testid="account-settings">Account Settings</Heading>
        <br />
        <Button onClick={onOpen} colorScheme={"red"}>
          Delete Account
        </Button>
        <br />
        <br />
        <Heading size={"md"}>Organisation Identifier</Heading>
        <Text>
          Your organisation ID is a unique identifier for other platforms, such
          as a student ID number, email or candidate reference number.
        </Text>
        <br />
        <InputGroup>
          <InputLeftAddon children="Current Organisation ID" />
          <Input
            readOnly={true}
            value={`${user.organisationId || "N/A"}`}
            data-testid="organisation-id"
          />
        </InputGroup>
        <br />
        <InputGroup>
          <InputLeftAddon children="New Organisation ID" />
          <Input
            value={organisationId}
            placeholder={`${user.organisationId || "N/A"}`}
            onChange={(e) => setOrganisationId(e.target.value)}
          />
        </InputGroup>
        <br />
        <Button
          onClick={() =>
            runSetOrganisationId({
              variables: {
                organisationId,
              },
            })
          }
          colorScheme={"blue"}
        >
          Update Organisation ID
        </Button>
      </Box>
    </>
  );
};

export default Settings;
