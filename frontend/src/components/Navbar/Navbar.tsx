import React, { useContext } from "react";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  useColorModeValue,
  useBreakpointValue,
  Collapse,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { AuthContext } from "../../context/Auth";
import { AccountType } from "../../utils";
import ProfileIcon from "./ProfileIcon/ProfileIcon";
import DesktopNavbar from "./DesktopNavbar/DesktopNavbar";
import MobileNavbar from "./MobileNavbar/MobileNavbar";

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, accountType }: any = useContext(AuthContext);
  const navbarItems = getNavbarItems(accountType);
  return (
    <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <IconButton
          size={"md"}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={"Open Menu"}
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={"center"}>
          <Text
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontFamily={"heading"}
            fontWeight={900}
            size={"xl"}
            color={useColorModeValue("gray.800", "white")}
          >
            Proto
          </Text>
          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNavbar navbarItems={navbarItems} />
          </Flex>
        </HStack>
        {user && (
          <Flex alignItems={"center"}>
            <ProfileIcon />
          </Flex>
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNavbar navbarItems={navbarItems} />
      </Collapse>
    </Box>
  );
};

export default Navbar;

const getNavbarItems = (accountType: AccountType | null): Array<NavItem> => {
  switch (accountType) {
    case AccountType.Learner:
      return LEANER_NAV_ITEMS;
    case AccountType.Teacher:
      return TEACHER_NAV_ITEMS;
    default:
      return DEFAULT_NAV_ITEMS;
  }
};

const DEFAULT_NAV_ITEMS: Array<NavItem> = [
  {
    label: "Home",
    children: [
      {
        label: "Explore Design Work",
        subLabel: "Trending Design to inspire you",
        href: "#",
      },
      {
        label: "New & Noteworthy",
        subLabel: "Up-and-coming Designers",
        href: "#",
      },
    ],
  },
  {
    label: "About",
    children: [
      {
        label: "Job Board",
        subLabel: "Find your dream design job",
        href: "#",
      },
      {
        label: "Freelance Projects",
        subLabel: "An exclusive list for contract work",
        href: "#",
      },
    ],
  },
  {
    label: "Login",
    href: "/accounts/login",
  },
];

const LEANER_NAV_ITEMS: Array<NavItem> = [
  {
    label: "Dashboard",
    children: [
      {
        label: "Explore Design Work",
        subLabel: "Trending Design to inspire you",
        href: "#",
      },
      {
        label: "New & Noteworthy",
        subLabel: "Up-and-coming Designers",
        href: "#",
      },
    ],
  },
  {
    label: "View Assignments",
    children: [
      {
        label: "Job Board",
        subLabel: "Find your dream design job",
        href: "#",
      },
      {
        label: "Freelance Projects",
        subLabel: "An exclusive list for contract work",
        href: "#",
      },
    ],
  },
  {
    label: "Logout",
    href: "/accounts/log-out",
  },
];

const TEACHER_NAV_ITEMS: Array<NavItem> = [
  {
    label: "Dashboard",
    children: [
      {
        label: "Explore Design Work",
        subLabel: "Trending Design to inspire you",
        href: "#",
      },
      {
        label: "New & Noteworthy",
        subLabel: "Up-and-coming Designers",
        href: "#",
      },
    ],
  },
  {
    label: "Set Assignments",
    children: [
      {
        label: "Job Board",
        subLabel: "Find your dream design job",
        href: "#",
      },
      {
        label: "Freelance Projects",
        subLabel: "An exclusive list for contract work",
        href: "#",
      },
    ],
  },
  {
    label: "Logout",
    href: "/accounts/log-out",
  },
];
