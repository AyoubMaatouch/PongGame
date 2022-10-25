import React, { useContext, useEffect, useRef, useState } from "react";
import Message from "./Message";
import { ChatContext } from "../State/ChatProvider";
import { Box } from "@chakra-ui/react";
import axios from "axios";
import { BLOCKED_USERS, MESSAGES } from "../constants";
import { GlobalContext } from "../State/Provider";

const AlwaysScrollToBottom = () => {
  const elementRef = useRef();
  // @ts-ignore
  useEffect(() => elementRef.current.scrollIntoView());
  // @ts-ignore
  return <div ref={elementRef} />;
};

function MessagesList() {
  const { selectedChat } = useContext<any>(ChatContext);
  const { dispatch, state } = useContext<any>(ChatContext);
  const { newFriends, newGroups, roomDm, messages } = state;
  const { data } = React.useContext<any>(GlobalContext);
  const { userInfo } = data;
  const [blockerUsers, setBlockedUsers] = useState<any>([])

  const isBlocked = (id: never | any) => {
    return blockerUsers.includes(id);
  }
  useEffect(() => {
    axios
      .get(BLOCKED_USERS)
      .then((res: any) => {
        console.log(res.data)
        setBlockedUsers(res.data)
      })
      .catch((err) => {
      });

  }, [])
  useEffect(() => {
    axios
      .get(MESSAGES + (selectedChat.chat === "F" ? roomDm : selectedChat.id))
      .then((res: any) => {
        dispatch({
          type: "SET_MESSAGES",
          data: res.data,
        });
      })
      .catch((err) => {
      });
  }, [roomDm]);

  return (
    <Box bottom={0} w={"100%"}>
      {messages.map((item: any, id: any) => {
        if (!isBlocked(item.userId))
          return <Message
            key={id.toString()}
            isSender={item.userId == userInfo.user_id}
            content={item.message}
            time={"12:00"}
          />
        else
          return undefined
      })}
      <AlwaysScrollToBottom />
    </Box>
  );
}

export default MessagesList;
