import { Stack } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";
import React from "react";
import useThemeColors from "../hooks/useThemeColors";

const ChatLoading = () => {
  const c = useThemeColors();

  return (
    <Stack>
      {Array(9).fill("").map((_, i) => (
        <Skeleton key={i} height="45px" borderRadius="md"
          startColor={c.skelStart} endColor={c.skelEnd} />
      ))}
    </Stack>
  );
};

export default React.memo(ChatLoading);
