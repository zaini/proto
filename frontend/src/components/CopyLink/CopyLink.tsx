import React from "react";
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
} from "@chakra-ui/react";
import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import { useClipboard } from "@chakra-ui/react";

const CopyLink = ({
  link,
  text,
  colorScheme,
}: {
  link: string;
  text?: string;
  colorScheme?: string;
}) => {
  const { hasCopied, onCopy } = useClipboard(link);

  if (text) {
    return (
      <Button onClick={onCopy} colorScheme={colorScheme}>
        {hasCopied ? <CheckIcon /> : <CopyIcon />}&nbsp;Copy Invite Link
      </Button>
    );
  }

  return (
    <Box>
      <InputGroup>
        <InputLeftAddon
          as={Button}
          onClick={onCopy}
          children={hasCopied ? <CheckIcon /> : <CopyIcon />}
        />
        <Input variant="filled" value={link} isReadOnly={true} />
      </InputGroup>
    </Box>
  );
};

export default CopyLink;
