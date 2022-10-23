import React, { useContext, useEffect } from 'react';
import { Avatar, AvatarBadge, HStack, Icon, Spacer, Text, VStack } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { GlobalContext } from '../State/Provider';
import { ChatContext } from '../State/ChatProvider';
import { motion } from 'framer-motion';
import { RiPingPongFill } from 'react-icons/ri';

type Props = {
    avatarName: string;
    avatarSrc: string;
    chatName: string;
    isGroup: boolean;
    onClickCallBack: () => void;
    backArrowCallBack: () => void;
    menu: JSX.Element;
};

function ChatHeader({ avatarName, avatarSrc, chatName, isGroup, onClickCallBack, backArrowCallBack, menu }: Props) {
    const { data } = React.useContext<any>(GlobalContext);
    const { online, on_game } = data;
    const { selectedChat } = useContext<any>(ChatContext);
    const isOnline = (user_id: string) => {
        for (let i = 0; i < online.length; i++) {
            const user = online[i];
            if (user.user_id.toString() === user_id.toString()) return true;
        }
        return false;
    };

    const isOnGame = (user_id: string) => {
        for (let i = 0; i < on_game.length; i++) {
            const user = on_game[i];
            if (user && user.toString() === user_id.toString()) return true;
        }
        return false;
    };

    return (
        <HStack w={'100%'} mr={5}>
            <HStack
                onClick={() => (isGroup ? onClickCallBack() : undefined)}
                as={isGroup ? 'button' : undefined}
                px={5}
                w={'100%'}
                m={0}
                h={''}
            >
                <ArrowBackIcon m={0} mr={25} p={0} h={30} fontSize={25} onClick={() => backArrowCallBack()} />
                <Avatar name={avatarName} src={avatarSrc}></Avatar>
                <VStack spacing={0} alignItems="left">
                    <Text>{chatName.length > 10 ? chatName.slice(0, 10) + '...' : chatName}</Text>
                    {selectedChat.chat === 'F' &&
                        (isOnGame(selectedChat.id) ? (
                            <Text fontWeight={'lighter'} fontSize={'xs'} color="blue.500">
                                on game 🏓
                            </Text>
                        ) : (
                            <Text fontWeight={'lighter'} fontSize={'xs'} color={isOnline(selectedChat.id) ? 'green' : 'red'}>
                                {isOnline(selectedChat.id) ? 'Online' : 'Offline'}
                            </Text>
                        ))}
                </VStack>
            </HStack>
            <Spacer />
            {menu}
        </HStack>
    );
}

export default ChatHeader;
