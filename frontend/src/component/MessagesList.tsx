import React, { useContext, useEffect, useRef } from "react";
import Message from "./Message";
import { ChatContext } from "../State/ChatProvider";
import { Box } from "@chakra-ui/react";
import axios from "axios";
import { MESSAGES } from "../constants";
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

  useEffect(() => {
    axios
      .get(MESSAGES + (selectedChat.chat === "F" ? roomDm : selectedChat.id))
      .then((res: any) => {
        console.log("all messages here ", res.data);
        dispatch({
          type: "SET_MESSAGES",
          data: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [roomDm]);

  return (
    <Box bottom={0} w={"100%"}>
      {messages.map((item: any, id: any) => (
        <Message
          key={id.toString()}
          isSender={item.userId == userInfo.user_id}
          content={item.message}
          time={"12:00"}
        />
      ))}
      <AlwaysScrollToBottom />
    </Box>
  );
}

export default MessagesList;
