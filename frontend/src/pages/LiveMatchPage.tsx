import { Avatar, Badge, Box, Grid, GridItem, HStack, Icon, Text, useMediaQuery, useTheme, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';
import { IoEye } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { pagesContent, SOCKET } from '../constants';
import { usePageTitle } from '../hooks/usePageTitle';
import useWindowWidth from '../hooks/useWidth';
import { newNotification } from '../State/Action';
import { getUserInfo } from '../State/Api';
import { GlobalContext } from '../State/Provider';

export default function LiveMatchPage() {
    usePageTitle(pagesContent.watch.title);
    // general
    const theme = useTheme();
    const [isSmallScreen] = useMediaQuery(`(min-width: ${theme.breakpoints.md})`);
    // hooks
    const params = useParams();
    const navigate = useNavigate();
    // states
    const [user, setUser] = React.useState({
        username: '',
        avatar: '',
        login: '',
        score: 0,
    });
    const [opponent, setOpponent] = React.useState({
        username: '',
        avatar: '',
        login: '',
        score: 0,
    });
    const [canvasWidth, setCanvasWidth] = React.useState(800);
    const [watcher, setWatcher] = React.useState(0);
    // canvas
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    // context
    const { data, dispatch } = React.useContext<any>(GlobalContext);
    const { userInfo } = data;
    const width = useWindowWidth();

    // useEffect
    React.useEffect(() => {
        // socket
        const socket = io(`${SOCKET}/game`);
        // canvas
        const canvasTag = canvasRef?.current;
        const canvasContext = canvasRef?.current?.getContext('2d');

        // check for data
        if (!userInfo)
            getUserInfo(dispatch).catch((error) => {
                navigate(pagesContent.login.url);
            });
        else if (params?.room_name) {
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
            const opponentDisconnect = () => {
                dispatch(newNotification({ type: 'Info', message: 'Match has finished' }));
                navigate(pagesContent.home.url);
            };
            const notFound = () => {
                dispatch(newNotification({ type: 'Error', message: 'Room not found' }));
                navigate(pagesContent.home.url);
            };
            const notAllowed = () => {
                dispatch(newNotification({ type: 'Error', message: 'You are not allowed' }));
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
                const userData: any = Object.values(data.watchers[userInfo?.user_login]);
                const watchers: any = Object.keys(data.watchers);
                const infoData: any = Object.values(data.players);

                console.log('userData', userData);

                setWatcher(watchers.length);
                render(userData[0], userData[1], userData[2]);
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
                // setNewCanvasWidth(data.canvas.w);
            };
            socket.emit('watcher', {
                room_name: params?.room_name,
                user_login: userInfo?.user_login,
                canvas: getCanvasSize(),
            });
            // ------------------------------------------ game loop
            // on game
            socket.on('opponentDisconnect', opponentDisconnect);
            socket.on('game', game);
            socket.on('roomNotfound', notFound);
            socket.on('notAllowed', notAllowed);

            return () => {
                socket.disconnect();
                socket.off('opponentDisconnect', opponentDisconnect);
                socket.off('game', game);
                socket.off('roomNotfound', notFound);
                socket.off('notAllowed', notAllowed);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo, params?.room_name]);

    React.useEffect(() => {
        // socket
        const socket = io(`${SOCKET}/game`);
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
                    <motion.canvas width={canvasWidth} height="400" ref={canvasRef} />
                </Box>
                <Badge mt={5} borderRadius="full" fontSize="3xl" px={3}>
                    <HStack alignItems="center" spacing={3}>
                        <Icon as={IoEye} />
                        <Text>{watcher}</Text>
                    </HStack>
                </Badge>
            </VStack>
        </>
    );
}
