import React, {useContext, useEffect} from 'react';
import {
    Avatar,
    HStack,
    Spacer,
    Text,
} from '@chakra-ui/react';
import {ArrowBackIcon} from '@chakra-ui/icons';

type Props ={
    avatarName: string,
    avatarSrc: string,
    chatName: string,
    isGroup: boolean,
    onClickCallBack: () => void,
    backArrowCallBack: () => void,
    menu: JSX.Element,
}

function ChatHeader({avatarName, avatarSrc, chatName, isGroup, onClickCallBack, backArrowCallBack, menu}:Props) {
    return (
        <HStack w={'100%'} mr={5}>
            <HStack onClick={() => isGroup ? onClickCallBack() : undefined} as={isGroup ? 'button' : undefined} px={5} w={'100%'} m={0} h={''}>
                <ArrowBackIcon m={0} mr={25} p={0} h={30} fontSize={25} onClick={() => backArrowCallBack()}/>
                <Avatar name={avatarName} src={avatarSrc} ></Avatar>
                <Text>{chatName.length > 10 ? chatName.slice(0, 10) + "..." : chatName}</Text>
            </HStack>
            <Spacer/>
            {menu}
        </HStack>
    );
}

export default ChatHeader;
