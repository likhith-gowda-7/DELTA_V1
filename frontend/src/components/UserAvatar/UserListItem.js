import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import React from "react";
import useThemeColors from "../../hooks/useThemeColors";

const UserListItem = ({ user, handleFunction }) => {
  const c = useThemeColors();

  return (
    <Box onClick={handleFunction} cursor="pointer" bg={c.chatItemBg}
      _hover={{ background: c.hoverBg }} w="100%" display="flex" alignItems="center"
      color={c.textPrimary} px={3} py={2} mb={2} borderRadius="md"
      border="1px solid" borderColor={c.borderColor} transition="all 0.1s ease">
      <Avatar mr={3} size="sm" cursor="pointer" name={user.name} src={user.pic} />
      <Box>
        <Text fontWeight="600">{user.name}</Text>
        <Text fontSize="sm" color={c.textSecondary}>
          <b>Email : </b>{user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default React.memo(UserListItem);
