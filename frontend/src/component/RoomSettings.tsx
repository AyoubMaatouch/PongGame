import {
  Tooltip,
  useColorModeValue,
  Box,
  FormControl,
  FormLabel,
  HStack,
  Input,
  VStack,
  Text,
  Spacer,
  Button,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import ChangeAvatar from "./ChangeAvatar";
import DeleteRoom from "./DeleteRoom";
import { Radio, RadioGroup } from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import axios from "axios";
import { GROUP, pagesContent } from "../constants";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../State/ChatProvider";

type Props = {
  toggleSettings: () => void;
  roomId: string;
  oldRoomData: {
    name: string;
    type: string;
    password: string;
  };
};

const RoomSettings = ({ toggleSettings, roomId, oldRoomData }: Props) => {
  const [roomData, setRoomData] = useState<any>(oldRoomData);
  const [image, setImage] = useState(null);
  const [showPassword, setShowPassword] = useState<any>(false);
  const [showUpload, setShowUpload] = useState<any>(false);
  const { dispatch, state, setSelectedChat } = useContext<any>(ChatContext);
  const ROOMTYPE = {
    protected: "protected",
    private: "private",
    public: "public",
  };
  const navigate = useNavigate();

  const updateRoomNewInfo = () => {
    console.log(roomData);
    axios
      .patch(GROUP + roomId, {
        room_name: roomData.name,
        room_password: roomData.password,
        room_type: roomData.type,
      })
      .then((res) => {
        window.location.reload();
        // dispatch({
        //   type: "SET_GROUPS",
        //   data: [],
        // })
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (
      image != null ||
      (JSON.stringify(roomData) !== JSON.stringify(oldRoomData) &&
        roomData.name.length)
    ) {
      setShowUpload(true);
    } else setShowUpload(false);
  }, [roomData, image]);

  useEffect(() => {
    const keyDownHandler = (event: any) => {
      if (event.key === "Escape") {
        event.preventDefault();
        toggleSettings();
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  });

  return (
    <VStack w={"100%"} overflow={"auto"} position={"relative"} h={"100%"}>
      <HStack overflow={"visible"} px={4} w={"100%"} m={0} mb={6} spacing={8}>
        <Box as={"button"}>
          <ArrowBackIcon
            m={0}
            p={0}
            h={30}
            fontSize={25}
            onClick={toggleSettings}
          />
        </Box>
        <Text fontSize={20}>Edit</Text>
      </HStack>
      <VStack overflow={"auto"} w="100%" h={"100%"}>
        <ChangeAvatar tooltip="change the room avatar" callBack={setImage} />
        <FormControl p={5}>
          <FormLabel>Room name</FormLabel>
          <Input
            placeholder="Room name"
            type="text"
            value={roomData.name}
            onChange={(e: any) =>
              setRoomData({ ...roomData, name: e.target.value.trim() })
            }
          />
        </FormControl>
        <VStack w="100%" px={5} alignItems={"left"}>
          <Text>Room Type</Text>
          <RadioGroup
            value={roomData.type}
            onChange={(e: any) => setRoomData({ ...roomData, type: e })}
          >
            <VStack alignItems={"left"} spacing="24px">
              <Radio
                isDisabled={oldRoomData.type === ROOMTYPE.public ? true : false}
                value={ROOMTYPE.public}
              >
                {ROOMTYPE.public.charAt(0).toUpperCase() +
                  ROOMTYPE.public.slice(1)}
              </Radio>
              <Radio
                isDisabled={
                  oldRoomData.type === ROOMTYPE.private ? true : false
                }
                value={ROOMTYPE.private}
              >
                {ROOMTYPE.private.charAt(0).toUpperCase() +
                  ROOMTYPE.private.slice(1)}
              </Radio>
              <Radio
                isDisabled={
                  oldRoomData.type === ROOMTYPE.protected ? true : false
                }
                value={ROOMTYPE.protected}
              >
                {ROOMTYPE.protected.charAt(0).toUpperCase() +
                  ROOMTYPE.protected.slice(1)}
              </Radio>
            </VStack>
          </RadioGroup>
          {roomData.type === ROOMTYPE.protected && (
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  placeholder="New Password"
                  type={showPassword ? "text" : "password"}
                  pr="4.5rem"
                  value={roomData.password}
                  onChange={(e) =>
                    setRoomData({ ...roomData, password: e.target.value })
                  }
                />
                <InputRightElement width="4.5rem">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="password"
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
          )}
        </VStack>
        <Spacer />
        <DeleteRoom />
        {showUpload && (
          <Box
            position={"absolute"}
            right={4}
            bottom={4}
            rounded={30}
            onClick={updateRoomNewInfo}
          >
            <Tooltip label="Update Channel" openDelay={500}>
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
    </VStack>
  );
};

export default RoomSettings;
