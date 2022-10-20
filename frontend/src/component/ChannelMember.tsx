import React, { useContext, useState } from "react";
import {
  useColorModeValue,
  Button,
  IconButton,
  HStack,
  Avatar,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { AiOutlineUserAdd, AiOutlineUserDelete } from "react-icons/ai";
import { BsClockHistory } from "react-icons/bs";
import { CheckIcon } from "@chakra-ui/icons";
import { ChatContext } from "../State/ChatProvider";
import { GrUserAdmin } from "react-icons/gr";
import { RiAdminLine } from "react-icons/ri";
import axios from "axios";
import { FRIEND_REQ, UPDATE_GROUP } from "../constants";

type Props = {
  name: string;
  avatar: string;
  isAdmin: boolean;
  isOwner: boolean;
  isFriend: boolean;
  id: string;
  onMute: () => void;
  onBlock: () => void;
  setMember: (params: any) => any;
  roomId: string;
  role: string;
};

function ChannelMemeber({
  id,
  name,
  avatar,
  isAdmin,
  onMute,
  onBlock,
  setMember,
  isFriend,
  isOwner,
  roomId,
  role,
}: Props) {
  const value = useColorModeValue("blackAlpha.200", "whiteAlpha.200");
  const [hover, setHover] = useState<any>(false);
  const { dispatch, state, selectedChat } = useContext<any>(ChatContext);

  const sendFriendReq = () => {
    axios
      .post(FRIEND_REQ + id)
      .then((res) => {
        dispatch({
          type: "ADD_FRIEND",
          data: {
            id: id,
            name: name,
            avatar: avatar,
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addNewAdmin = () => {
    axios
      .patch(UPDATE_GROUP + id, {
        room_id: roomId,
        room_status: "admin",
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <HStack
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      p={5}
      alignItems={"center"}
      rounded={5}
      h={"4.5em"}
      w={"100%"}
      _hover={{ bg: value }}
    >
      <Avatar name={name} src={avatar}></Avatar>
      <Text>{name}</Text>
      {hover && (
        <Tooltip
          label={isFriend ? "already Friend" : "send Friend request"}
          openDelay={500}
        >
          <IconButton
            onClick={isFriend ? undefined : sendFriendReq}
            fontSize={18}
            rounded={30}
            color={"green"}
            variant={"ghost"}
            aria-label={"new channel"}
            icon={isFriend ? <CheckIcon /> : <AiOutlineUserAdd />}
          />
        </Tooltip>
      )}
      {hover && (isAdmin || isOwner ) && (
        <>
          <Tooltip label={"remove Member"} openDelay={500}>
            <IconButton
              onClick={() => {
                setHover(false);
                setMember(() => {
                  return { id: id, name: name };
                });
                onBlock();
              }}
              ml={14}
              fontSize={18}
              rounded={30}
              color={"red"}
              variant={"ghost"}
              aria-label={"new channel"}
              icon={<AiOutlineUserDelete />}
            />
          </Tooltip>
          <Tooltip label={"mute Member"} openDelay={500}>
            <IconButton
              onClick={() => {
                setHover(false);
                setMember(() => {
                  return {
                    id: id,
                    name: name,
                  };
                });
                onMute();
              }}
              ml={14}
              fontSize={18}
              rounded={30}
              color={"customPurple"}
              variant={"ghost"}
              aria-label={"new channel"}
              icon={<BsClockHistory />}
            />
          </Tooltip>
        </>
      )}
      {hover && isOwner && (
        <Tooltip label={"add Admin"} openDelay={500}>
          <IconButton
            onClick={() => {
              setHover(false);
              addNewAdmin();
            }}
            ml={14}
            fontSize={18}
            rounded={30}
            color={"yellow"}
            variant={"ghost"}
            aria-label={"new channel"}
            // icon={<GrUserAdmin />}
            icon={<RiAdminLine />}
          />
        </Tooltip>
      )}
    </HStack>
  );
}

export default ChannelMemeber;
