import React, { useContext, useEffect, useState } from 'react';
import { HStack, Input, useColorModeValue } from '@chakra-ui/react';
import { IoSend } from 'react-icons/io5';
import { ChatContext } from '../State/ChatProvider';
import { SOCKET } from '../constants';
import { io } from 'socket.io-client';
import { GlobalContext } from '../State/Provider';
import { newNotification } from '../State/Action';
import { Cookies } from 'react-cookie'


const MessageInput = () => {
    const globalDispatch = useContext<any>(GlobalContext).dispatch;
    const [typingMessage, setTypingMessage] = useState<any>('');
    const msgInputBg = useColorModeValue('white', 'rgb(33,33,33)');
    // const { socket } = useContext<any>(ChatContext);
    const { selectedChat } = useContext<any>(ChatContext);
    const { state } = useContext<any>(ChatContext);
    const { roomDm } = state;
    const { data } = React.useContext<any>(GlobalContext);
    const { userInfo } = data;

    function sendMessageHandler() {
        if (typingMessage.trim()) {
            const payload = {
                room_id: selectedChat.chat === 'F' ? roomDm : selectedChat.id,
                message: typingMessage.trim(),
                userId: userInfo.user_id,
            };
            const socket = io(SOCKET + '/dm', {

                extraHeaders: {
                    Authorization: document.cookie ? document.cookie.split('=')[1].split('%22')[3] : "",
                }
            });
            socket.emit('message', payload);
            socket.on('imMuted', (payload: any) => {
                globalDispatch(newNotification({ type: 'Error', message: 'You are muted for ' + payload.time + ' min' }));
            });
        }
        setTypingMessage('');
    }

    const keyDownHandler = (event: any) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            sendMessageHandler();
        }
    };

    return (
        <>
            <HStack w={'100%'} m={5} h={'3em'} spacing={4}>
                <Input
                    bg={msgInputBg}
                    value={typingMessage}
                    onChange={(m) => setTypingMessage(m.target.value)}
                    focusBorderColor="none"
                    border={'none'}
                    placeholder="Message"
                    w={'100%'}
                    onKeyDown={keyDownHandler}
                />
                <IoSend color={'rgb(132,119,218)'} onClick={sendMessageHandler} size={30} />
            </HStack>
        </>
    );
};

export default MessageInput;
