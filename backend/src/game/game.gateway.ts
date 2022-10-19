import { Logger } from '@nestjs/common';
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
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';
import { threadId } from 'worker_threads';
import { GameService } from './game.service';

@WebSocketGateway(3003, {
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: 'game',
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private GameService: GameService) {}
  @WebSocketServer()
  io: Namespace;
  rooms: any[];
  PLAYER_HEIGHT = 80;
  PLAYER_WIDTH = 10;
  BALL_RADIUS = 7;
  FRAME_PER_SEC = 50;
  STEP = 20;
  canvas: any;
  //   util func
  isRoomFull(room_name: string) {
    return (
      this.io.adapter.rooms.get(room_name) &&
      this.io.adapter.rooms.get(room_name).size >= 2
    );
  }
  playerExist(room: any, login: string) {
    for (let i = 0; i < room.players.length; i++) {
      if (room.players[i].login === login) {
        return true;
      }
    }
    return false;
  }
  socketExist(room: any, socket_id: string) {
    for (let i = 0; i < room.players.length; i++) {
      if (room.players[i].socket_id === socket_id) {
        return true;
      }
    }
    return false;
  }
  watcherExist(room: any, socket_id: string) {
    for (let i = 0; i < room.watcher.length; i++) {
      if (room.watcher[i] === socket_id) {
        return true;
      }
    }
    return false;
  }
  newRoom(speedMode: number, canvas: any) {
    this.rooms.push({
      name: uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
      }),
      speedMode: speedMode,
      players: [],
      watcher: [],
      canvas: canvas,
      intervalID: 0,
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
    });
  }
  getMove(canvas: any, player_num: number) {
    if (player_num)
      return {
        x: canvas.w - this.PLAYER_WIDTH * (3 / 2),
        y: (canvas.h - this.PLAYER_HEIGHT) / 2,
        w: this.PLAYER_WIDTH,
        h: this.PLAYER_HEIGHT,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      };
    return {
      x: this.PLAYER_WIDTH / 2,
      y: (canvas.h - this.PLAYER_HEIGHT) / 2,
      w: this.PLAYER_WIDTH,
      h: this.PLAYER_HEIGHT,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    };
  }
  initBall(room_index: number) {
    const START_DIRECTION = Math.random() - 1;
    const PLAYER_STARTER = Math.random() > 0.5 ? 1 : -1;
    // ball data
    this.rooms[room_index].ball.x = this.rooms[room_index].canvas.w / 2;
    this.rooms[room_index].ball.y = this.rooms[room_index].canvas.h / 2;
    this.rooms[room_index].ball.r = this.BALL_RADIUS;
    this.rooms[room_index].ball.d.x =
      PLAYER_STARTER *
      this.rooms[room_index].speedMode *
      Math.cos(START_DIRECTION * (Math.PI / 4));
    this.rooms[room_index].ball.d.y =
      PLAYER_STARTER *
      this.rooms[room_index].speedMode *
      Math.sin(START_DIRECTION * (Math.PI / 4));
    this.rooms[room_index].ball.top = 0;
    this.rooms[room_index].ball.bottom = 0;
    this.rooms[room_index].ball.left = 0;
    this.rooms[room_index].ball.right = 0;
  }
  collision(room_index: number, player_index: number) {
    this.rooms[room_index].ball.top =
      this.rooms[room_index].ball.y - this.rooms[room_index].ball.r;
    this.rooms[room_index].ball.bottom =
      this.rooms[room_index].ball.y + this.rooms[room_index].ball.r;
    this.rooms[room_index].ball.left =
      this.rooms[room_index].ball.x - this.rooms[room_index].ball.r;
    this.rooms[room_index].ball.right =
      this.rooms[room_index].ball.x + this.rooms[room_index].ball.r;
    this.rooms[room_index].players[player_index].movement.top =
      this.rooms[room_index].players[player_index].movement.y;
    this.rooms[room_index].players[player_index].movement.bottom =
      this.rooms[room_index].players[player_index].movement.y +
      this.rooms[room_index].players[player_index].movement.h;
    this.rooms[room_index].players[player_index].movement.left =
      this.rooms[room_index].players[player_index].movement.x;
    this.rooms[room_index].players[player_index].movement.right =
      this.rooms[room_index].players[player_index].movement.x +
      this.rooms[room_index].players[player_index].movement.w;
    return (
      this.rooms[room_index].ball.bottom >
        this.rooms[room_index].players[player_index].movement.top &&
      this.rooms[room_index].ball.right >
        this.rooms[room_index].players[player_index].movement.left &&
      this.rooms[room_index].ball.left <
        this.rooms[room_index].players[player_index].movement.right &&
      this.rooms[room_index].ball.top <
        this.rooms[room_index].players[player_index].movement.bottom
    );
  }
  update(room_index: number) {
    if (this.rooms[room_index]) {
      this.rooms[room_index].ball.x += this.rooms[room_index].ball.d.x;
      this.rooms[room_index].ball.y += this.rooms[room_index].ball.d.y;
      //   check score
      if (
        this.rooms[room_index].players[0].score === 5 ||
        this.rooms[room_index].players[1].score === 5
      ) {
        // update match history
        clearInterval(this.rooms[room_index].intervalID);
        const player0 = this.rooms[room_index].players[0];
        const player1 = this.rooms[room_index].players[1];

        // ---------------
        const updated = this.GameService.pushScore({
          userId: player0.user_id,
          user_score: player0.score,
          opponent_id: player1.user_id,
          opponent_score: player1.score,
        });

        // ---------------
        const result0 = this.GameService.updateUserStatisticsData({
          userId: player0.user_id,
          games_lost: player0.score < player1.score ? 1 : 0,
          games_won: player0.score > player1.score ? 1 : 0,
          games_drawn: player0.score === player1.score ? 1 : 0,
        });
        const result1 = this.GameService.updateUserStatisticsData({
          userId: player1.user_id,
          games_lost: player1.score < player0.score ? 1 : 0,
          games_won: player1.score > player0.score ? 1 : 0,
          games_drawn: player1.score === player0.score ? 1 : 0,
        });

        this.io
          .to(this.rooms[room_index].name)
          .emit('matchDone', this.rooms[room_index]);

        // this.io
        //   .in(this.rooms[room_index].name)
        //   .disconnectSockets()
        return;
      }
      // bouce on bottom and top
      if (
        this.rooms[room_index].ball.y + this.rooms[room_index].ball.r >
          this.rooms[room_index].canvas.h ||
        this.rooms[room_index].ball.y - this.rooms[room_index].ball.r < 0
      ) {
        this.rooms[room_index].ball.d.y *= -1;
      }
      // bouce on right and left
      if (
        this.rooms[room_index].ball.x + this.rooms[room_index].ball.r >
        this.rooms[room_index].canvas.w
      ) {
        this.rooms[room_index].players[0].score++;
        this.initBall(room_index);
      } else if (
        this.rooms[room_index].ball.x - this.rooms[room_index].ball.r <
        0
      ) {
        this.rooms[room_index].players[1].score++;
        this.initBall(room_index);
      }
      // bouce the player
      const player_index =
        this.rooms[room_index].ball.x < this.rooms[room_index].canvas.w / 2
          ? 0
          : 1;
      if (this.collision(room_index, player_index)) {
        const angle =
          ((this.rooms[room_index].ball.y -
            (this.rooms[room_index].players[player_index].movement.y +
              this.rooms[room_index].players[player_index].movement.h / 2)) /
            (this.rooms[room_index].players[player_index].movement.h / 2)) *
          (Math.PI / 4);
        const direction =
          this.rooms[room_index].ball.x < this.rooms[room_index].canvas.w / 2
            ? 1
            : -1;
        this.rooms[room_index].ball.d.x =
          direction * this.rooms[room_index].speedMode * Math.cos(angle);
        this.rooms[room_index].ball.d.y =
          direction * this.rooms[room_index].speedMode * Math.sin(angle);
      }
    }
  }
  liveMatch() {
    var matchs = [];
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.isRoomFull(this.rooms[i].name)) {
        matchs.push({
          room_name: this.rooms[i].name,
          p0: {
            username: this.rooms[i].players[0].username,
            avatar: this.rooms[i].players[0].avatar,
          },
          p1: {
            username: this.rooms[i].players[1].username,
            avatar: this.rooms[i].players[1].avatar,
          },
        });
      }
    }
    this.io.emit('liveMatch', matchs);
  }
  addPlayer(
    client: Socket,
    payload: any,
    room_index: number,
    player_num: number,
  ) {
    this.rooms[room_index].players[player_num] = {
      socket_id: client.id,
      username: payload.username,
      avatar: payload.avatar,
      login: payload.login,
      user_id: payload.user_id,
      score: 0,
      movement: this.getMove(this.rooms[room_index].canvas, player_num),
    };
    client.join(this.rooms[room_index].name);
  }
  getPlayerIndex(players: any, socket_id: string) {
    for (let i = 0; i < players.length; i++) {
      if (players[i].socket_id === socket_id) {
        return i;
      }
    }
    return -1;
  }
  emitToClient(room_index: number) {
    if (
      this.rooms[room_index] &&
      this.isRoomFull(this.rooms[room_index].name)
    ) {
      this.update(room_index);
      if (this.rooms[room_index])
        this.io
          .to(this.rooms[room_index].name)
          .emit('onGame', this.rooms[room_index]);
    }
  }
  onGame(room_index: number) {
    const intervalID = setInterval(
      () => this.emitToClient(room_index),
      1000 / this.FRAME_PER_SEC,
    );

    this.rooms[room_index].intervalID = intervalID;
  }
  getRoomIndex(socket_id: string) {
    for (let i = 0; i < this.rooms.length; i++) {
      if (
        this.socketExist(this.rooms[i], socket_id) ||
        this.watcherExist(this.rooms[i], socket_id)
      ) {
        return i;
      }
    }
    return -1;
  }
  getRoomIndexByNmae(name: string) {
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].name === name) {
        return i;
      }
    }
    return -1;
  }
  newCanvas(room_index: number, canvas: any) {
    if (
      this.rooms[room_index].canvas &&
      this.rooms[room_index].canvas.w > canvas.w
    ) {
      this.rooms[room_index].canvas = canvas;
    }
  }
  roomByMode(client: Socket, payload: any) {
    for (let i = 0; i < this.rooms.length; i++) {
      if (
        !this.isRoomFull(this.rooms[i].name) &&
        this.rooms[i].speedMode === payload.speedMode &&
        !this.playerExist(this.rooms[i], payload.login)
      ) {
        this.newCanvas(i, payload.canvas);
        this.addPlayer(client, payload, i, 1);
        this.initBall(i);
        this.onGame(i);
        this.liveMatch();
        return true;
      }
    }
    return false;
  }
  //   handle connect and disconnect
  afterInit(server: any) {
    this.rooms = [];
    this.canvas = null;
  }
  handleConnection(client: Socket) {}
  handleDisconnect(client: Socket) {
    var room_index = this.getRoomIndex(client.id);
    if (room_index !== -1) {
      var watcher_index = this.rooms[room_index].watcher.indexOf(client.id);

      if (watcher_index !== -1) {
        this.rooms[room_index].watcher.splice(room_index, 1);
        client.leave(this.rooms[room_index].name);
      } else {
        clearInterval(this.rooms[room_index].intervalID);
        this.io
          .to(this.rooms[room_index].name)
          .emit('opponentDisconnect', this.rooms[room_index]);
        this.rooms.splice(room_index, 1);
      }
      this.liveMatch();
    }
  }
  // events
  @SubscribeMessage('init')
  initGame(client: Socket, payload: any) {
    if (!this.roomByMode(client, payload)) {
      this.newRoom(payload.speedMode, payload.canvas);
      this.addPlayer(client, payload, this.rooms.length - 1, 0);
    }
  }

  @SubscribeMessage('moveKey')
  moveKey(client: Socket, payload: any) {
    var room_index = this.getRoomIndex(client.id);
    if (room_index !== -1) {
      var player_index = this.getPlayerIndex(
        this.rooms[room_index].players,
        client.id,
      );
      if (
        this.rooms[room_index].players[player_index].socket_id === client.id
      ) {
        if (payload.key === 'ArrowUp') {
          if (this.rooms[room_index].players[player_index].movement.y > 0)
            this.rooms[room_index].players[player_index].movement.y -=
              this.STEP;
        } else if (payload.key === 'ArrowDown') {
          if (
            this.rooms[room_index].players[player_index].movement.y +
              this.rooms[room_index].players[player_index].movement.h <
            payload.canvas.h
          )
            this.rooms[room_index].players[player_index].movement.y +=
              this.STEP;
        }
      }
    }
  }

  @SubscribeMessage('watcher')
  watcher(client: Socket, payload: any) {
    var room_index = this.getRoomIndexByNmae(payload.room_name);
    if (this.rooms[room_index]) {
      client.join(payload.room_name);
      this.rooms[room_index].watcher.push(client.id);
    } else {
      client.emit('roomNotfound');
    }
  }
  @SubscribeMessage('getLiveMatch')
  getLiveMatch() {
    this.liveMatch();
  }
  @SubscribeMessage('canvas')
  canvasWidth(client: Socket, payload: any) {
    for (let i = 0; i < this.rooms.length; i++) {
      for (let j = 0; j < this.rooms[i].players.length; j++) {
        if (this.rooms[i].players[j].login === payload.login) {
          this.rooms[i].canvas = payload.canvas;
          return;
        }
      }
    }
  }
}
