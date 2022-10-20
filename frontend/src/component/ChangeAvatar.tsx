import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { RiImageAddFill } from "react-icons/ri";

type Props = {
  callBack: any;
  tooltip: string;
};

function ChangeAvatar({ callBack, tooltip}: Props) {
  const [img, setImg] = useState();
  let file: any = null;
  const onImageChange = (e: any) => {
    const [f] = e.target.files;
    callBack(f);
    // @ts-ignore
    setImg(URL.createObjectURL(f));
  };
  return (
    <Box>
      <Tooltip label={tooltip} openDelay={500}>
        <Box
          w={120}
          h={120}
          position={"relative"}
          bg={"customPurple"}
          rounded={"50%"}
        >
          <Avatar
            icon={<RiImageAddFill color={"white"} size={46} />}
            w={"100%"}
            h={"100%"}
            size={"xl"}
            position={"absolute"}
            src={img}
            bg={"customPurple"}
            onClick={() => file!.click()}
          />
          <input
            accept={"image/*"}
            style={{ display: "none" }}
            ref={(f) => (file = f)}
            type={"file"}
            onChange={onImageChange}
          />
        </Box>
      </Tooltip>
    </Box>
  );
}

export default ChangeAvatar;
