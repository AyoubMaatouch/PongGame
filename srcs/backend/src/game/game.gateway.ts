import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import {
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server, Namespace } from 'socket.io';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import { threadId } from 'worker_threads';
import { GameService } from './game.service';
import { AuthService } from '../auth/auth.service';

// @UseGuards(AuthGuard('jwt'))
@WebSocketGateway(3003, {
    cors: {
        origin: '*',
        credentials: true,
    },
    namespace: 'game',
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    accessJwtStrategy: any;
    constructor(private GameService: GameService, private authService: AuthService ) { }
    @WebSocketServer()
    io: Namespace;
    rooms: {};
    canvas: {};
    PLAYER_HEIGHT = 80;
    PLAYER_WIDTH = 10;
    BALL_RADIUS = 7;
    FRAME_PER_SEC = 50;
    STEP = 20;

    // UTILE
    // get the key of an empty room by speedmode
    getKeyByAvalaibleRoom(rooms_name: string[], speed_mode: number) {
        for (let i = 0; i < rooms_name.length; i++) {
            const room = rooms_name[i];

            if (this.rooms[room].speed_mode === speed_mode && !this.rooms[room].isFull && this.rooms[room].isRandom) {
                return room;
            }
        }

        return null;
    }

    // create a new room
    newRoom(speed_mode: number) {
        const name = uniqueNamesGenerator({
            dictionaries: [adjectives, colors, animals],
        });

        this.rooms[name] = {
            isFull: false,
            isRandom: true,
            watchers: {},
            speed_mode: speed_mode,
            intervalID: 0,
            player_guest: 0,
            players: {},
        };

        return name;
    }

    // create a new player
    liveMatch() {
        // data
        var matchs = [];
        var rooms_name = Object.keys(this.rooms);

        // get
        for (let i = 0; i < rooms_name.length; i++) {
            // -----
            const room_name = rooms_name[i];

            // ---
            if (this.rooms[room_name].isFull) {
                var players_name: any = Object.keys(this.rooms[rooms_name[i]].players);
                var players_data: any = Object.values(this.rooms[rooms_name[i]].players);

                matchs.push({
                    room_name: room_name,
                    p0: {
                        username: players_name[0],
                        avatar: players_data[0].user_avatar,
                    },
                    p1: {
                        username: players_name[1],
                        avatar: players_data[1].user_avatar,
                    },
                });
            }
        }
        this.io.emit('liveMatch', matchs);
    }

    // create a new player
    onGame() {
        // data
        var games = [];
        var rooms_name = Object.keys(this.rooms);

        // get
        for (let i = 0; i < rooms_name.length; i++) {
            var players_name: any = Object.values(this.rooms[rooms_name[i]].players);
            players_name.forEach(ele => {
                games.push(ele.user_id);
            });
        }
        this.io.emit('onGame', games);
    }

    // create a new player
    newPlayer(user_id: string, user_login: string, user_name: string, user_avatar: string, socket_id: string) {
        return {
            user_id: user_id,
            user_name: user_name,
            user_login: user_login,
            user_avatar: user_avatar,
            socket_id: socket_id,
            score: 0,
            members: {
                ball: {
                    x: 0,
                    y: 0,
                    r: 0,
                    d: {
                        x: 0,
                        y: 0,
                    },
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                },
            },
        };
    }

    // init ball for players
    initBallPlayers(players_name: string[], room_name: string, START_DIRECTION: number, PLAYER_STARTER: number) {
        players_name.forEach((player_login: string) => {
            // variables
            const cn = this.canvas[player_login];
            const d = PLAYER_STARTER;
            const o = START_DIRECTION;
            const s = this.rooms[room_name].speed_mode / 1000;

            // x - y
            this.rooms[room_name].players[player_login].members.ball.x = this.canvas[player_login].w / 2;
            this.rooms[room_name].players[player_login].members.ball.y = this.canvas[player_login].h / 2;
            this.rooms[room_name].players[player_login].members.ball.r = this.BALL_RADIUS;

            // direction
            this.rooms[room_name].players[player_login].members.ball.d.x = d * s * cn.w * Math.cos(o * (Math.PI / 4));
            this.rooms[room_name].players[player_login].members.ball.d.y = d * s * cn.h * Math.sin(o * (Math.PI / 4));

            // corners
            this.rooms[room_name].players[player_login].members.ball.top = 0;
            this.rooms[room_name].players[player_login].members.ball.bottom = 0;
            this.rooms[room_name].players[player_login].members.ball.left = 0;
            this.rooms[room_name].players[player_login].members.ball.right = 0;
        });
    }

    // init ball for watcher
    initBallWatcher(watcher_name: string[], room_name: string, START_DIRECTION: number, PLAYER_STARTER: number) {
        watcher_name.forEach((watcher_login: string) => {
            // variables
            const cn = this.canvas[watcher_login];
            const d = PLAYER_STARTER;
            const o = START_DIRECTION;
            const s = this.rooms[room_name].speed_mode / 1000;

            // x - y
            this.rooms[room_name].watchers[watcher_login].ball.x = this.canvas[watcher_login].w / 2;
            this.rooms[room_name].watchers[watcher_login].ball.y = this.canvas[watcher_login].h / 2;
            this.rooms[room_name].watchers[watcher_login].ball.r = this.BALL_RADIUS;

            // direction
            this.rooms[room_name].watchers[watcher_login].ball.d.x = d * s * cn.w * Math.cos(o * (Math.PI / 4));
            this.rooms[room_name].watchers[watcher_login].ball.d.y = d * s * cn.h * Math.sin(o * (Math.PI / 4));

            // corners
            this.rooms[room_name].watchers[watcher_login].ball.top = 0;
            this.rooms[room_name].watchers[watcher_login].ball.bottom = 0;
            this.rooms[room_name].watchers[watcher_login].ball.left = 0;
            this.rooms[room_name].watchers[watcher_login].ball.right = 0;
        });
    }

    // init all ball
    initBall(room_name: string) {
        // const
        const START_DIRECTION = Math.random() - 1;
        const PLAYER_STARTER = Math.random() > 0.5 ? 1 : -1;

        // var
        const players_name = Object.keys(this.rooms[room_name].players);
        const watcher_name = Object.keys(this.rooms[room_name].watchers);

        // ball data
        this.initBallPlayers(players_name, room_name, START_DIRECTION, PLAYER_STARTER);
        this.initBallWatcher(watcher_name, room_name, START_DIRECTION, PLAYER_STARTER);
    }

    // init members
    initMembers(room_name: string) {
        const players_name = Object.keys(this.rooms[room_name].players);
        players_name.forEach((player_login: string) => {
            var i = 0;

            players_name.forEach((member_login: string) => {
                this.rooms[room_name].players[player_login].members[member_login] =
                    i === 1
                        ? {
                            x: this.canvas[player_login].w - this.PLAYER_WIDTH * (3 / 2),
                            y: (this.canvas[player_login].h - this.PLAYER_HEIGHT) / 2,
                            w: this.PLAYER_WIDTH,
                            h: this.PLAYER_HEIGHT,
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }
                        : {
                            x: this.PLAYER_WIDTH / 2,
                            y: (this.canvas[player_login].h - this.PLAYER_HEIGHT) / 2,
                            w: this.PLAYER_WIDTH,
                            h: this.PLAYER_HEIGHT,
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        };
                i++;
            });
        });
    }

    // move the room players
    movePlayers(players_name: string[], room_name: string) {
        players_name.forEach((player_login: string) => {
            // x
            this.rooms[room_name].players[player_login].members.ball.x += this.rooms[room_name].players[player_login].members.ball.d.x;

            // y
            this.rooms[room_name].players[player_login].members.ball.y += this.rooms[room_name].players[player_login].members.ball.d.y;
        });
    }

    // move the room watcher
    moveWatchers(watcher_name: string[], room_name: string) {
        watcher_name.forEach((watcher_login: string) => {
            // x
            this.rooms[room_name].watchers[watcher_login].ball.x += this.rooms[room_name].watchers[watcher_login].ball.d.x;
            // y
            this.rooms[room_name].watchers[watcher_login].ball.y += this.rooms[room_name].watchers[watcher_login].ball.d.y;
        });
    }

    // updateMatchHistory
    updateMatchHistory(player_1: any, player_2: any) {
        this.GameService.pushScore({
            userId: player_1.user_id,
            user_score: player_1.score,
            opponent_id: player_2.user_id,
            opponent_score: player_2.score,
        });
    }

    // updateMatchHistory
    updatePlayerStatistic(player_1: any, player_2: any) {
        this.GameService.updateUserStatisticsData({
            userId: player_1.user_id,
            games_lost: player_1.score < player_2.score ? 1 : 0,
            games_won: player_1.score > player_2.score ? 1 : 0,
            games_drawn: player_1.score === player_2.score ? 1 : 0,
        });
    }

    // check the score
    checkScore(room_name: string, players_name1: string, players_name2: string) {
        if (this.rooms[room_name].players[players_name1].score === 5 || this.rooms[room_name].players[players_name2].score === 5) {
            // clear the interval
            clearInterval(this.rooms[room_name].intervalID);

            // emit game ended to room
            this.io.to(room_name).emit('gameEnded', this.rooms[room_name]);

            return true;
        }
        return false;
    }

    // update the databse
    updateDB(players: any) {
        this.updateMatchHistory(players[0], players[1]);
        this.updatePlayerStatistic(players[0], players[1]);
        this.updatePlayerStatistic(players[1], players[0]);
    }

    // bounce through the y axis
    bouncePlayersY(players_name: string[], room_name: string) {
        players_name.forEach((player_login: string) => {
            const b = this.rooms[room_name].players[player_login].members.ball;
            const cn = this.canvas[player_login];

            if (b.y + b.r > cn.h || b.y - b.r < 0) {
                this.rooms[room_name].players[player_login].members.ball.d.y = -b.d.y;
            }
        });
    }

    // bounce through the y axis
    bounceWatchersY(watcher_name: string[], room_name: string) {
        watcher_name.forEach((watcher_login: string) => {
            if (
                this.rooms[room_name].watchers[watcher_login].ball.y + this.rooms[room_name].watchers[watcher_login].ball.r >
                this.canvas[watcher_login].h ||
                this.rooms[room_name].watchers[watcher_login].ball.y - this.rooms[room_name].watchers[watcher_login].ball.r < 0
            ) {
                this.rooms[room_name].watchers[watcher_login].ball.d.y *= -1;
            }
        });
    }

    // bounce through the x axis
    bouncePlayersX(players: any, room_name: string) {
        const b1 = players[0].members.ball;
        const b2 = players[1].members.ball;
        const cn1 = this.canvas[players[0].user_login];
        const cn2 = this.canvas[players[1].user_login];

        if (b1.x + b1.r > cn1.w || b2.x + b2.r > cn2.w) {
            this.rooms[room_name].players[players[0].user_login].score++;
            this.initBall(room_name);
        } else if (b1.x - b1.r < 0 || b2.x - b2.r < 0) {
            this.rooms[room_name].players[players[1].user_login].score++;
            this.initBall(room_name);
        }
    }

    // update the check
    updateScore(players: any, players_name: string[], room_name: string) {
        if (this.checkScore(room_name, players_name[0], players_name[1])) {
            this.updateDB(players);
            return true;
        }
        return false;
    }

    // collision
    collision(room_name: string, player_login: string, member: string) {
        // topp
        this.rooms[room_name].players[player_login].members.ball.top =
            this.rooms[room_name].players[player_login].members.ball.y - this.rooms[room_name].players[player_login].members.ball.r;

        // bottom
        this.rooms[room_name].players[player_login].members.ball.bottom =
            this.rooms[room_name].players[player_login].members.ball.y + this.rooms[room_name].players[player_login].members.ball.r;

        // left
        this.rooms[room_name].players[player_login].members.ball.left =
            this.rooms[room_name].players[player_login].members.ball.x - this.rooms[room_name].players[player_login].members.ball.r;

        // right
        this.rooms[room_name].players[player_login].members.ball.right =
            this.rooms[room_name].players[player_login].members.ball.x + this.rooms[room_name].players[player_login].members.ball.r;

        // player top
        this.rooms[room_name].players[player_login].members[member].top = this.rooms[room_name].players[player_login].members[member].y;

        // player bottom
        this.rooms[room_name].players[player_login].members[member].bottom =
            this.rooms[room_name].players[player_login].members[member].y + this.rooms[room_name].players[player_login].members[member].h;

        // player left
        this.rooms[room_name].players[player_login].members[member].left = this.rooms[room_name].players[player_login].members[member].x;

        // player right
        this.rooms[room_name].players[player_login].members[member].right =
            this.rooms[room_name].players[player_login].members[member].x + this.rooms[room_name].players[player_login].members[member].w;

        return (
            //
            this.rooms[room_name].players[player_login].members.ball.bottom >
            this.rooms[room_name].players[player_login].members[member].top &&
            //

            this.rooms[room_name].players[player_login].members.ball.right >
            this.rooms[room_name].players[player_login].members[member].left &&
            //

            this.rooms[room_name].players[player_login].members.ball.left <
            this.rooms[room_name].players[player_login].members[member].right &&
            //

            this.rooms[room_name].players[player_login].members.ball.top <
            this.rooms[room_name].players[player_login].members[member].bottom
        );
    }

    // direction
    direction(players_name: string[], watcher_name: string[], room_name: string) {
        players_name.forEach((player_login: string) => {
            const member =
                this.rooms[room_name].players[player_login].members.ball.x < this.canvas[player_login].w / 2
                    ? players_name[0]
                    : players_name[1];

            if (this.collision(room_name, player_login, member)) {
                // variables
                const b = this.rooms[room_name].players[player_login].members.ball;
                const p = this.rooms[room_name].players[player_login].members[member];

                // calc
                const cn = this.canvas[player_login];
                const o = (b.y - (p.y + p.h / 2)) / (p.h / 2);
                const d = b.x < cn.w / 2 ? 1 : -1;
                const s = this.rooms[room_name].speed_mode / 1000;

                this.rooms[room_name].players[player_login].members.ball.d.x = d * s * cn.w * Math.cos(o * (Math.PI / 4));
                this.rooms[room_name].players[player_login].members.ball.d.y = d * s * cn.h * Math.sin(o * (Math.PI / 4));

                watcher_name.forEach((watcher_login: string) => {
                    const cn = this.canvas[watcher_login];

                    this.rooms[room_name].watchers[watcher_login].ball.d.x = d * s * cn.w * Math.cos(o * (Math.PI / 4));
                    this.rooms[room_name].watchers[watcher_login].ball.d.y = d * s * cn.h * Math.sin(o * (Math.PI / 4));
                });
            }
        });
    }

    updatePlayer(room_name: string) {
        Object.keys(this.rooms[room_name].players).forEach((player_name: string) => {

            const member = Object.keys(this.rooms[room_name].players[player_name].members);
            this.rooms[room_name].players[player_name].members[member[1]].x = 0;
            this.rooms[room_name].players[player_name].members[member[2]].x = this.canvas[player_name].w - this.PLAYER_WIDTH * (3 / 2);
        });
    }

    // update the game
    update(room_name: string): void {
        // variables
        const players_body = Object.values(this.rooms[room_name].players);
        const players_name = Object.keys(this.rooms[room_name].players);
        const watcher_name = Object.keys(this.rooms[room_name].watchers);

        if (this.updateScore(players_body, players_name, room_name)) return;

        this.movePlayers(players_name, room_name);
        this.moveWatchers(watcher_name, room_name);
        this.updatePlayer(room_name);

        this.direction(players_name, watcher_name, room_name);
        this.bouncePlayersX(players_body, room_name);

        this.bouncePlayersY(players_name, room_name);
        this.bounceWatchersY(watcher_name, room_name);
    }

    // frame the game
    render(room_name: string) {
        this.update(room_name);
        if (this.rooms[room_name]) {
            this.io.to(room_name).emit('game', this.rooms[room_name]);
        }
    }

    // start playing
    play(room_name: string) {
        this.rooms[room_name].intervalID = setInterval(() => {
            this.render(room_name);
        }, 1000 / this.FRAME_PER_SEC);
    }

    // get the roomname
    getRoomName(player_login: string) {
        for (const room_name in this.rooms) {
            if (Object.prototype.hasOwnProperty.call(this.rooms, room_name)) {
                const room = this.rooms[room_name];

                if (Object.keys(room.players).includes(player_login)) return room_name;
            }
        }
        return null;
    }

    // get the roomname
    getRoomNameBySocket(socket_id: string) {
        for (const room_name in this.rooms) {
            if (Object.prototype.hasOwnProperty.call(this.rooms, room_name)) {
                const room = this.rooms[room_name];
                const players = Object.values(room.players);
                for (let i = 0; i < players.length; i++) {
                    const player: any = players[i];
                    if (player.socket_id === socket_id) return room_name;
                }
            }
        }
        return null;
    }

    getRoomNameBySocket2(socket_id: string) {
        for (const room_name in this.rooms) {
            if (Object.prototype.hasOwnProperty.call(this.rooms, room_name)) {
                const room = this.rooms[room_name];
                const watchers = Object.values(room.watchers);
                for (let i = 0; i < watchers.length; i++) {
                    const watcher: any = watchers[i];
                    if (watcher.socket_id === socket_id) return room_name;
                }
            }
        }
        return null;
    }
    // room pretecion
    roomProtection(player_login: string) {
        for (const room_name in this.rooms) {
            if (Object.prototype.hasOwnProperty.call(this.rooms, room_name)) {
                const room = this.rooms[room_name];
                const players = Object.keys(room.players);

                for (let i = 0; i < players.length; i++) {
                    const user_login: any = players[i];
                    if (user_login === player_login) return true;
                }
            }
        }
        return false;
    }

    // HANDLERS
    afterInit(server: any) {
        this.rooms = {};
        this.canvas = {};
    }
    async handleConnection(client: Socket) {
        const token = await this.authService.verifyToken(client.handshake.headers?.authorization);
        if (!token) {
          client.disconnect();
          // throw new  HttpException('Unauthorized', 403);
        }
        // this.userId = token?.userId;
    }
    handleDisconnect(client: Socket) {
        // room named
        var room_name = this.getRoomNameBySocket(client.id);

        if (room_name) {
            // clear the game
            clearInterval(this.rooms[room_name].intervalID);

            // emit game finished
            this.io.to(room_name).emit('opponentDisconnect');

            // clear the soocket room
            this.io.socketsLeave(room_name);

            // delete from obj
            delete this.rooms[room_name];

            this.onGame();
            this.liveMatch();

            return;
        }
        // room name
        room_name = this.getRoomNameBySocket2(client.id);

        if (room_name) {
            for (const watcher_name in this.rooms[room_name].watchers) {
                if (Object.prototype.hasOwnProperty.call(this.rooms[room_name].watchers, watcher_name)) {
                    const watches = this.rooms[room_name].watchers[watcher_name];
                    if (watches.socket_id === client.id) delete this.rooms[room_name].watchers[watcher_name];
                }
            }
            // kick out
            client.leave(room_name);
        }
    }

    // EVENTS
    // init game
    @SubscribeMessage('initGame')
    initGame(client: Socket, payload: any) {
        // variables
        const { user_id, user_login, user_name, user_avatar, speed_mode, canvas } = payload;
        // rooms_name
        const rooms_name = Object.keys(this.rooms);
        // room pretection
        if (this.roomProtection(user_login)) {
            client.emit('notAllowed');
            return;
        }
        // room_name
        const room_name = this.getKeyByAvalaibleRoom(rooms_name, speed_mode) || this.newRoom(speed_mode);
        // join room
        client.join(room_name);

        // add player
        this.canvas[user_login] = canvas;
        this.rooms[room_name].players[user_login] = this.newPlayer(user_id, user_login, user_name, user_avatar, client.id);

        // room_is_full
        if (Object.keys(this.rooms[room_name].players).length == 2) {
            this.rooms[room_name].isFull = true;
            this.initMembers(room_name);
            this.initBall(room_name);
            this.liveMatch();
            this.play(room_name);
        }
        this.onGame();
    }

    // move players
    @SubscribeMessage('moveKey')
    moveKey(client: Socket, payload: any) {
        // variable
        const { user_login, key } = payload;

        // room name
        var room_name = this.getRoomName(user_login);

        if (room_name && this.rooms[room_name]) {
            Object.keys(this.rooms[room_name].players).forEach((player_login: string) => {
                // variables
                const cn = this.canvas[player_login];
                const p = this.rooms[room_name].players[player_login].members[user_login];

                if (key === 'ArrowUp' && p.y > 0 && this.rooms[room_name].players[player_login].members[user_login]) {


                    this.rooms[room_name].players[player_login].members[user_login].y -= this.STEP;
                }
                else if (key === 'ArrowDown' && p.y + p.h < cn.h && this.rooms[room_name].players[player_login].members[user_login]) {
                    this.rooms[room_name].players[player_login].members[user_login].y += this.STEP;
                }
            });

            Object.keys(this.rooms[room_name].watchers).forEach((watcher_login: string) => {
                // variables
                const cn = this.canvas[watcher_login];
                const p = this.rooms[room_name].watchers[watcher_login][user_login];

                if (key === 'ArrowUp' && p.y > 0) {
                    this.rooms[room_name].watchers[watcher_login][user_login].y -= this.STEP;
                } else if (key === 'ArrowDown' && p.y + p.h < cn.h) {
                    this.rooms[room_name].watchers[watcher_login][user_login].y += this.STEP;
                }
            });
        }
    }

    // get all live matchs
    @SubscribeMessage('getLiveMatch')
    getLiveMatch() {
        this.liveMatch();
    }

    // get all live matchs
    @SubscribeMessage('getOnGame')
    getOnGame() {
        this.onGame();
    }

    // start watching
    @SubscribeMessage('watcher')
    watcher(client: Socket, payload: any) {
        // variables
        const { room_name, user_login, canvas } = payload;

        // traitment
        if (this.roomProtection(user_login)) {
            client.emit('notAllowed');
        } else if (this.rooms[room_name]) {
            // join the room
            client.join(room_name);

            // palueyes
            const players = Object.keys(this.rooms[room_name].players);
            const data: any = Object.values(this.rooms[room_name].players);
            this.rooms[room_name].watchers[user_login] = {
                ball: {
                    x: 0,
                    y: 0,
                    r: 0,
                    d: {
                        x: 0,
                        y: 0,
                    },
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                },
                [players[0]]: {
                    x: data[0].members[players[0]].x,
                    y: data[0].members[players[0]].y,
                    w: data[0].members[players[0]].w,
                    h: data[0].members[players[0]].h,
                    top: data[0].members[players[0]].top,
                    bottom: data[0].members[players[0]].bottom,
                    left: data[0].members[players[0]].left,
                    right: data[0].members[players[0]].right,
                },
                [players[1]]: {
                    x: data[1].members[players[1]].x,
                    y: data[1].members[players[1]].y,
                    w: data[1].members[players[1]].w,
                    h: data[1].members[players[1]].h,
                    top: data[1].members[players[1]].top,
                    bottom: data[1].members[players[1]].bottom,
                    left: data[1].members[players[1]].left,
                    right: data[1].members[players[1]].right,
                },
                socket_id: client.id,
            };
            this.canvas[user_login] = canvas;
        } else {
            client.emit('roomNotfound');
        }
    }

    // newCanvas
    @SubscribeMessage('newCanvas')
    newCanvas(client: Socket, payload: any) {
        // variables
        const { user_login, canvas } = payload;
        this.canvas[user_login] = canvas;
    }

    // ------------------------------

    @SubscribeMessage('inviteToGame')
    inviteToGame(client: Socket, payload: any) {
        const { opponent_id, speed_mode, user_login, user_id, user_name, user_avatar, canvas } = payload;

        if (this.roomProtection(user_login)) {
            client.emit('notAllowed');
            return;
        }

        const room_name = this.newRoom(speed_mode);

        this.rooms[room_name].isRandom = false;
        this.rooms[room_name].player_guest = opponent_id;

        // join room
        client.join(room_name);

        // add player
        this.canvas[user_login] = canvas;
        this.rooms[room_name].players[user_login] = this.newPlayer(user_id, user_login, user_name, user_avatar, client.id);

        this.io.emit('acceptGame', { ...payload, room_name });
        this.onGame();
    }

    @SubscribeMessage('gameWithFriend')
    gameWithFriend(client: Socket, payload: any) {
        const { room_name, user_login, user_id, user_name, user_avatar, canvas } = payload;

        // join room
        if (this.rooms[room_name]) {
            client.join(room_name);

            // add player
            this.canvas[user_login] = canvas;

            this.rooms[room_name].players[user_login] = this.newPlayer(user_id, user_login, user_name, user_avatar, client.id);

            // room_is_full
            if (Object.keys(this.rooms[room_name].players).length == 2) {
                this.rooms[room_name].isFull = true;
                this.initMembers(room_name);
                this.initBall(room_name);
                this.liveMatch();
                this.play(room_name);
            }
            this.onGame();
        }
        else {
            client.emit('cancelGame');
        }
    }

    @SubscribeMessage('canceInvite')
    canceInvite(client: Socket, payload: any) {
        const { room_name } = payload;
        // clear the game
        clearInterval(this.rooms[room_name].intervalID);

        // emit game finished
        this.io.to(room_name).emit('cancelGame');

        // clear the soocket room
        this.io.socketsLeave(room_name);

        // delete from obj
        delete this.rooms[room_name];

        this.onGame();
        this.liveMatch();
    }
    //   util func
    //   isRoomFull(room_name: string) {
    //     return (
    //       this.io.adapter.rooms.get(room_name) &&
    //       this.io.adapter.rooms.get(room_name).size >= 2
    //     );
    //   }
    //   playerExist(room: any, login: string) {
    //     for (let i = 0; i < room.players.length; i++) {
    //       if (room.players[i].login === login) {
    //         return true;
    //       }
    //     }
    //     return false;
    //   }
    //   socketExist(room: any, socket_id: string) {
    //     for (let i = 0; i < room.players.length; i++) {
    //       if (room.players[i].socket_id === socket_id) {
    //         return true;
    //       }
    //     }
    //     return false;
    //   }
    //   watcherExist(room: any, socket_id: string) {
    //     for (let i = 0; i < room.watcher.length; i++) {
    //       if (room.watcher[i] === socket_id) {
    //         return true;
    //       }
    //     }
    //     return false;
    //   }
    //   newRoom(speedMode: number, canvas: any) {
    //     this.rooms.push({
    //       name: uniqueNamesGenerator({
    //         dictionaries: [adjectives, colors, animals],
    //       }),
    //       speedMode: speedMode,
    //       players: [],
    //       watcher: [],
    //       canvas: canvas,
    //       intervalID: 0,
    //       ball: {
    //         x: 0,
    //         y: 0,
    //         r: 0,
    //         d: {
    //           x: 0,
    //           y: 0,
    //         },
    //         top: 0,
    //         bottom: 0,
    //         left: 0,
    //         right: 0,
    //       },
    //     });
    //   }
    //   getMove(canvas: any, player_num: number) {
    //     if (player_num)
    //       return {
    //         x: canvas.w - this.PLAYER_WIDTH * (3 / 2),
    //         y: (canvas.h - this.PLAYER_HEIGHT) / 2,
    //         w: this.PLAYER_WIDTH,
    //         h: this.PLAYER_HEIGHT,
    //         top: 0,
    //         bottom: 0,
    //         left: 0,
    //         right: 0,
    //       };
    //     return {
    //       x: this.PLAYER_WIDTH / 2,
    //       y: (canvas.h - this.PLAYER_HEIGHT) / 2,
    //       w: this.PLAYER_WIDTH,
    //       h: this.PLAYER_HEIGHT,
    //       top: 0,
    //       bottom: 0,
    //       left: 0,
    //       right: 0,
    //     };
    //   }
    //   initBall(room_index: number) {
    //     const START_DIRECTION = Math.random() - 1;
    //     const PLAYER_STARTER = Math.random() > 0.5 ? 1 : -1;
    //     // ball data
    //     this.rooms[room_index].ball.x = this.rooms[room_index].canvas.w / 2;
    //     this.rooms[room_index].ball.y = this.rooms[room_index].canvas.h / 2;
    //     this.rooms[room_index].ball.r = this.BALL_RADIUS;
    //     this.rooms[room_index].ball.d.x =
    //       PLAYER_STARTER *
    //       this.rooms[room_index].speedMode *
    //       Math.cos(START_DIRECTION * (Math.PI / 4));
    //     this.rooms[room_index].ball.d.y =
    //       PLAYER_STARTER *
    //       this.rooms[room_index].speedMode *
    //       Math.sin(START_DIRECTION * (Math.PI / 4));
    //     this.rooms[room_index].ball.top = 0;
    //     this.rooms[room_index].ball.bottom = 0;
    //     this.rooms[room_index].ball.left = 0;
    //     this.rooms[room_index].ball.right = 0;
    //   }
    //   collision(room_index: number, player_index: number) {
    //     this.rooms[room_index].ball.top =
    //       this.rooms[room_index].ball.y - this.rooms[room_index].ball.r;
    //     this.rooms[room_index].ball.bottom =
    //       this.rooms[room_index].ball.y + this.rooms[room_index].ball.r;
    //     this.rooms[room_index].ball.left =
    //       this.rooms[room_index].ball.x - this.rooms[room_index].ball.r;
    //     this.rooms[room_index].ball.right =
    //       this.rooms[room_index].ball.x + this.rooms[room_index].ball.r;
    //     this.rooms[room_index].players[player_index].top =
    //       this.rooms[room_index].players[player_index].y;
    //     this.rooms[room_index].players[player_index].bottom =
    //       this.rooms[room_index].players[player_index].y +
    //       this.rooms[room_index].players[player_index].h;
    //     this.rooms[room_index].players[player_index].left =
    //       this.rooms[room_index].players[player_index].x;
    //     this.rooms[room_index].players[player_index].right =
    //       this.rooms[room_index].players[player_index].x +
    //       this.rooms[room_index].players[player_index].w;
    //     return (
    //       this.rooms[room_index].ball.bottom >
    //         this.rooms[room_index].players[player_index].top &&
    //       this.rooms[room_index].ball.right >
    //         this.rooms[room_index].players[player_index].left &&
    //       this.rooms[room_index].ball.left <
    //         this.rooms[room_index].players[player_index].right &&
    //       this.rooms[room_index].ball.top <
    //         this.rooms[room_index].players[player_index].bottom
    //     );
    //   }
    //   update(room_index: number) {
    //     if (this.rooms[room_index]) {
    //       this.rooms[room_index].ball.x += this.rooms[room_index].ball.d.x;
    //       this.rooms[room_index].ball.y += this.rooms[room_index].ball.d.y;
    //       //   check score
    //       if (
    //         this.rooms[room_index].players[0].score === 5 ||
    //         this.rooms[room_index].players[1].score === 5
    //       ) {
    //         // update match history
    //         clearInterval(this.rooms[room_index].intervalID);
    //         const player0 = this.rooms[room_index].players[0];
    //         const player1 = this.rooms[room_index].players[1];

    //         // ---------------
    //         const updated = this.GameService.pushScore({
    //           userId: player0.user_id,
    //           user_score: player0.score,
    //           opponent_id: player1.user_id,
    //           opponent_score: player1.score,
    //         });

    //         // ---------------
    //         const result0 = this.GameService.updateUserStatisticsData({
    //           userId: player0.user_id,
    //           games_lost: player0.score < player1.score ? 1 : 0,
    //           games_won: player0.score > player1.score ? 1 : 0,
    //           games_drawn: player0.score === player1.score ? 1 : 0,
    //         });
    //         const result1 = this.GameService.updateUserStatisticsData({
    //           userId: player1.user_id,
    //           games_lost: player1.score < player0.score ? 1 : 0,
    //           games_won: player1.score > player0.score ? 1 : 0,
    //           games_drawn: player1.score === player0.score ? 1 : 0,
    //         });

    //         this.io
    //           .to(this.rooms[room_index].name)
    //           .emit('matchDone', this.rooms[room_index]);

    //         // this.io
    //         //   .in(this.rooms[room_index].name)
    //         //   .disconnectSockets()
    //         return;
    //       }
    //       // bouce on bottom and top
    //       if (
    //         this.rooms[room_index].ball.y + this.rooms[room_index].ball.r >
    //           this.rooms[room_index].canvas.h ||
    //         this.rooms[room_index].ball.y - this.rooms[room_index].ball.r < 0
    //       ) {
    //         this.rooms[room_index].ball.d.y *= -1;
    //       }
    //       // bouce on right and left
    //       if (
    //         this.rooms[room_index].ball.x + this.rooms[room_index].ball.r >
    //         this.rooms[room_index].canvas.w
    //       ) {
    //         this.rooms[room_index].players[0].score++;
    //         this.initBall(room_index);
    //       } else if (
    //         this.rooms[room_index].ball.x - this.rooms[room_index].ball.r <
    //         0
    //       ) {
    //         this.rooms[room_index].players[1].score++;
    //         this.initBall(room_index);
    //       }
    //       // bouce the player
    //       const player_index =
    //         this.rooms[room_index].ball.x < this.rooms[room_index].canvas.w / 2
    //           ? 0
    //           : 1;
    //       if (this.collision(room_index, player_index)) {
    //         const angle =
    //           ((this.rooms[room_index].ball.y -
    //             (this.rooms[room_index].players[player_index].y +
    //               this.rooms[room_index].players[player_index].h / 2)) /
    //             (this.rooms[room_index].players[player_index].h / 2)) *
    //           (Math.PI / 4);
    //         const direction =
    //           this.rooms[room_index].ball.x < this.rooms[room_index].canvas.w / 2
    //             ? 1
    //             : -1;
    //         this.rooms[room_index].ball.d.x =
    //           direction * this.rooms[room_index].speedMode * Math.cos(angle);
    //         this.rooms[room_index].ball.d.y =
    //           direction * this.rooms[room_index].speedMode * Math.sin(angle);
    //       }
    //     }
    //   }

    //   addPlayer(
    //     client: Socket,
    //     payload: any,
    //     room_index: number,
    //     player_num: number,
    //   ) {
    //     this.rooms[room_index].players[player_num] = {
    //       socket_id: client.id,
    //       username: payload.username,
    //       avatar: payload.avatar,
    //       login: payload.login,
    //       user_id: payload.user_id,
    //       score: 0,
    //       movement: this.getMove(this.rooms[room_index].canvas, player_num),
    //     };
    //     client.join(this.rooms[room_index].name);
    //   }
    //   getPlayerIndex(players: any, socket_id: string) {
    //     for (let i = 0; i < players.length; i++) {
    //       if (players[i].socket_id === socket_id) {
    //         return i;
    //       }
    //     }
    //     return -1;
    //   }
    //   emitToClient(room_index: number) {
    //     if (
    //       this.rooms[room_index] &&
    //       this.isRoomFull(this.rooms[room_index].name)
    //     ) {
    //       this.update(room_index);
    //       if (this.rooms[room_index])
    //         this.io
    //           .to(this.rooms[room_index].name)
    //           .emit('onGame', this.rooms[room_index]);
    //     }
    //   }
    //   onGame(room_index: number) {
    //     const intervalID = setInterval(
    //       () => this.emitToClient(room_index),
    //       1000 / this.FRAME_PER_SEC,
    //     );

    //     this.rooms[room_index].intervalID = intervalID;
    //   }
    //   getRoomIndex(socket_id: string) {
    //     for (let i = 0; i < this.rooms.length; i++) {
    //       if (
    //         this.socketExist(this.rooms[i], socket_id) ||
    //         this.watcherExist(this.rooms[i], socket_id)
    //       ) {
    //         return i;
    //       }
    //     }
    //     return -1;
    //   }
    //   getRoomIndexByNmae(name: string) {
    //     for (let i = 0; i < this.rooms.length; i++) {
    //       if (this.rooms[i].name === name) {
    //         return i;
    //       }
    //     }
    //     return -1;
    //   }
    //   newCanvas(room_index: number, canvas: any) {
    //     if (
    //       this.rooms[room_index].canvas &&
    //       this.rooms[room_index].canvas.w > canvas.w
    //     ) {
    //       this.rooms[room_index].canvas = canvas;
    //     }
    //   }
    //   roomByMode(client: Socket, payload: any) {
    //     for (let i = 0; i < this.rooms.length; i++) {
    //       if (
    //         !this.isRoomFull(this.rooms[i].name) &&
    //         this.rooms[i].speedMode === payload.speedMode &&
    //         !this.playerExist(this.rooms[i], payload.login)
    //       ) {
    //         this.newCanvas(i, payload.canvas);
    //         this.addPlayer(client, payload, i, 1);
    //         this.initBall(i);
    //         this.onGame(i);
    //
    //         return true;
    //       }
    //     }
    //     return false;
    //   }
    //   //   handle connect and disconnect
    //   afterInit(server: any) {
    //     this.rooms = [];
    //     this.canvas = null;
    //   }
    //   handleConnection(client: Socket) {}
    //   handleDisconnect(client: Socket) {
    //     var room_index = this.getRoomIndex(client.id);
    //     if (room_index !== -1) {
    //       var watcher_index = this.rooms[room_index].watcher.indexOf(client.id);

    //       if (watcher_index !== -1) {
    //         this.rooms[room_index].watcher.splice(room_index, 1);
    //         client.leave(this.rooms[room_index].name);
    //       } else {
    //         clearInterval(this.rooms[room_index].intervalID);
    //         this.io
    //           .to(this.rooms[room_index].name)
    //           .emit('opponentDisconnect', this.rooms[room_index]);
    //         this.rooms.splice(room_index, 1);
    //       }
    //       this.liveMatch();
    //     }
    //   }
    //   // events
    //   @SubscribeMessage('init')
    //   initGame(client: Socket, payload: any) {
    //     if (!this.roomByMode(client, payload)) {
    //       this.newRoom(payload.speedMode, payload.canvas);
    //       this.addPlayer(client, payload, this.rooms.length - 1, 0);
    //     }
    //   }

    //   @SubscribeMessage('moveKey')
    //   moveKey(client: Socket, payload: any) {
    //     var room_index = this.getRoomIndex(client.id);
    //     if (room_index !== -1) {
    //       var player_index = this.getPlayerIndex(
    //         this.rooms[room_index].players,
    //         client.id,
    //       );
    //       if (
    //         this.rooms[room_index].players[player_index].socket_id === client.id
    //       ) {
    //         if (payload.key === 'ArrowUp') {
    //           if (this.rooms[room_index].players[player_index].y > 0)
    //             this.rooms[room_index].players[player_index].y -=
    //               this.STEP;
    //         } else if (payload.key === 'ArrowDown') {
    //           if (
    //             this.rooms[room_index].players[player_index].y +
    //               this.rooms[room_index].players[player_index].h <
    //             payload.canvas.h
    //           )
    //             this.rooms[room_index].players[player_index].y +=
    //               this.STEP;
    //         }
    //       }
    //     }
    //   }

    //   @SubscribeMessage('watcher')
    //   watcher(client: Socket, payload: any) {
    //     var room_index = this.getRoomIndexByNmae(payload.room_name);
    //     if (this.rooms[room_index]) {
    //       client.join(payload.room_name);
    //       this.rooms[room_index].watcher.push(client.id);
    //     } else {
    //       client.emit('roomNotfound');
    //     }
    //   }
    //   @SubscribeMessage('getLiveMatch')
    //   getLiveMatch() {
    //     this.liveMatch();
    //   }

    //   @SubscribeMessage('acceptInvite')
    //   acceptInvite(client: Socket, payload: any) {
    //     this.io.emit('playAccept', payload);
    //   }

    //   @SubscribeMessage('canvas')
    //   canvasWidth(client: Socket, payload: any) {
    //     for (let i = 0; i < this.rooms.length; i++) {
    //       for (let j = 0; j < this.rooms[i].players.length; j++) {
    //         if (this.rooms[i].players[j].login === payload.login) {
    //           this.rooms[i].canvas = payload.canvas;
    //           return;
    //         }
    //       }
    //     }
    //   }
}
