import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";
import React from "react";
import useThemeColors from "../../hooks/useThemeColors";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  const c = useThemeColors();

  return (
    <Badge px={2} py={1} borderRadius="md" m={1} mb={2} variant="solid"
      fontSize={12} bg={c.btnBg} color={c.btnColor} cursor="pointer"
      onClick={handleFunction} _hover={{ opacity: 0.8 }}
      textTransform="none" fontWeight="500">
      {user.name}
      {admin === user._id && <span> (Admin)</span>}
      <CloseIcon pl={2} pb={0.5} boxSize="12px" />
    </Badge>
  );
};

export default React.memo(UserBadgeItem);
