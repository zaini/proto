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
} from "@chakra-ui/react";
import { AuthContext } from "../../../context/Auth";

const ProfileIcon = () => {
  const { user }: any = useContext(AuthContext);
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
        <MenuItem>Profile</MenuItem>
        <MenuItem>Account Settings</MenuItem>
        <a href="/accounts/log-out">
          <MenuItem>Logout</MenuItem>
        </a>
      </MenuList>
    </Menu>
  );
};

export default ProfileIcon;
