import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, Button, useDisclosure, FormControl,
  Input, useToast, Box, IconButton, Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useState, useRef, useCallback } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";
import useThemeColors from "../../hooks/useThemeColors";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();
  const debounceRef = useRef(null);
  const { selectedChat, setSelectedChat, user } = ChatState();
  const c = useThemeColors();

  const inputProps = {
    bg: c.inputBg, border: "1px solid", borderColor: c.inputBorder, color: c.textPrimary,
    _placeholder: { color: c.placeholderColor }, _hover: { borderColor: c.textSecondary },
    _focus: { borderColor: c.textPrimary, boxShadow: `0 0 0 1px ${c.textPrimary}` }, borderRadius: "md",
  };

  const handleSearch = useCallback((query) => {
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

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const { data } = await axios.put(`/api/chat/rename`, { chatId: selectedChat._id, chatName: groupChatName }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({ title: "Error Occurred!", description: error.response?.data?.message, status: "error", duration: 5000, isClosable: true, position: "bottom" });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({ title: "User Already in group!", status: "error", duration: 5000, isClosable: true, position: "bottom" });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({ title: "Only admins can add someone!", status: "error", duration: 5000, isClosable: true, position: "bottom" });
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.put(`/api/chat/groupadd`, { chatId: selectedChat._id, userId: user1._id }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({ title: "Error Occurred!", description: error.response?.data?.message, status: "error", duration: 5000, isClosable: true, position: "bottom" });
      setLoading(false);
    }
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({ title: "Only admins can remove someone!", status: "error", duration: 5000, isClosable: true, position: "bottom" });
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.put(`/api/chat/groupremove`, { chatId: selectedChat._id, userId: user1._id }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({ title: "Error Occurred!", description: error.response?.data?.message, status: "error", duration: 5000, isClosable: true, position: "bottom" });
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen}
        bg={c.btnSecBg} color={c.btnSecColor} _hover={{ bg: c.btnSecHover }} borderRadius="md" />
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent bg={c.modalBg} border="1px solid" borderColor={c.borderColor}
          color={c.textPrimary} borderRadius="lg">
          <ModalHeader fontSize="30px" fontWeight="700" display="flex" justifyContent="center">
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton color={c.textSecondary} _hover={{ color: c.textPrimary }} />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem key={u._id} user={u} admin={selectedChat.groupAdmin._id}
                  handleFunction={() => handleRemove(u)} />
              ))}
            </Box>
            <FormControl display="flex">
              <Input placeholder="Chat Name" mb={3} value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)} {...inputProps} />
              <Button variant="solid" ml={1} isLoading={renameloading} onClick={handleRename}
                bg={c.btnBg} color={c.btnColor} _hover={{ bg: c.btnHover }}>Update</Button>
            </FormControl>
            <FormControl>
              <Input placeholder="Add User to group" mb={2}
                onChange={(e) => handleSearch(e.target.value)} {...inputProps} />
            </FormControl>
            {loading ? <Spinner size="lg" color={c.textPrimary} /> : (
              searchResult?.map((u) => (
                <UserListItem key={u._id} user={u} handleFunction={() => handleAddUser(u)} />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleRemove(user)} variant="outline" colorScheme="red"
              _hover={{ bg: "red.50" }}>Leave Group</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
