import React, { useContext, useEffect, useState } from "react";
import MainRoomDetails from "./MainRoomDetails";
import AddMemebers from "./AddMemebers";
import RoomSettings from "./RoomSettings";
import { ChatContext } from "../State/ChatProvider";
import axios from "axios";
import { MEMBERS } from "../constants";
import { GlobalContext } from "../State/Provider";

function RoomDetails() {
  const { dispatch, state } = useContext<any>(ChatContext);
  const { newMembers, newGroups } = state;
  const [isAdmin, setIsAdmin] = useState<any>(false);
  const [isOwner, setIsOwner] = useState<any>(false);

  const [newMembersDash, setNewMembers] = useState<any>(false);
  const { selectedChat } = useContext<any>(ChatContext);
  let searchIndex = newGroups.findIndex((id: any) => selectedChat.id === id.id);
  const [settings, setSettings] = useState<any>(false);
// FIXME: add current user id here as default
const { data } = React.useContext<any>(GlobalContext);
const { userInfo } = data;

  const toggleNewMembers = () => {
    setNewMembers(!newMembersDash);
  };

  const toggleSettings = () => {
    setSettings(!settings);
  };

  const oldRoomData = {
    name: newGroups[searchIndex].name,
    type: newGroups[searchIndex].type,
    password: "",
  };

  useEffect(() => {
    axios.get(MEMBERS + selectedChat.id).then((response: any) => {
      for (var j = 0; j < response.data.length; j++) {
        if (response.data[j].userId == userInfo.user_id && response.data[j].prev == "owner")
          setIsOwner(true)
        if (response.data[j].userId == userInfo.user_id && response.data[j].prev == "admin")
          setIsAdmin(true)
      }

    });
  }, [isAdmin, isOwner]);

  return (
    <>
      {settings ? (
        <RoomSettings
          toggleSettings={toggleSettings}
          roomId={newGroups[searchIndex].id}
          oldRoomData={oldRoomData}
        />
      ) : newMembersDash ? (
        <AddMemebers
          toggleNewMembers={toggleNewMembers}
          roomId={newGroups[searchIndex].id}
        />
      ) : (
        <MainRoomDetails
          toggleNewMembers={toggleNewMembers}
          toggleSettings={toggleSettings}
          isAdmin={isAdmin}
          isOwner={isOwner}
        />
      )}
    </>
  );
}

export default RoomDetails;
