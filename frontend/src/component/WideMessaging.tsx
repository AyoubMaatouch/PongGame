import React, { useContext } from "react";
import { ChatContext } from "../State/ChatProvider";
import Messaging from "./Messaging";
import { Text, Flex, Show, Hide } from "@chakra-ui/react";

const WideMessaging = () => {
  const { selectedChat } = useContext<any>(ChatContext);
  return (
    <Flex w={"100%"}
    justifyContent={'center'}
    >
      {selectedChat ? <Messaging /> : <Text>No Chat Selected </Text>}
    </Flex>
  );
};

export default WideMessaging;
