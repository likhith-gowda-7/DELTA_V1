import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import useThemeColors from "../hooks/useThemeColors";

const ENDPOINT = "http://localhost:5000";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();
  const c = useThemeColors();

  const selectedChatRef = useRef();
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const notificationRef = useRef([]);
  const fetchAgainRef = useRef(fetchAgain);

  const defaultOptions = {
    loop: true, autoplay: true, animationData: animationData,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };

  const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();

  // Keep refs in sync with latest state
  notificationRef.current = notification;
  fetchAgainRef.current = fetchAgain;

  const fetchMessages = useCallback(async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessages(data);
      setLoading(false);
      if (socketRef.current) socketRef.current.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({ title: "Error Occurred!", description: "Failed to Load the Messages", status: "error", duration: 5000, isClosable: true, position: "bottom" });
    }
  }, [selectedChat, user, toast]);

  const sendMessage = useCallback(async (event) => {
    if (event.key === "Enter" && newMessage) {
      if (socketRef.current) socketRef.current.emit("stop typing", selectedChat._id);
      try {
        setNewMessage("");
        const { data } = await axios.post("/api/message", { content: newMessage, chatId: selectedChat._id }, {
          headers: { "Content-type": "application/json", Authorization: `Bearer ${user.token}` },
        });
        if (socketRef.current) socketRef.current.emit("new message", data);
        setMessages((prev) => [...prev, data]);
      } catch (error) {
        toast({ title: "Error Occurred!", description: "Failed to send the Message", status: "error", duration: 5000, isClosable: true, position: "bottom" });
      }
    }
  }, [newMessage, selectedChat, user, toast]);

  // Socket setup — creates on mount, disconnects on unmount
  useEffect(() => {
    const socket = io(ENDPOINT);
    socketRef.current = socket;
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
      socket.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatRef.current = selectedChat;

    // Clear notifications for the newly selected chat
    if (selectedChat) {
      setNotification((prev) =>
        prev.filter((n) => n.chat._id !== selectedChat._id)
      );
    }
    // eslint-disable-next-line
  }, [selectedChat]);

  // Message received handler — registered once, uses refs to avoid stale closures
  useEffect(() => {
    const handleMessageReceived = (newMessageRecieved) => {
      if (!selectedChatRef.current || selectedChatRef.current._id !== newMessageRecieved.chat._id) {
        // Check for duplicates by message _id instead of reference equality
        const alreadyNotified = notificationRef.current.some(
          (n) => n._id === newMessageRecieved._id
        );
        if (!alreadyNotified) {
          setNotification((prev) => [newMessageRecieved, ...prev]);
          setFetchAgain((prev) => !prev);
        }
      } else {
        setMessages((prev) => [...prev, newMessageRecieved]);
      }
    };

    // Wait briefly for socket to be initialized
    const intervalId = setInterval(() => {
      if (socketRef.current) {
        socketRef.current.on("message recieved", handleMessageReceived);
        clearInterval(intervalId);
      }
    }, 100);

    return () => {
      clearInterval(intervalId);
      socketRef.current?.off("message recieved", handleMessageReceived);
    };
    // eslint-disable-next-line
  }, []);

  const typingHandler = useCallback((e) => {
    setNewMessage(e.target.value);
    if (!socketConnected || !socketRef.current) return;
    if (!typing) {
      setTyping(true);
      socketRef.current.emit("typing", selectedChat._id);
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit("stop typing", selectedChat._id);
      setTyping(false);
    }, 3000);
  }, [socketConnected, typing, selectedChat]);

  return (
    <>
      {selectedChat ? (
        <>
          <Text fontSize={{ base: "24px", md: "26px" }} pb={3} px={2} w="100%"
            fontWeight="600" display="flex" justifyContent={{ base: "space-between" }}
            alignItems="center" color={c.textPrimary}>
            <IconButton display={{ base: "flex", md: "none" }} icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")} bg={c.btnSecBg} color={c.btnSecColor}
              _hover={{ bg: c.btnSecHover }} borderRadius="md" />
            {messages && (!selectedChat.isGroupChat ? (
              <>{getSender(user, selectedChat.users)}<ProfileModal user={getSenderFull(user, selectedChat.users)} /></>
            ) : (
              <>{selectedChat.chatName.toUpperCase()}<UpdateGroupChatModal fetchMessages={fetchMessages} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /></>
            ))}
          </Text>
          <Box display="flex" flexDir="column" justifyContent="flex-end" p={3}
            bg={c.bgMain} w="100%" h="100%" borderRadius="md" overflowY="hidden"
            border="1px solid" borderColor={c.borderColor}>
            {loading ? (
              <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto"
                color={c.textPrimary} thickness="3px" />
            ) : (
              <div className="messages"><ScrollableChat messages={messages} /></div>
            )}
            <FormControl onKeyDown={sendMessage} id="message-input" isRequired mt={3}>
              {istyping && (
                <div><Lottie options={defaultOptions} width={70} style={{ marginBottom: 15, marginLeft: 0 }} /></div>
              )}
              <Input variant="filled" bg={c.inputBg} placeholder="Type a message..."
                value={newMessage} onChange={typingHandler} color={c.textPrimary}
                _placeholder={{ color: c.placeholderColor }}
                _hover={{ bg: c.inputBg }} _focus={{ bg: c.inputBg, borderColor: c.textPrimary }}
                border="1px solid" borderColor={c.inputBorder} borderRadius="md" size="lg" />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="2xl" pb={3} color={c.textSecondary} fontWeight="500">
            Select a chat to start messaging
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
