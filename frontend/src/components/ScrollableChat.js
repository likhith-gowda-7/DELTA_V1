import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage, isSameSender, isSameSenderMargin, isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import useThemeColors from "../hooks/useThemeColors";
import React from "react";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const c = useThemeColors();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar mt="7px" mr={2} size="sm" cursor="pointer"
                  name={m.sender.name} src={m.sender.pic} />
              </Tooltip>
            )}
            <span
              style={{
                background: m.sender._id === user._id ? c.msgSentBg : c.msgReceivedBg,
                color: m.sender._id === user._id ? c.msgSentColor : c.msgReceivedColor,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "8px",
                padding: "8px 16px",
                maxWidth: "75%",
                border: m.sender._id === user._id ? "none" : c.msgReceivedBorder,
                fontSize: "15px",
                lineHeight: "1.5",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default React.memo(ScrollableChat);
