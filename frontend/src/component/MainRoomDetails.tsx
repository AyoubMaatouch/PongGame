import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Text,
  HStack,
  VStack,
  Spacer,
  Button,
  Tooltip,
  Flex,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { ChatContext } from "../State/ChatProvider";
import { Image } from "@chakra-ui/react";
import { RiPencilLine } from "react-icons/ri";
import ChannelMemeber from "./ChannelMember";
import { AddIcon } from "@chakra-ui/icons";
import useMute from "../hooks/useMute";
import useBlock from "../hooks/useBlock";
import RemoveMember from "./RemoveMember";
import MuteMember from "./MuteMember";
import { ArrowBackIcon } from "@chakra-ui/icons";
// import useMembers from "../api/useMembers";
import axios from "axios";
import { MEMBERS, USER_URL } from "../constants";
import { GlobalContext } from "../State/Provider";

type Props = {
  toggleNewMembers: () => void;
  toggleSettings: () => void;
  isAdmin: boolean;
  isOwner: boolean;
};
export default function MainRoomDetails({
  toggleNewMembers,
  toggleSettings,
  isAdmin,
  isOwner,
}: Props) {
  const { dispatch, state } = useContext<any>(ChatContext);
  const { newMembers, newGroups, newFriends } = state;
  const { toggleDetails } = useContext<any>(ChatContext);
//   const { data, friends, groups, roomMembers, setMembers } =
//     useContext<any>(ChatContext);
  const { selectedChat } = useContext<any>(ChatContext);
  let searchIndex = newGroups.findIndex((id: any) => selectedChat.id === id.id);
  const [member, setMember] = useState<any>([]);
  const { isMuteOpen, onMuteOpen, onMuteClose } = useMute();
  const { isBlockOpen, onBlockOpen, onBlockClose } = useBlock();
 // FIXME: add current user id here as default
 const { data } = React.useContext<any>(GlobalContext);
 const { userInfo } = data;

  function isFriend(id: any) {
    return newFriends.findIndex((f: any) => f.id == id) == -1 ? false : true;
  }

  useEffect(() => {
    const keyDownHandler = (event: any) => {
      if (event.key === "Escape") {
        event.preventDefault();
        toggleDetails();
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  });

  useEffect(() => {
    dispatch({
      type: "SET_MEMBERS",
      data: [],
    });
    
    axios.get(MEMBERS + selectedChat.id).then((response: any) => {
      const mems: any[] = [];
      for (var i = 0; i < response.data.length; i++) {
        mems.push({id: response.data[i].userId,role: response.data[i].prev});
      }
      for (var j = 0; j < response.data.length; j++) {
        axios.get(USER_URL + response.data[j].userId).then((res: any) => {
          const member = {
            id: res.data.user_id,
            name: res.data.user_name,
            avatar: res.data.user_avatar,
            role: mems[j],
          };
          if (res.data.user_id != userInfo.user_id) {
            dispatch({
              type: "ADD_MEMBER",
              data: member,
            });
          }
        });
      }
    });
  }, []);

  return (
    <VStack overflow={"auto"} w="100%" position={"relative"} h={"100%"}>
      <HStack overflow={"visible"} px={5} w={"100%"} m={1} spacing={8}>
        <Box as={"button"}>
          <ArrowBackIcon
            m={0}
            p={0}
            h={30}
            fontSize={25}
            onClick={toggleDetails}
          />
        </Box>
        <Text fontSize={20}>Details</Text>
        <Spacer />
        {isOwner && (
          <Tooltip label="Edit" openDelay={500}>
            <Box
              rounded={"50em"}
              bg={"none"}
              as={Button}
              onClick={toggleSettings}
            >
              <RiPencilLine fontSize={"1.2em"} />
            </Box>
          </Tooltip>
        )}
      </HStack>
      <VStack
        pt={"1.5%"}
        h={"100%"}
        overflow={"auto"}
        w={"100%"}
        alignItems={"left"}
        px={5}
      >
        {newGroups[searchIndex].avatar && (
          <Image h="20em" src={newGroups[searchIndex].avatar} />
        )}
        <Text>Memebers</Text>
        {newMembers.length ? (
          newMembers.map((member: any, index: any) => (
            <ChannelMemeber
              id={member.id}
              name={member.name.toString()}
              avatar={member.avatar}
              key={index.toString()}
              isAdmin={isAdmin}
              isOwner={isOwner}
              onBlock={onBlockOpen}
              onMute={onMuteOpen}
              setMember={setMember}
              isFriend={isFriend(member.id)}
              roomId={newGroups[searchIndex].id}
              role={member.role}
            />
          ))
        ) : (
          <Flex
            pt={"1.5%"}
            h={"100%"}
            w={"100%"}
            alignItems={"center"}
            px={5}
            justifyContent={"center"}
          >
            <Text alignSelf={"center"} justifyContent="center">
              No Members
            </Text>
          </Flex>
        )}
      </VStack>
      <MuteMember
        isOpen={isMuteOpen}
        onClose={onMuteClose}
        name={member?.name}
        memberId={member?.id}
        roomId={newGroups[searchIndex].id}
      />
      <RemoveMember
        isOpen={isBlockOpen}
        onClose={onBlockClose}
        name={member?.name}
        memberId={member?.id}
        roomId={newGroups[searchIndex].id}
      />
      {(isAdmin || isOwner) && (
        <Box
          onClick={toggleNewMembers}
          position={"absolute"}
          right={5}
          bottom={5}
          rounded={30}
        >
          <Tooltip label="add Members" openDelay={500}>
            <IconButton
              fontSize={16}
              w={14}
              h={14}
              rounded={30}
              bg={"green"}
              variant={"ghost"}
              aria-label={"new channel"}
              icon={<AddIcon />}
            />
          </Tooltip>
        </Box>
      )}
    </VStack>
  );
}
