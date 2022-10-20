import React, { useContext } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

import {
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";
import { ChatContext } from "../State/ChatProvider";
import { RiPingPongFill } from "react-icons/ri";
import { AiOutlineUser } from "react-icons/ai";
import axios from "axios";
import { BLOCK_DM, pagesContent } from "../constants";
import { useNavigate } from "react-router-dom";

const FriendMenu = () => {
  const { selectedChat, setSelectedChat } = useContext<any>(ChatContext);
  const value = useColorModeValue("white", "lightBlack");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const { setFriends } = useContext<any>(ChatContext);
  const { dispatch } = useContext<any>(ChatContext);

  const blockUserHandler = () => {
    axios
      .post(BLOCK_DM + selectedChat.id)
      .then((response) => {
        dispatch({ type: "REMOVE_FRIEND", data: selectedChat.id });
        setSelectedChat(null);
      })
      .catch(() => {
        // navigate(pagesContent.chat.url);
        // setSelectedChat(null)
      });
    // setSelectedChat(null)
  };

  const inviteToGameHandler = () => {
    console.log("Invite to Game opp player id: ", selectedChat.id);
  };

  const viewProfileHandler = () => {
    console.log("view Profile Handler", selectedChat.id);
  };

  return (
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<BsThreeDotsVertical />}
          variant="ghost"
        />
        <MenuList>
          <MenuItem
            icon={<RiPingPongFill size={20} color={"yellow"} />}
            onClick={inviteToGameHandler}
          >
            <Text> Invite To Game</Text>
          </MenuItem>
          <MenuItem
            icon={<AiOutlineUser size={20} color={"green"} />}
            onClick={viewProfileHandler}
          >
            <Text> View Profile </Text>
          </MenuItem>
          <MenuItem
            icon={<MdDelete size={20} color={"#FF5C5C"} />}
            onClick={() => onOpen()}
          >
            <Text color={"customRed"}> Block User </Text>
          </MenuItem>
        </MenuList>
      </Menu>
      <Modal onClose={onClose} size="md" isOpen={isOpen} isCentered>
        <ModalContent w={"20em"} h={"10em"} bg={value}>
          <ModalHeader>Block User</ModalHeader>
          <ModalCloseButton />
          <ModalFooter pb={6}>
            <Button
              variant={"ghost"}
              colorScheme="purple"
              mr={3}
              onClick={onClose}
            >
              CANCEL
            </Button>
            <Button
              variant={"ghost"}
              color="customRed"
              mr={3}
              onClick={blockUserHandler}
            >
              BLOCK USER
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FriendMenu;
