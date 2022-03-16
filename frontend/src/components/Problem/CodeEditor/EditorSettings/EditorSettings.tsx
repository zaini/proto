import React, { useContext } from "react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Box, IconButton, Select, Stack } from "@chakra-ui/react";
import { EditorContext } from "../CodeEditor";
import { LanguageCodeToName } from "../../../../utils";
import { ProblemContext } from "../../../../views/Problem/Problem";

const EditorSettings = () => {
  const { editorTheme, selectedLanguage, setSelectedLanguage, setEditorTheme } =
    useContext(EditorContext);
  const problem = useContext(ProblemContext);

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
        <Box>
          <Select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(parseInt(e.target.value))}
          >
            {Object.keys(problem.specification.initialCode).map(
              (languageCode) => (
                <option value={parseInt(languageCode)}>
                  {LanguageCodeToName[parseInt(languageCode)]}
                </option>
              )
            )}
          </Select>
        </Box>
      </Stack>
    </Box>
  );
};

export default EditorSettings;
