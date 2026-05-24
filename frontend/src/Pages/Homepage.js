import {
  Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { ChatState } from "../Context/ChatProvider";
import useThemeColors from "../hooks/useThemeColors";

function Homepage() {
  const history = useHistory();
  const { user } = ChatState();
  const c = useThemeColors();

  useEffect(() => {
    if (user) history.push("/chats");
  }, [user, history]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex" justifyContent="center" p={4}
        bg={c.bgPanel} w="100%" m="40px 0 15px 0"
        borderRadius="lg" border="1px solid" borderColor={c.borderColor}
        boxShadow="sm"
      >
        <Text fontSize="3xl" fontWeight="700" textAlign="center"
          color={c.textPrimary} letterSpacing="2px">
          DELTA
        </Text>
      </Box>
      <Box bg={c.bgPanel} w="100%" p={4} borderRadius="lg"
        border="1px solid" borderColor={c.borderColor} boxShadow="sm">
        <Tabs isFitted variant="line">
          <TabList mb="1em">
            <Tab color={c.textSecondary}
              _selected={{ color: c.textPrimary, borderColor: c.textPrimary }}
              fontWeight="600">Login</Tab>
            <Tab color={c.textSecondary}
              _selected={{ color: c.textPrimary, borderColor: c.textPrimary }}
              fontWeight="600">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel><Login /></TabPanel>
            <TabPanel><Signup /></TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Homepage;
