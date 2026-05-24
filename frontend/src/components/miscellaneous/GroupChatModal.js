import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, Button, useDisclosure, FormControl,
  Input, useToast, Box,
} from "@chakra-ui/react";
import axios from "axios";
import { useState, useRef, useCallback } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";
import useThemeColors from "../../hooks/useThemeColors";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const debounceRef = useRef(null);
  const { user, chats, setChats } = ChatState();
  const c = useThemeColors();

  const inputProps = {
    bg: c.inputBg, border: "1px solid", borderColor: c.inputBorder, color: c.textPrimary,
    _placeholder: { color: c.placeholderColor }, _hover: { borderColor: c.textSecondary },
    _focus: { borderColor: c.textPrimary, boxShadow: `0 0 0 1px ${c.textPrimary}` }, borderRadius: "md",
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({ title: "User already added", status: "warning", duration: 5000, isClosable: true, position: "top" });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
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

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      toast({ title: "Please fill all the fields", status: "warning", duration: 5000, isClosable: true, position: "top" });
      return;
    }
    try {
      const { data } = await axios.post(`/api/chat/group`, {
        name: groupChatName, users: JSON.stringify(selectedUsers.map((u) => u._id)),
      }, { headers: { Authorization: `Bearer ${user.token}` } });
      setChats([data, ...chats]);
      onClose();
      toast({ title: "New Group Chat Created!", status: "success", duration: 5000, isClosable: true, position: "bottom" });
    } catch (error) {
      toast({ title: "Failed to Create the Chat!", description: error.response?.data, status: "error", duration: 5000, isClosable: true, position: "bottom" });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent bg={c.modalBg} border="1px solid" borderColor={c.borderColor}
          color={c.textPrimary} borderRadius="lg">
          <ModalHeader fontSize="30px" fontWeight="700" display="flex" justifyContent="center">
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton color={c.textSecondary} _hover={{ color: c.textPrimary }} />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input placeholder="Chat Name" mb={3} onChange={(e) => setGroupChatName(e.target.value)} {...inputProps} />
            </FormControl>
            <FormControl>
              <Input placeholder="Add Users eg: John, Jane" mb={2} onChange={(e) => handleSearch(e.target.value)} {...inputProps} />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap" mb={2}>
              {selectedUsers.map((u) => (
                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
              ))}
            </Box>
            {loading ? (
              <div style={{ color: c.textSecondary }}>Loading...</div>
            ) : (
              searchResult?.slice(0, 4).map((u) => (
                <UserListItem key={u._id} user={u} handleFunction={() => handleGroup(u)} />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} bg={c.btnBg} color={c.btnColor}
              _hover={{ bg: c.btnHover }} borderRadius="md">Create Chat</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
