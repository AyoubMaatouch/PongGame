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
} from "@chakra-ui/react";
import { ChatContext } from "../State/ChatProvider";
import NewMember from "./NewMember";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { GrIteration } from "react-icons/gr";
import axios from "axios";
import { ADD_MEMBER } from "../constants";

type Props = {
  toggleNewMembers: () => void;
  roomId: string;
};

export default function AddMemebers({ toggleNewMembers, roomId }: Props) {
  const { dispatch, state, selectedChat } = useContext<any>(ChatContext);
  const { newMembers, newGroups, newFriends } = state;
  const [selectedFriends, setSelectedFriends] = useState<any>([]);

  function addNewMembersHandler() {
    const selectedNewMembers = [...new Set(selectedFriends)];
    for (var i = 0; i != newFriends.length; i++) {
      for (var j = 0; j != selectedNewMembers.length; j++) {
        if (newFriends[i].id == selectedNewMembers[j]) {
          const member = { ...newFriends[i], role: "member" }
          axios
            .post(ADD_MEMBER + selectedNewMembers[j], {
              room_id: selectedChat.id,
              room_password: "",
            })
            .then((res) => {
              dispatch({
                type: "ADD_MEMBER",
                data: member,
              });
            });
        }
      }
    }
    toggleNewMembers();
  }

  function isMember(id: any) {
    return newMembers.findIndex((m: any) => m.id == id) == -1 ? false : true;
  }

  useEffect(() => {
    const keyDownHandler = (event: any) => {
      if (event.key === "Escape") {
        event.preventDefault();
        toggleNewMembers();
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  });

  return (
    <VStack overflow={"auto"} position={"relative"} h={"100%"} w={"100%"}>
      <HStack overflow={"visible"} px={5} w={"100%"} m={0} spacing={8}>
        <Box as={"button"}>
          <ArrowBackIcon
            m={0}
            p={0}
            h={30}
            fontSize={25}
            onClick={toggleNewMembers}
          />
        </Box>
        <Text fontSize={20}>Add Members</Text>
      </HStack>
      <VStack
        pt={"1.5%"}
        h={"100%"}
        overflow={"auto"}
        w={"100%"}
        alignItems={"left"}
      >
        {newFriends.map((friend: any, key: any) =>
          !isMember(friend.id) ? (
            <NewMember
              id={friend.id}
              name={friend.name}
              avatar={friend.avatar}
              addMe={setSelectedFriends}
              key={key.toString()}
            />
          ) : undefined
        )}
      </VStack>
      {selectedFriends.length && (
        <Box
          position={"absolute"}
          right={4}
          bottom={4}
          rounded={30}
          onClick={addNewMembersHandler}
        >
          <Tooltip label="add Members" openDelay={500}>
            <IconButton
              fontSize={24}
              w={14}
              h={14}
              rounded={30}
              bg={"customPurple"}
              variant={"ghost"}
              aria-label={"add Members"}
              color={"white"}
              icon={<ArrowForwardIcon />}
            />
          </Tooltip>
        </Box>
      )}
    </VStack>
  );
}
