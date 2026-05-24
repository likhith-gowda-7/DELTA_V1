import { AddIcon, ChatIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Avatar, Button } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import useThemeColors from "../hooks/useThemeColors";
import React from "react";

const MyChats = ({ fetchAgain }) => {
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();
  const c = useThemeColors();

  const fetchChats = async () => {
    try {
      const { data } = await axios.get("/api/chat", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setChats(data);
    } catch (error) {
      toast({ title: "Error Occurred!", description: "Failed to Load the chats", status: "error", duration: 5000, isClosable: true, position: "bottom-left" });
    }
  };

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column" alignItems="center" p={3}
      bg={c.bgPanel} w={{ base: "100%", md: "31%" }}
      borderRadius="lg" border="1px solid" borderColor={c.borderColor}>
      <Box pb={3} px={3} fontSize={{ base: "24px", md: "28px" }} fontWeight="600"
        display="flex" w="100%" justifyContent="space-between" alignItems="center" color={c.textPrimary}>
        Chats
        <GroupChatModal>
          <Button display="flex" fontSize={{ base: "14px", md: "12px", lg: "14px" }}
            rightIcon={<AddIcon />} bg={c.btnSecBg} color={c.btnSecColor}
            _hover={{ bg: c.btnSecHover }} size="sm" borderRadius="md" fontWeight="500">
            New Group
          </Button>
        </GroupChatModal>
      </Box>
      <Box display="flex" flexDir="column" p={2} bg={c.bgMain} w="100%" h="100%"
        borderRadius="md" overflowY="hidden">
        {chats ? (
          chats.length === 0 ? (
            <Box display="flex" flexDir="column" alignItems="center" justifyContent="center"
              h="100%" opacity={0.5} gap={3}>
              <ChatIcon boxSize={10} color={c.textSecondary} />
              <Text color={c.textSecondary} fontSize="md" fontWeight="500">No conversations yet</Text>
              <Text color={c.textSecondary} fontSize="sm">Search for a user to start chatting</Text>
            </Box>
          ) : (
            <Stack overflowY="scroll" spacing={1}>
              {chats.map((chat) => {
                const isSelected = selectedChat?._id === chat._id;
                return (
                  <Box onClick={() => setSelectedChat(chat)} cursor="pointer"
                    bg={isSelected ? c.selectedBg : c.chatItemBg}
                    color={isSelected ? c.selectedColor : c.textPrimary}
                    px={3} py={3} borderRadius="md" key={chat._id}
                    _hover={{ bg: isSelected ? c.selectedBg : c.chatItemHover }}
                    transition="all 0.15s ease" display="flex" alignItems="center" gap={3}>
                    <Avatar size="sm" name={!chat.isGroupChat ? getSender(user, chat.users) : chat.chatName} />
                    <Box flex="1" overflow="hidden">
                      <Text fontWeight="600" fontSize="sm" isTruncated>
                        {!chat.isGroupChat ? getSender(user, chat.users) : chat.chatName}
                      </Text>
                      {chat.latestMessage && (
                        <Text fontSize="xs" color={isSelected ? c.selectedPreview : c.textSecondary}
                          mt={0.5} fontWeight="400" isTruncated>
                          <b>{chat.latestMessage.sender.name}: </b>
                          {chat.latestMessage.content}
                        </Text>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          )
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default React.memo(MyChats);
