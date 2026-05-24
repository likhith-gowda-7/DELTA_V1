import { Box } from "@chakra-ui/layout";
import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";
import useThemeColors from "../hooks/useThemeColors";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  const c = useThemeColors();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center" flexDir="column" p={3}
      bg={c.bgPanel} w={{ base: "100%", md: "68%" }}
      borderRadius="lg" border="1px solid" borderColor={c.borderColor}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
