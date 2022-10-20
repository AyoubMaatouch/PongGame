import React, { useContext, useEffect, useState } from 'react';
import ChatHeader from './ChatHeader';
import MessagesList from './MessagesList';
import MessageInput from './MessageInput';
import { useColorModeValue, VStack } from '@chakra-ui/react';
import { ChatContext } from '../State/ChatProvider';
import FriendMenu from './FriendMenu';
import GroupMenu from './GroupMenu';
import axios from 'axios';
import { DM, SOCKET } from '../constants';
import { io } from 'socket.io-client';
import { newNotification } from '../State/Action';
import { GlobalContext } from '../State/Provider';

function MessagingBox() {
    const { dispatch, state } = useContext<any>(ChatContext);
    const { newFriends, newGroups, roomDm } = state;
    const { selectedChat, setSelectedChat, toggleOffSelectedChat } = useContext<any>(ChatContext);
    const { toggleDetails } = useContext<any>(ChatContext);

    let searchIndex;
    if (selectedChat.chat === 'F') searchIndex = newFriends.findIndex((id: any) => selectedChat.id === id.id);
    else searchIndex = newGroups.findIndex((id: any) => selectedChat.id === id.id);

    useEffect(() => {
        const socket = io(SOCKET + '/dm');

        console.log('roomkjhkjhkjhDm', roomDm);
        console.log('selecgedChag', selectedChat.chat);

        if (selectedChat.chat === 'F') {
            axios
                .get(DM + selectedChat.id)
                .then((res: any) => {
                    console.log('ROOM', DM + selectedChat.id, res.data);
                    console.log('here:', res.data);
                    dispatch({
                        type: 'ROOM',
                        data: res.data.room_id,
                    });
                    if (roomDm !== '') {
                        socket.emit('ping', {
                            room_id: res.data.room_id,
                        });
                    }
                })
                .catch(() => {});
        } else {
            console.log('GROUP');
            socket.emit('ping', {
                room_id: selectedChat.id,
            });
        }

        socket.on('recieveMessage', (payload: any) => {
            console.log('socket on', payload);
            // if (payload.muted) {
            dispatch({
                type: 'ADD_MESSAGE',
                data: payload,
            });
            // }
        });

        return () => {
            socket.disconnect();
        };
    }, [roomDm]);

    useEffect(() => {
        const keyDownHandler = (event: any) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                console.log('Messaging');
                setSelectedChat(null);
            }
        };
        document.addEventListener('keydown', keyDownHandler);
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, []);

    // const chatBg = useColorModeValue("black", "black");
    return (
        <VStack h={'100%'} w={'100%'}>
            <ChatHeader
                avatarName={selectedChat.chat === 'G' ? newGroups[searchIndex].name.toString() : newFriends[searchIndex].name.toString()}
                chatName={selectedChat.chat === 'G' ? newGroups[searchIndex].name.toString() : newFriends[searchIndex].name.toString()}
                avatarSrc={selectedChat.chat === 'G' ? newGroups[searchIndex].avatar : newFriends[searchIndex].avatar}
                isGroup={selectedChat.chat === 'F' ? false : true}
                onClickCallBack={toggleDetails}
                backArrowCallBack={toggleOffSelectedChat}
                menu={selectedChat.chat === 'G' ? <GroupMenu /> : <FriendMenu />}
            />
            <VStack
                overflow={'auto'}
                maxW={'62em'}
                bgGradient={['linear(to-t, purple.3000, black)', `linear(to-b, red, black)`]}
                alignItems={'center'}
                h={'100%'}
                w={'100%'}
                flex={1}
                p={3}
                pb={1.5}
            >
                <VStack maxW={'100%'} flex={1} h={'100%'} w={'100%'} overflowY={'auto'} px={5}>
                    <MessagesList />
                </VStack>
                <MessageInput />
            </VStack>
        </VStack>
    );
}

export default MessagingBox;
