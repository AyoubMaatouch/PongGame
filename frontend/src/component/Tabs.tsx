import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Box,
    Button,
    Flex,
    HStack,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs as ChakraTabs,
    Text,
    Tooltip,
    useColorModeValue,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import { Avatar as ChakraAvatar } from '@chakra-ui/avatar';
import { ChatContext } from '../State/ChatProvider';
import { AddIcon, CheckIcon } from '@chakra-ui/icons';
import FloatingActionButton from './FloatingActionButton';
import { AiOutlineUserAdd, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { RiLockPasswordFill } from 'react-icons/ri';
import { BsFillKeyFill } from 'react-icons/bs';
import axios from 'axios';
import { ADD_MEMBER, ALL_GROUPS, ALL_USERS, FRIENDS_URL, FRIEND_REQ, GROUP, MY_GROUPS, USER_URL } from '../constants';
import { GlobalContext } from '../State/Provider';

function Tabs() {
    const value = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
    const { setSelectedChat } = useContext<any>(ChatContext);
    const { friends, setFriends, groups } = useContext<any>(ChatContext);
    const { allUsers, setAllUsers } = React.useContext<any>(ChatContext);
    const { dispatch, state } = useContext<any>(ChatContext);
    const { newFriends, users, newGroups, allGroups } = state;

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [password, setPassword] = useState<any>('');
    const [group, setGroup] = useState<any>(null);
    const { data } = useContext<any>(GlobalContext);

    function isFriend(id: any) {
        if (!data.userInfo) return false;
        if (id === data.userInfo.user_id) return true;
        return newFriends.findIndex((f: any) => f.id == id) == -1 ? false : true;
    }

    function isMember(id: any) {
        for (var i = 0; i != newGroups.length; i++) {
            if (newGroups[i].id == id) return true;
        }
        return false;
    }

    function sendFriendReq(id: any) {
        const user = users.find((element: any) => element.user_id == id);
        console.log('send f req to: ', user);

        axios
            .post(FRIEND_REQ + id)
            .then((res) => {
                dispatch({
                    type: 'ADD_FRIEND',
                    data: {
                        id: user.user_id,
                        name: user.user_name,
                        avatar: user.user_avatar,
                    },
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function submit() {
        onClose();
        axios
            .post(ADD_MEMBER + data.userInfo.user_id, {
                room_id: group.id,
                room_password: password,
            })
            .then((res) => {
                dispatch({
                    type: 'ADD_GROUP',
                    data: {
                        id: group.id,
                        name: group.name,
                        avatar: group.avatar,
                        type: group.type,
                        password: group.password,
                    },
                });
                dispatch({
                    type: 'REMOVE_ALL_GROUPS',
                    data: group.id,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function joinGroup(room: any) {
        axios
            .post(ADD_MEMBER + data.userInfo.user_id, {
                room_id: room.id,
            })
            .then((res) => {
                dispatch({
                    type: 'ADD_GROUP',
                    data: {
                        id: room.id,
                        name: room.name,
                        avatar: room.avatar,
                        type: room.type,
                        password: room.password,
                    },
                });
                dispatch({
                    type: 'REMOVE_ALL_GROUPS',
                    data: room.id,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <>
            <HStack h={'100%'} w={'100%'}>
                <ChakraTabs
                    as={motion.div}
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ transition: { duration: 0.1 }, opacity: 0, scale: 0.99 }}
                    pt={3}
                    w={'90%'}
                    h={'99%'}
                    m={0}
                    overflow={'hidden'}
                    align="center"
                    _selected={{ color: 'pink' }}
                    position={'relative'}
                >
                    <TabList>
                        <Tab _selected={{ color: 'red' }}>
                            <Text fontSize={20}>Friends</Text>
                        </Tab>
                        <Tab _selected={{ color: 'red' }}>
                            <Text fontSize={20}>Channels</Text>
                        </Tab>
                        <Tab _selected={{ color: 'red' }}>
                            <Text fontSize={20}>All Users</Text>
                        </Tab>
                        <Tab _selected={{ color: 'red' }}>
                            <Text fontSize={20}>All Channels</Text>
                        </Tab>
                    </TabList>
                    <TabPanels h={'100%'} p={2}>
                        <TabPanel overflow={'auto'} h={'100%'} w={'100%'} m={0} p={0}>
                            <VStack pb={10} spacing={0} w={'100%'}>
                                {newFriends.length ? (
                                    newFriends.map((friend: any, index: any) => (
                                        <HStack
                                            as={'button'}
                                            p={5}
                                            alignItems={'center'}
                                            _hover={{ bg: value }}
                                            rounded={5}
                                            h={'4.5em'}
                                            w={'100%'}
                                            key={index.toString()}
                                            onClick={() => {
                                                setSelectedChat({ chat: 'F', id: friend.id });
                                            }}
                                        >
                                            <ChakraAvatar name={friend.name.toString()} src={friend.avatar.toString()}></ChakraAvatar>
                                            <Text>{friend.name.length > 10 ? friend.name.slice(0, 10) + '...' : friend.name}</Text>
                                        </HStack>
                                    ))
                                ) : (
                                    <Flex h={'100%'} justifyContent={'center'} alignItems={'center'}>
                                        <Text>No friends yet</Text>
                                    </Flex>
                                )}
                            </VStack>
                        </TabPanel>
                        <TabPanel h={'100%'} w={'100%'} m={0} p={0} overflow={'auto'}>
                            <VStack pb={10} spacing={0} w={'100%'}>
                                {newGroups.length ? (
                                    newGroups.map((group: any, index: any) => (
                                        <HStack
                                            onClick={() => {
                                                setSelectedChat({ chat: 'G', id: group.id });
                                            }}
                                            as={'button'}
                                            p={5}
                                            alignItems={'center'}
                                            _hover={{ bg: value }}
                                            rounded={5}
                                            h={'4.5em'}
                                            w={'100%'}
                                            key={index.toString()}
                                        >
                                            <ChakraAvatar name={group.name.toString()} src={group.avatar}></ChakraAvatar>
                                            <Text>{group.name.length > 10 ? group.name.slice(0, 10) + '...' : group.name}</Text>
                                        </HStack>
                                    ))
                                ) : (
                                    <Flex h={'100%'} justifyContent={'center'} alignItems={'center'}>
                                        <Text>No channels yet</Text>
                                    </Flex>
                                )}
                            </VStack>
                        </TabPanel>
                        <TabPanel h={'100%'} w={'100%'} m={0} p={0} overflow={'auto'}>
                            <VStack pb={10} spacing={0} w={'100%'}>
                                {users.length ? (
                                    users.map((user: any, index: any) =>
                                        !isFriend(user.user_id) ? (
                                            <HStack
                                                p={5}
                                                alignItems={'center'}
                                                _hover={{ bg: value }}
                                                rounded={5}
                                                h={'4.5em'}
                                                w={'100%'}
                                                key={index.toString()}
                                            >
                                                <ChakraAvatar name={user.user_name.toString()} src={user.user_avatar}></ChakraAvatar>
                                                <Text>
                                                    {user.user_name.length > 10 ? user.user_name.slice(0, 10) + '...' : user.user_name}
                                                </Text>
                                                <Tooltip label={'send Friend request'} openDelay={500}>
                                                    <IconButton
                                                        onClick={() => {
                                                            sendFriendReq(user.user_id);
                                                        }}
                                                        fontSize={18}
                                                        rounded={30}
                                                        color={'green'}
                                                        variant={'ghost'}
                                                        aria-label={'new channel'}
                                                        icon={<AiOutlineUserAdd />}
                                                    />
                                                </Tooltip>
                                            </HStack>
                                        ) : undefined
                                    )
                                ) : (
                                    <Flex h={'100%'} justifyContent={'center'} alignItems={'center'}>
                                        <Text>No Users yet</Text>
                                    </Flex>
                                )}
                            </VStack>
                        </TabPanel>
                        <TabPanel h={'100%'} w={'100%'} m={0} p={0} overflow={'auto'}>
                            <VStack pb={10} spacing={0} w={'100%'}>
                                {allGroups.length ? (
                                    allGroups.map((group: any, index: any) =>
                                        !isMember(group.id) ? (
                                            <HStack
                                                p={5}
                                                alignItems={'center'}
                                                _hover={{ bg: value }}
                                                rounded={5}
                                                h={'4.5em'}
                                                w={'100%'}
                                                key={index.toString()}
                                            >
                                                <ChakraAvatar name={group.name.toString()} src={group.avatar}></ChakraAvatar>
                                                <Text>{group.name.length > 10 ? group.name.slice(0, 10) + '...' : group.name}</Text>
                                                <Tooltip label={'Joing Room'} openDelay={500}>
                                                    <IconButton
                                                        onClick={() => {
                                                            setGroup({
                                                                id: group.id,
                                                                password: group.password,
                                                                type: group.type,
                                                                name: group.name,
                                                            });
                                                            if (group.type === 'protected') onOpen();
                                                            else
                                                                joinGroup({
                                                                    id: group.id,
                                                                    password: group.password,
                                                                    type: group.type,
                                                                    name: group.name,
                                                                });
                                                        }}
                                                        fontSize={18}
                                                        rounded={30}
                                                        color={'green'}
                                                        variant={'ghost'}
                                                        aria-label={'new channel'}
                                                        icon={<AiOutlineUsergroupAdd />}
                                                    />
                                                </Tooltip>
                                                {group.type === 'protected' && (
                                                    <Tooltip label={'Protected Room'} openDelay={500}>
                                                        <Box>
                                                            <BsFillKeyFill />
                                                        </Box>
                                                    </Tooltip>
                                                )}
                                            </HStack>
                                        ) : undefined
                                    )
                                ) : (
                                    <Flex h={'100%'} justifyContent={'center'} alignItems={'center'}>
                                        <Text>There is no groups in the website yet</Text>
                                    </Flex>
                                )}
                            </VStack>
                        </TabPanel>
                        <FloatingActionButton />
                    </TabPanels>
                </ChakraTabs>
                <Modal onClose={onClose} size="md" isOpen={isOpen} isCentered>
                    <ModalContent w={'20em'} h={'14em'} bg={value}>
                        <ModalHeader>Join Channel</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Input type="text" onChange={(e) => setPassword(e.target.value)} />
                        </ModalBody>
                        <ModalFooter pb={6}>
                            <Button variant={'ghost'} colorScheme="purple" mr={3} onClick={onClose}>
                                CANCEL
                            </Button>
                            <Button variant={'ghost'} color="customRed" mr={3} onClick={submit}>
                                SUBMIT
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </HStack>
        </>
    );
}

export default Tabs;
