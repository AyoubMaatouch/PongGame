import { Avatar, Badge, Box, Flex, Grid, GridItem, HStack, Icon, Kbd, Spinner, Text, useMediaQuery, useTheme, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';
import { BsFillArrowDownSquareFill, BsFillArrowUpSquareFill } from 'react-icons/bs';
import { IoEye } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { pagesContent, SOCKET } from '../constants';
import { usePageTitle } from '../hooks/usePageTitle';
import useWindowWidth from '../hooks/useWidth';
import { clearGameWithFriend, clearOpponent, newNotification } from '../State/Action';
import { getUserInfo } from '../State/Api';
import { GlobalContext } from '../State/Provider';

export default function GamePage() {
    usePageTitle(pagesContent.play.title);
    // general
    const theme = useTheme();
    const [isSmallScreen] = useMediaQuery(`(min-width: ${theme.breakpoints.md})`);
    // hooks
    const params = useParams();
    const navigate = useNavigate();
    // states
    const [speedMode, setSpeedMode] = React.useState(0);
    const [watcher, setWatcher] = React.useState(0);
    const [canvasWidth, setCanvasWidth] = React.useState(800);
    const [play, setPlay] = React.useState(false);
    const [friend, setFriend] = React.useState(false);
    const [user, setUser] = React.useState({
        username: '',
        avatar: '',
        login: '',
        score: 0,
    });
    const [opponent, setOpponent] = React.useState({
        username: '?',
        avatar: '?',
        login: '?',
        score: 0,
    });
    const width = useWindowWidth();
    // canvas
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    // context
    const { data, dispatch } = React.useContext<any>(GlobalContext);
    const { userInfo, opponent_id, playing_with_friend } = data;

    // useEffect
    React.useEffect(() => {
        // socket
        const socket = io(`${SOCKET}/game`,
            {
                extraHeaders: {
                    Authorization: document.cookie ? document.cookie.split('=')[1].split('%22')[3] : "",
                }
            }
        );
        // canvas
        const canvasTag = canvasRef?.current;
        const canvasContext = canvasRef?.current?.getContext('2d');

        // ge the speeed
        const getTheSpeedMode = () => {
            const mode = params.speed_mode?.toLowerCase();
            if (mode === 'easy') setSpeedMode(15);
            else if (mode === 'normal') setSpeedMode(17);
            else if (mode === 'hard') setSpeedMode(20);
            else if (mode === 'f' && (opponent_id || playing_with_friend)) {
                if (!playing_with_friend) setFriend(true);
                setSpeedMode(15);
            } else navigate(pagesContent.home.url);
        };

        getTheSpeedMode();
        // check for data
        getUserInfo(dispatch).catch((error) => {
            navigate(pagesContent.login.url);
        });
        if (speedMode) {
            setUser({
                login: userInfo?.user_login,
                username: userInfo?.user_name,
                avatar: userInfo?.user_avatar,
                score: 0,
            });
            // get the canvas coordinate
            const getCanvasSize = () => {
                let w = 0;
                let h = 0;
                if (canvasTag) {
                    w = canvasTag.width;
                    h = canvasTag.height;
                }
                return {
                    w,
                    h,
                };
            };
            // ------------------------------------------ drawing
            // apply color
            const applyColor = (color: string) => {
                if (canvasContext) canvasContext.fillStyle = color;
            };
            // feild
            const drawFeild = (x: number, y: number, w: number, h: number) => {
                applyColor('#000');
                canvasContext?.fillRect(x, y, w, h);
            };
            // player
            const drawPlayer = (x: number, y: number, w: number, h: number) => {
                applyColor('#fff');
                canvasContext?.fillRect(x, y, w, h);
            };
            // ball
            const drawBall = (x: number, y: number, r: number) => {
                applyColor('#fff');
                canvasContext?.beginPath();
                canvasContext?.arc(x, y, r, 0, Math.PI * 2, false);
                canvasContext?.closePath();
                canvasContext?.fill();
            };
            // ------------------------------------------ socket
            const initGame = () => {
                if (friend) {
                    socket.emit('inviteToGame', {
                        opponent_id: opponent_id,
                        user_login: userInfo?.user_login,
                        user_id: userInfo?.user_id,
                        user_name: userInfo?.user_name,
                        user_avatar: userInfo?.user_avatar,
                        speed_mode: speedMode,
                        canvas: getCanvasSize(),
                    });
                } else if (playing_with_friend) {
                    socket.emit('gameWithFriend', {
                        opponent_id: opponent_id,
                        user_login: userInfo?.user_login,
                        user_id: userInfo?.user_id,
                        user_name: userInfo?.user_name,
                        user_avatar: userInfo?.user_avatar,
                        speed_mode: speedMode,
                        canvas: getCanvasSize(),
                        room_name: playing_with_friend,
                    });
                } else {
                    socket.emit('initGame', {
                        user_login: userInfo?.user_login,
                        user_id: userInfo?.user_id,
                        user_name: userInfo?.user_name,
                        user_avatar: userInfo?.user_avatar,
                        speed_mode: speedMode,
                        canvas: getCanvasSize(),
                    });
                }
            };
            const opponentDisconnect = () => {
                dispatch(newNotification({ type: 'Info', message: 'Player has left the game' }));
                navigate(pagesContent.home.url);
            };
            const gameEnded = (data: any) => {
                const infoData: any = Object.values(data.players);

                if (infoData[0].user_login === userInfo?.user_login) {
                    if (infoData[0].score > infoData[1].score)
                        dispatch(newNotification({ type: 'Success', message: '🎉🎉 Congratulation !! you have won the game 🎉🎉' }));
                    else dispatch(newNotification({ type: 'Info', message: '🤷🤷 You have lost the game... Try again 💪💪' }));
                } else if (infoData[1].user_login === userInfo?.user_login) {
                    if (infoData[1].score > infoData[0].score)
                        dispatch(newNotification({ type: 'Success', message: '🎉🎉 Congratulation !! you have won the game 🎉🎉' }));
                    else dispatch(newNotification({ type: 'Info', message: '🤷🤷 You have lost the game... Try again 💪💪' }));
                }
                navigate(pagesContent.home.url);
            };
            const notAllowed = () => {
                dispatch(newNotification({ type: 'Error', message: 'You are not allowed' }));
                navigate(pagesContent.home.url);
            };
            const cancelGame = () => {
                dispatch(newNotification({ type: 'Info', message: 'Invitation has been canceled' }));
                navigate(pagesContent.home.url);
            };
            // ------------------------------------------ game
            // render the frame
            const render = (ball: any, user: any, opponent: any) => {
                drawFeild(0, 0, getCanvasSize().w, getCanvasSize().h);
                drawBall(ball.x, ball.y, ball.r);
                drawPlayer(user.x, user.y, user.w, user.h);
                drawPlayer(opponent.x, opponent.y, opponent.w, opponent.h);
            };
            const game = (data: any) => {
                const userData: any = Object.values(data.players[userInfo?.user_login].members);
                const infoData: any = Object.values(data.players);
                const watchers: any = Object.keys(data.watchers);

                render(userData[0], userData[1], userData[2]);
                setWatcher(watchers.length);
                setPlay(true);
                setOpponent({
                    username: infoData[1].user_name,
                    avatar: infoData[1].user_avatar,
                    login: infoData[1].user_login,
                    score: infoData[1].score,
                });
                setUser({
                    username: infoData[0].user_name,
                    avatar: infoData[0].user_avatar,
                    login: infoData[0].user_login,
                    score: infoData[0].score,
                });
            };
            const moveKey = (event: KeyboardEvent) => {
                if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                    socket.emit('moveKey', {
                        key: event.key,
                        user_login: userInfo?.user_login,
                    });
                }
            };
            // ------------------------------------------ game loop
            // emit game
            initGame();
            // on game
            socket.on('opponentDisconnect', opponentDisconnect);
            socket.on('gameEnded', gameEnded);
            socket.on('game', game);
            socket.on('notAllowed', notAllowed);
            socket.on('cancelGame', cancelGame);

            // move
            document.addEventListener('keydown', moveKey);

            return () => {
                socket.disconnect();
                socket.off('opponentDisconnect', opponentDisconnect);
                socket.off('game', game);
                socket.off('gameEnded', gameEnded);
                socket.off('notAllowed', notAllowed);
                socket.off('cancelGame', cancelGame);
                document.removeEventListener('keydown', moveKey);
                dispatch(clearOpponent());
                dispatch(clearGameWithFriend());
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [speedMode]);

    React.useEffect(() => {
        // socket
        const socket = io(`${SOCKET}/game`, {
            extraHeaders: {
                Authorization: document.cookie ? document.cookie.split('=')[1].split('%22')[3] : "",
            }
        });
        //
        const containerTag = containerRef?.current;
        // canvas
        const canvasTag = canvasRef?.current;
        // get the canvas coordinate
        const getCanvasSize = () => {
            let w = 0;
            let h = 0;
            if (canvasTag) {
                w = canvasTag.width;
                h = canvasTag.height;
            }
            return {
                w,
                h,
            };
        };

        if (containerTag) {
            if (containerTag.offsetWidth > 800) {
                setCanvasWidth(800);
            } else {
                setCanvasWidth(containerTag.offsetWidth);
            }
        }
        if (userInfo)
            socket.emit('newCanvas', {
                canvas: getCanvasSize(),
                user_login: userInfo?.user_login,
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [containerRef, width]);
    return (
        <>
            <VStack alignContent="center" justifyContent="center">
                <Grid h="100%" templateColumns="repeat(8, 1fr)" gap={10}>
                    <GridItem colSpan={4}>
                        <HStack justifyContent="flex-end" spacing={10}>
                            <HStack justifyContent="flex-end" spacing={3}>
                                {isSmallScreen && <Text fontSize="xl">{user.username}</Text>}
                                <Avatar name={user.username} src={user.avatar} size="md" />
                            </HStack>
                            <Text fontSize="4xl">{user.score}</Text>
                        </HStack>
                    </GridItem>
                    <GridItem colSpan={4}>
                        <HStack justifyContent="flex-end" spacing={10}>
                            <Text fontSize="4xl">{opponent.score}</Text>
                            <HStack justifyContent="flex-end" spacing={3}>
                                <Avatar name={opponent.username} src={opponent.avatar} size="md" />
                                {isSmallScreen && <Text fontSize="xl">{opponent.username}</Text>}
                            </HStack>
                        </HStack>
                    </GridItem>
                </Grid>
                <Box w="100%" ref={containerRef} flexDirection="column" display="flex" alignItems="center" justifyContent="center">
                    {!play && (
                        <Flex w="100%" alignItems="center" h="10rem" justifyContent="center">
                            <Spinner></Spinner>
                        </Flex>
                    )}
                    <motion.canvas width={canvasWidth} height="400" ref={canvasRef} />
                </Box>
                {play && (
                    <Badge mt={5} borderRadius="full" fontSize="3xl" px={3}>
                        <HStack alignItems="center" spacing={3}>
                            <Icon as={IoEye} />
                            <Text>{watcher}</Text>
                        </HStack>
                    </Badge>
                )}
                <HStack spacing={2} mt={5}>
                    <Text>Use</Text>
                    <span>
                        <Kbd p={1}><Icon fontSize="LG" as={BsFillArrowUpSquareFill} /></Kbd>
                    </span>
                    <span>
                        <Kbd p={1}><Icon fontSize="LG" as={BsFillArrowDownSquareFill} /></Kbd>
                    </span>
                    <Text>to play</Text>
                </HStack>
            </VStack>
        </>
    );
}
