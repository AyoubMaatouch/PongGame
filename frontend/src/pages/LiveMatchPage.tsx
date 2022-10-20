import { Avatar, Badge, Box, Grid, GridItem, HStack, Icon, Text, useMediaQuery, useTheme, VStack } from '@chakra-ui/react';
import React from 'react';
import { IoEye } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { pagesContent, SOCKET } from '../constants';
import { usePageTitle } from '../hooks/usePageTitle';
import { newNotification } from '../State/Action';
import { getUserInfo } from '../State/Api';
// import GameContextProvider from '../State/GameProvider';
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
    const [canvasNewWidth, setNewCanvasWidth] = React.useState(0);
    const [watcher, setWatcher] = React.useState(0);
    // canvas
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    // context
    const { data, dispatch } = React.useContext<any>(GlobalContext);
    const { userInfo } = data;

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
            // ------------------------------------------ game
            // render the frame
            const render = (ball: any, user: any, opponent: any) => {
                drawFeild(0, 0, getCanvasSize().w, getCanvasSize().h);
                drawBall(ball.x, ball.y, ball.r);
                drawPlayer(user.x, user.y, user.w, user.h);
                drawPlayer(opponent.x, opponent.y, opponent.w, opponent.h);
            };
            const update = (data: any) => {
                setWatcher(data.watcher.length);
                render(data.ball, data.players[0].movement, data.players[1].movement);
                setOpponent({
                    username: data.players[1].username,
                    avatar: data.players[1].avatar,
                    login: data.players[1].login,
                    score: data.players[1].score,
                });
                setUser({
                    username: data.players[0].username,
                    avatar: data.players[0].avatar,
                    login: data.players[0].login,
                    score: data.players[0].score,
                });
                setNewCanvasWidth(data.canvas.w);
            };
            socket.emit('watcher', {
                room_name: params?.room_name,
            });
            // ------------------------------------------ game loop
            // on game
            socket.on('opponentDisconnect', opponentDisconnect);
            socket.on('onGame', update);
            socket.on('roomNotfound', notFound);

            return () => {
                socket.disconnect();
                socket.off('opponentDisconnect', opponentDisconnect);
                socket.off('onWatch', update);
                socket.off('roomNotfound', notFound);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo, params?.room_name]);

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
                <Box w="100%" flexDirection="column" display="flex" alignItems="center" justifyContent="center">
                    <canvas width={canvasNewWidth} height="400" ref={canvasRef}></canvas>
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
