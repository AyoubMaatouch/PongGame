import {
    Badge, Button,
    Flex,
    Heading,
    List,
    ListItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Stack,
    Text,
    useDisclosure
} from '@chakra-ui/react';
import React from 'react';

// COMPONENTS
import { Card } from '../component/Card';
import { Line } from '../component/Line';
import { LiveMatch } from '../component/LiveMatch';

// HOOKS
import { usePageTitle } from '../hooks/usePageTitle';

// CONSTANTS
import { pagesContent, SOCKET } from '../constants';

// API
import { Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { updateLiveMatch } from '../State/Action';
import { getUserInfo } from '../State/Api';
import { GlobalContext } from '../State/Provider';

const HomePage = () => {
    // page title
    usePageTitle(pagesContent.profile.title);
    // CONTEXT
    const { data, dispatch } = React.useContext<any>(GlobalContext);
    // state
    const { liveMatch } = data;
    const [sliderValue, setSliderValue] = React.useState(10);
    // modal
    const { isOpen, onOpen, onClose } = useDisclosure();

    // redirect tosign In
    const navigate = useNavigate();

    // useEffect
    React.useEffect(() => {
        getUserInfo(dispatch)
            .then((info: any) => {
                if (!info?.updated) {
                    navigate(`${pagesContent.profile.url}/me`);
                }
            })
            .catch((error) => {
                navigate(pagesContent.login.url);
            });
        // socket
        const socket = io(`${SOCKET}/game`);

        // liveMatch
        const liveMatch = (data: any) => {
            dispatch(updateLiveMatch(data));
        };

        socket.emit('getLiveMatch');
        // get live match
        socket.on('liveMatch', liveMatch);
        return () => {
            socket.disconnect();
            socket.off('liveMatch', liveMatch);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Card w="100%" h="100%">
            <Stack justifyContent="space-around" h="100%" direction={{ lg: 'row', base: 'column' }} alignItems="center" spacing={10}>
                <Stack spacing={5} alignItems="center">
                    <Stack spacing={2} alignItems="center" w="100%">
                        <Heading fontSize="xl">Play</Heading>
                        <Line maxW="7rem" />
                    </Stack>
                    <Button
                        variant="solid"
                        bg="green"
                        color="blackAlpha.900"
                        borderRadius="2xl"
                        fontSize="xl"
                        size="xl"
                        py={2}
                        px={5}
                        fontWeight="light"
                        _focus={{
                            bg: 'green',
                        }}
                        _hover={{
                            bg: 'green',
                        }}
                        onClick={onOpen}
                    >
                        Join Queues
                    </Button>

                    <Modal isCentered closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent borderRadius="2xl">
                            <ModalHeader>
                                <Badge mb={8} borderRadius="full" px={3}>
                                    <Text fontSize="2xl">Please Slide Right 👉</Text>
                                </Badge>
                            </ModalHeader>
                            <ModalCloseButton borderRadius="xl" />
                            <ModalBody pb={6} px={10}>
                                <Slider
                                    aria-label="slider-ex-4"
                                    onChange={(v) => setSliderValue(v)}
                                    defaultValue={10}
                                    min={10}
                                    max={20}
                                    step={5}
                                >
                                    <SliderTrack bg="red.100" boxSize={15} borderRadius="full">
                                        <SliderFilledTrack bg="linear-gradient(90deg, rgba(252,176,69,1) 0%, rgba(253,29,29,1) 50%, rgba(131,58,180,1) 100%)" />
                                    </SliderTrack>
                                    <SliderThumb>
                                        <Heading lineHeight={1} fontSize="5xl">
                                            {sliderValue === 10 ? '🤓' : sliderValue === 15 ? '😮' : '😱'}
                                        </Heading>
                                    </SliderThumb>
                                </Slider>
                                <Flex justifyContent="center" mt={5}>
                                    <Link
                                        to={
                                            pagesContent.play.url +
                                            (sliderValue === 10 ? '/easy' : sliderValue === 15 ? '/normal' : '/hard')
                                        }
                                    >
                                        <Button
                                            borderRadius="2xl"
                                            fontSize="4xl"
                                            size="xl"
                                            py={2}
                                            px={5}
                                            fontWeight="bold"
                                            textTransform="uppercase"
                                        >
                                            {sliderValue === 10 ? 'Easy' : sliderValue === 15 ? 'Normal' : 'Hard'}
                                        </Button>
                                    </Link>
                                </Flex>
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                </Stack>
                <Stack spacing={5} alignItems="center" overflowY="auto" overflowX="hidden">
                    <Stack spacing={2} alignItems="center" w="100%">
                        <Heading fontSize="xl">Live Matches</Heading>
                        <Line maxW="7rem" />
                    </Stack>
                    {liveMatch && liveMatch.length ? (
                        <Stack p={5}>
                            <List spacing={5}>
                                {liveMatch.map((item: any, index: number) => {
                                    return (
                                        <ListItem key={index}>
                                            <LiveMatch match={item} />
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Stack>
                    ) : (
                        <Text fontSize="sm">No live match yet</Text>
                    )}
                </Stack>
            </Stack>
        </Card>
    );
};

export default HomePage;
