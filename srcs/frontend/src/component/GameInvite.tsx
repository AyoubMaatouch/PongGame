import React from 'react';
import { Avatar, Button, Stack, useDisclosure, Text, Box, HStack } from '@chakra-ui/react';
import { pagesContent, SOCKET } from '../constants';
import { GlobalContext } from '../State/Provider';
import { useNavigate } from 'react-router-dom';
import { gameWithFriend } from '../State/Action';
import { io } from 'socket.io-client';
// TYPE
type Props = {
    name: string;
    avatar: string;
    user_id: string;
    opponent_id: string;
    room_name: string;
    setInvite: (va: boolean) => void;
};

const GameInvite = ({ setInvite, name, avatar, room_name, opponent_id }: Props) => {
    const navigate = useNavigate();
    const { dispatch } = React.useContext<any>(GlobalContext);

    const handleAccept = () => {
        dispatch(gameWithFriend(room_name));
        setInvite(false);
        navigate(`${pagesContent.play.url}/f`);
    };

    const handleCancel = () => {
        const socket = io(`${SOCKET}/game`,{
            extraHeaders: {
                Authorization: document.cookie ? document.cookie.split('=')[1].split('%22')[3] : "",
            }
        });

        socket.emit('canceInvite', {
            room_name
        })
        setInvite(false);
    };

    return (
        <Box position="fixed" top={0} right={0} w="100%" h="100%" zIndex={1000} bg="rgba(0,0,0,.7)">
            <Box position="fixed" top="50%" right="50%" transform="translate(50%, -50%)">
                <Stack alignItems="center" mb={5}>
                    <Avatar name={name} src={avatar} size="2xl" />
                    <Text fontWeight="bold" fontSize="4xl">
                        {name}
                    </Text>
                </Stack>
                <Text fontWeight="bold" fontSize="xl" textAlign="center" mb={5}>
                    Invite you to play
                </Text>
                <HStack alignItems="center">
                    <Button variant={'ghost'} colorScheme="purple" mr={3} onClick={handleAccept}>
                        ACCEPT
                    </Button>
                    <Button variant={'ghost'} color="customRed" mr={3} onClick={handleCancel}>
                        CANCEL
                    </Button>
                </HStack>
            </Box>
        </Box>
    );
};

export default GameInvite;
