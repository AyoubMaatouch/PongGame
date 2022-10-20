import React, { useContext } from 'react';
import { useColorModeValue, Box, FormControl, FormLabel, HStack, Input, VStack, Text, Spacer, useDisclosure } from '@chakra-ui/react';
import { MdDelete } from 'react-icons/md';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button } from '@chakra-ui/react';
import { ChatContext } from '../State/ChatProvider';

export default function DeleteRoom() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const value = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
    const { setSelectedChat, setChatDetails } = useContext<any>(ChatContext);

    const deleteRoom = () => {
        console.log('DELETE ROOM');
        onClose();
        setSelectedChat(null);
    };

    return (
        <HStack as={'button'} rounded={6} _hover={{ bg: value }} w={'100%'} p={4} alignItems={'center'} onClick={onOpen}>
            <MdDelete size={26} color={'#FF5C5C'} />
            <Text px={5} fontWeight={'bold'} color={'#FF5C5C'}>
                Delete Room
            </Text>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent w={'20em'}>
                    <ModalHeader>PongGame</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text mb={4}> Are you sure you want to delete and leave the group?</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant={'ghost'}
                            color="red"
                            mr={3}
                            onClick={deleteRoom}
                        >
                            DELETE ROOM
                        </Button>
                        <Button variant={'ghost'} colorScheme="purple" mr={3} onClick={onClose}>
                            CANCEL
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </HStack>
    );
}
