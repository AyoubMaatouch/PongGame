import React from 'react';
import { Avatar, Button, Stack, useDisclosure, Text, Box, HStack } from '@chakra-ui/react';
import { io } from 'socket.io-client';
import { SOCKET } from '../constants';
// TYPE
type Props = {
    name: string;
    avatar: string;
    user_id: string;
    opponent_id: string;
};

const GameInvite = ({ name, avatar, user_id, opponent_id }: Props) => {
    const { onClose } = useDisclosure();
    const socket = io(`${SOCKET}/game`);

    const handleAccept = () => {
        socket.emit('acceptInvite', {
            opponent_id,
            user_id,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <Text fontWeight="bold" fontSize="xl" textAlign='center' mb={5}>
                    Invite you to play
                </Text>
                <HStack alignItems="center">
                    <Button variant={'ghost'} colorScheme="purple" mr={3} onClick={handleAccept}>
                        ACCEPT
                    </Button>
                    <Button variant={'ghost'} color="customRed" mr={3} onClick={onClose}>
                        CANCEL
                    </Button>
                </HStack>
            </Box>
        </Box>
    );
};

export default GameInvite;
