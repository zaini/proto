import React, { useContext } from "react";
import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Center,
  Switch,
  FormLabel,
  Stack,
} from "@chakra-ui/react";
import { AuthContext } from "../../../context/Auth";
import { AccountType } from "../../../utils";

const ProfileIcon = () => {
  const { user, setAccountType, accountType }: any = useContext(AuthContext);

  const avatarUrl =
    (user && `https://avatars.githubusercontent.com/u/${user.githubId}`) ||
    "https://avatars.dicebear.com/api/male/username.svg";

  return (
    <Menu>
      <MenuButton
        as={Button}
        rounded={"full"}
        variant={"link"}
        cursor={"pointer"}
        minW={0}
      >
        <Avatar size={"sm"} src={avatarUrl} />
      </MenuButton>
      <MenuList alignItems={"center"}>
        <br />
        <Center>
          <Avatar size={"2xl"} src={avatarUrl} />
        </Center>
        <br />
        <Center>
          <p>{user.username}</p>
        </Center>
        <br />
        <MenuDivider />
        <a href={`/profile/${user.id}`}>
          <MenuItem>Profile</MenuItem>
        </a>
        <a href={`/profile/settings`}>
          <MenuItem>Settings</MenuItem>
        </a>
        <MenuItem>
          <p>Teacher Mode</p>
          <Switch
            ml={"auto"}
            value={
              accountType === AccountType.Teacher
                ? AccountType.Teacher
                : AccountType.Learner
            }
            onChange={(e) => {
              setAccountType(
                e.target.checked ? AccountType.Teacher : AccountType.Learner
              );
            }}
          />
        </MenuItem>
        <MenuDivider />
        <a href="/accounts/log-out">
          <MenuItem>Logout</MenuItem>
        </a>
      </MenuList>
    </Menu>
  );
};

export default ProfileIcon;
