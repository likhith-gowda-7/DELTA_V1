import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text, Center } from "@chakra-ui/layout";
import {
  Menu, MenuButton, MenuDivider, MenuItem, MenuList,
} from "@chakra-ui/menu";
import {
  Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay,
} from "@chakra-ui/modal";
import {
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
  AlertDialogContent, AlertDialogOverlay,
} from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useState, useRef, useCallback } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import { useColorMode, keyframes } from "@chakra-ui/react";
import ChatLoading from "../ChatLoading";
import { Spinner } from "@chakra-ui/spinner";
import ProfileModal from "./ProfileModal";
import { getSender } from "../../config/ChatLogics";
import UserListItem from "../UserAvatar/UserListItem";
import { ChatState } from "../../Context/ChatProvider";
import useThemeColors from "../../hooks/useThemeColors";

const badgePulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const cancelRef = useRef();
  const debounceRef = useRef(null);

  const { setSelectedChat, user, notification, setNotification, chats, setChats, logout } = ChatState();
  const { colorMode, toggleColorMode } = useColorMode();
  const c = useThemeColors();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSearch = useCallback(async (query) => {
    setSearch(query);
    if (!query) { setSearchResult([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/user?search=${query}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setLoading(false);
        setSearchResult(data);
      } catch (error) {
        toast({ title: "Error Occurred!", description: "Failed to Load the Search Results", status: "error", duration: 5000, isClosable: true, position: "bottom-left" });
        setLoading(false);
      }
    }, 300);
  }, [user, toast]);

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const { data } = await axios.post(`/api/chat`, { userId }, {
        headers: { "Content-type": "application/json", Authorization: `Bearer ${user.token}` },
      });
      if (!chats.find((ch) => ch._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({ title: "Error fetching the chat", description: error.message, status: "error", duration: 5000, isClosable: true, position: "bottom-left" });
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center"
        bg={c.bgPanel} w="100%" p="10px 20px" borderBottom="1px solid" borderColor={c.borderColor}>
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen} p={2} color={c.textPrimary}
            _hover={{ bg: c.hoverBg }} borderRadius="md">
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "inline" }} px={3} fontWeight="500">Search</Text>
          </Button>
        </Tooltip>

        <Center>
          <Text fontSize="2xl" fontWeight="700" color={c.textPrimary} letterSpacing="2px">DELTA</Text>
        </Center>

        <Box display="flex" alignItems="center" gap="3">
          <Tooltip label={colorMode === "light" ? "Dark mode" : "Light mode"} hasArrow>
            <Button variant="ghost" onClick={toggleColorMode} p={2} color={c.textPrimary}
              _hover={{ bg: c.hoverBg }} borderRadius="md" size="sm">
              {colorMode === "light" ? <MoonIcon fontSize="lg" /> : <SunIcon fontSize="lg" />}
            </Button>
          </Tooltip>

          <Menu>
            <MenuButton p={1} position="relative" color={c.textPrimary} _hover={{ opacity: 0.7 }}>
              {notification.length > 0 && (
                <Box
                  position="absolute"
                  top="-2px"
                  right="-2px"
                  bg="red.500"
                  color="white"
                  borderRadius="full"
                  minW="18px"
                  h="18px"
                  fontSize="11px"
                  fontWeight="bold"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  zIndex={2}
                  lineHeight="1"
                  px="4px"
                  border="2px solid"
                  borderColor={c.bgPanel}
                  animation={`${badgePulse} 1.5s ease-in-out infinite`}
                >
                  {notification.length > 9 ? "9+" : notification.length}
                </Box>
              )}
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList bg={c.bgPanel} borderColor={c.borderColor} color={c.textPrimary} pl={2} boxShadow="md">
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem key={notif._id} onClick={() => { setSelectedChat(notif.chat); setNotification(notification.filter((n) => n !== notif)); }}
                  bg={c.bgPanel} _hover={{ bg: c.hoverBg }} fontWeight="500">
                  {notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}` : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} bg="transparent" rightIcon={<ChevronDownIcon color={c.textPrimary} />}
              _hover={{ bg: c.hoverBg }} _active={{ bg: c.hoverBg }} p={1} borderRadius="md">
              <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
            </MenuButton>
            <MenuList bg={c.bgPanel} borderColor={c.borderColor} color={c.textPrimary} boxShadow="md">
              <ProfileModal user={user}>
                <MenuItem bg={c.bgPanel} _hover={{ bg: c.hoverBg }} fontWeight="500">My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider borderColor={c.borderColor} />
              <MenuItem onClick={() => setLogoutOpen(true)} bg={c.bgPanel} color="red.500"
                _hover={{ bg: "red.50" }} fontWeight="500">Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>

      {/* Logout Confirmation */}
      <AlertDialog isOpen={logoutOpen} leastDestructiveRef={cancelRef} onClose={() => setLogoutOpen(false)} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent bg={c.modalBg} color={c.textPrimary} border="1px solid" borderColor={c.borderColor}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">Logout</AlertDialogHeader>
            <AlertDialogBody>Are you sure you want to logout?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setLogoutOpen(false)} bg={c.btnSecBg} color={c.btnSecColor} _hover={{ bg: c.btnSecHover }}>Cancel</Button>
              <Button colorScheme="red" onClick={() => { setLogoutOpen(false); logout(); }} ml={3}>Logout</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Search Drawer */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg={c.bgPanel} color={c.textPrimary}>
          <DrawerHeader borderBottomWidth="1px" borderColor={c.borderColor} fontWeight="600">Search Users</DrawerHeader>
          <DrawerBody mt={4}>
            <Box display="flex" pb={4}>
              <Input placeholder="Search by name or email" mr={2} value={search}
                onChange={(e) => handleSearch(e.target.value)}
                bg={c.inputBg} border="1px solid" borderColor={c.inputBorder} color={c.textPrimary}
                _placeholder={{ color: c.placeholderColor }}
                _focus={{ borderColor: c.textPrimary, boxShadow: `0 0 0 1px ${c.textPrimary}` }} borderRadius="md" />
              <Button onClick={() => handleSearch(search)} bg={c.btnBg} color={c.btnColor}
                _hover={{ bg: c.btnHover }} borderRadius="md">Go</Button>
            </Box>
            {loading ? <ChatLoading /> : searchResult?.map((u) => (
              <UserListItem key={u._id} user={u} handleFunction={() => accessChat(u._id)} />
            ))}
            {loadingChat && <Spinner ml="auto" display="flex" color={c.textPrimary} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
