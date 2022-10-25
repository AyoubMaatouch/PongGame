import React, { useContext, useEffect } from "react";
import { ChatContext } from "../State/ChatProvider";
import ProfileDetails from "./ProfileDetails";
import MessagingBox from "./MessagingBox";
import RoomDetails from "./RoomDetails";

const Messaging = () => {
  const { chatDetails, selectedChat } = useContext<any>(ChatContext);
  const { dispatch, state } = useContext<any>(ChatContext);
  useEffect(() => {
    return dispatch({
      type: "SET_MEMBERS",
      data: [],
    });
  }, []);

  return (
    <>
      {!chatDetails ? (
        <MessagingBox />
      ) : selectedChat.chat === "F" ? (
        <ProfileDetails />
      ) : (
        <RoomDetails />
      )}
    </>
  );
};

export default Messaging;
