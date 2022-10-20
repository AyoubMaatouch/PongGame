import { HamburgerIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Container,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    Show,
    Spacer,
    Stack,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import React from 'react';

import Logo from './logo';
import ToggleMode from './toggleMode';

import { Link, Outlet, useLocation } from 'react-router-dom';
import { pagesContent, SOCKET_STATUS, tabs } from '../constants';
import { io } from 'socket.io-client';
import { GlobalContext } from '../State/Provider';
import { setOnlineUsers } from '../State/Action';

export default function Navbar() {
    // const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [size, setSize] = React.useState<String>('md');

    // CONTEXT
    const { data, dispatch } = React.useContext<any>(GlobalContext);

    // state
    const { user_id } = data;

    const handleSizeClick = (newSize: String) => {
        setSize(newSize);
        onOpen();
    };
    const location = useLocation();

    React.useEffect(() => {
        const socket = io(`${SOCKET_STATUS}/userstate`, {
            query: {
                user_id: user_id,
            },
        });
        if (user_id) {
            const updatenline = (users: any) => {
                dispatch(setOnlineUsers(users));
            };

            socket.on('online', updatenline);
            socket.emit('onlinePing', updatenline);

            return () => {
                socket.off('online', updatenline);
                socket.disconnect();
            };
        }
    }, [user_id]);

    return (
        <Stack spacing={5} h="100%">
            <Flex mb={5} px={10} justifyContent={'right'} alignItems={'center'} overflow={'hideen'}>
                <Show above="md">
                    <Link to={pagesContent.home.url}>
                        <Logo />
                    </Link>
                </Show>
                <Show below="md">
                    <Button _hover={{ bg: 'green' }} onClick={() => handleSizeClick(size)}>
                        <HamburgerIcon />
                    </Button>
                </Show>
                <Modal onClose={onClose} size={'full'} isOpen={isOpen}>
                    <ModalContent _light={{ bg: 'white' }} _dark={{ bg: '#000' }}>
                        <ModalHeader>
                            <Link to={pagesContent.home.url}>
                                <Box onClick={onClose}>
                                    <Logo />
                                </Box>
                            </Link>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Flex justifyContent={'center'} alignItems={'center'} w={'100%'} h={'100%'}>
                                <Flex justifyContent={'center'} alignItems={'center'} display={'row'}>
                                    {tabs.map((tab, i) => (
                                        <Link to={tab.url} key={i.toString()}>
                                            <Text
                                                onClick={onClose}
                                                fontSize={'30px'}
                                                p={'10px'}
                                                color={location.pathname === tab.url ? 'red' : 'none'}
                                            >
                                                {tab.title}
                                            </Text>
                                        </Link>
                                    ))}
                                </Flex>
                            </Flex>
                        </ModalBody>
                    </ModalContent>
                </Modal>
                <Spacer />
                <Show above="md">
                    <Show above="sm">
                        <Flex
                            _dark={{ boxShadow: 'dark-lg' }}
                            _light={{ boxShadow: 'md' }}
                            rounded="20px"
                            justifyContent={'center'}
                            alignItems={'center'}
                            px={'20px'}
                        >
                            {tabs.map((tab, i) => (
                                <Link to={tab.url} key={i.toString()}>
                                    <Text
                                        px={['10px', '20px', '20px', '30px']}
                                        fontSize={'30px'}
                                        color={location.pathname === tab.url ? 'red' : 'none'}
                                    >
                                        {tab.title}
                                    </Text>
                                </Link>
                            ))}
                        </Flex>
                    </Show>
                </Show>
                <Spacer />
                <ToggleMode />
            </Flex>

            <Outlet />
        </Stack>
    );
}
