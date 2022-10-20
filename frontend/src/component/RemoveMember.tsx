import React, { useContext } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { Text, Button } from "@chakra-ui/react";
import axios from "axios";
import { BLOCK_MEMBER, FRIEND_REQ } from "../constants";
import { ChatContext } from "../State/ChatProvider";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  memberId: string;
  roomId: string;
};

export default function RemoveMember({
  isOpen,
  onClose,
  name,
  memberId,
  roomId,
}: Props) {
  const { dispatch, state, selectedChat } = useContext<any>(ChatContext);

  const blockMemberHandler = () => {
    console.log(`remove ${name}, id : ${memberId} from room: ${roomId}`);
    axios
      .post(BLOCK_MEMBER + memberId, {
        room_id: roomId
      })
      .then((res) => {
        dispatch({
          type: "REMOVE_MEMBER",
          data: memberId,
        });
      })
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent w={"20em"}>
        <ModalHeader>Remove User</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4}> Remove {name} from the room? </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            variant={"ghost"}
            color="red"
            mr={3}
            onClick={() => {
              blockMemberHandler();
              onClose();
            }}
          >
            REMOVE
          </Button>
          <Button
            variant={"ghost"}
            colorScheme="purple"
            mr={3}
            onClick={() => {
              onClose();
            }}
          >
            CANCEL
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
