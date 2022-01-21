import React from "react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Box, IconButton, Select, Stack, Text } from "@chakra-ui/react";

const EditorSettings = ({
  selectedLanguage,
  setSelectedLanguage,
  editorTheme,
  setEditorTheme,
}: any) => {
  return (
    <Box my={2}>
      {/* <Text>Editor Settings</Text> */}
      <Stack direction={"row"}>
        <IconButton
          aria-label="Toggle editor theme"
          onClick={() =>
            setEditorTheme(editorTheme === "dark" ? "light" : "dark")
          }
          icon={editorTheme === "dark" ? <SunIcon /> : <MoonIcon />}
        />
        <Select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(parseInt(e.target.value))}
        >
          <option value={71}>Python (3.8.1)</option>
          <option value={70}>Python (2.7.17)</option>
          <option value={63}>JavaScript</option>
          <option value={74}>TypeScript</option>
        </Select>
      </Stack>
    </Box>
  );
};

export default EditorSettings;
