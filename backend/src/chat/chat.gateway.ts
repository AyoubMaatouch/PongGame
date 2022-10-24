import { chatController } from './chat.controller';
import { HttpException, Logger, UseGuards } from '@nestjs/common';
import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
// <<<<<<< HEAD
import { Socket, Server, Namespace } from 'socket.io';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';
import { accessJwtStrategy } from '../auth/accessJwtStrategy';
import { AuthService } from '../auth/auth.service';
//https://gabrieltanner.org/blog/nestjs-realtime-chat/

// @WebSocketGateway(3002, {
// =======
// import { Socket, Server } from 'socket.io';

//https://gabrieltanner.org/blog/nestjs-realtime-chat/

// <<<<<<< HEAD
@WebSocketGateway(3003, {
  // >>>>>>> 02e12a4fd13aad1b83ccec36c8e7ef2f11d200c4
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: 'dm',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private ChatService: ChatService, private authService: AuthService) {}
  private logger: Logger = new Logger('ChatGateway BRRRR');

  @WebSocketServer()
  io: Namespace;
  prisma: any;
  muted: any[];
  userId : number;

  afterInit(server: any) {
    this.logger.log('Init');
    this.muted = [];
  }

  async handleConnection(client: Socket, ...args: any[]) {
  
    
    this.logger.log(`Client connected: ${client.id}`);
    console.log("on connection ", client.handshake.headers?.authorization)

	const token = await this.authService.verifyToken(client.handshake.headers?.authorization);
	console.log(token);
    if (!token)
	{
		console.log("TOKEN = NULL");
	//	client.disconnect();
		//throw new HttpException('Unauthorized', 403);
	}
	//this.userId = token.userId;
    
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
  isMuted(client: Socket, user_id: any) {
    console.log(this.muted, user_id);

    for (let i = 0; i < this.muted.length; i++) {
      const item = this.muted[i];
      if (item.user_id === user_id) {
        if (Date.now() - item.time < parseInt(item.period) * 1000 * 60) {
          client.emit('imMuted', {
            time:
              ((parseInt(item.period) * 1000 * 60 - (Date.now() - item.time)) /
              (1000 * 60)).toFixed(2),
          });
          return true;
        }
      }
    }
    return false;
  }

  @UseGuards(accessJwtStrategy)
  @SubscribeMessage('ping') // Equivalent to socket.on('msgToServer') listening to any 'msgToServer' event
  ping(client: Socket, payload: any) {
    console.log('ping(): ', payload);
    console.log('jwt ', client.handshake.query);
    client.join(payload.room_id);
  }
  @SubscribeMessage('message')
  async message(client: Socket, payload: any) {


    console.log("Message payload", payload);
    if (!this.isMuted(client, payload.userId)) {
      this.io.to(payload.room_id).emit('recieveMessage', payload);
      console.log('payload ', payload);

      const check = await this.ChatService.pushMsg(payload);
      console.log('check :', check);
    }
  }

  @SubscribeMessage('muteUser')
  async mute(client: Socket, payload: any) {
    // this.io.to(payload.room_id).emit('recieveMessage', payload);
    console.log('mute:  ', payload);
    this.muted.push(payload);
    // const check = await this.ChatService.pushMsg(payload);
    // console.log('check :', check);
  }

  @SubscribeMessage('blockUser')
  async block(client: Socket, payload: any) {
    // payload {
    //         user_id
    //         room_id
    // }
    console.log('block this user :  ', payload);
    this.io.emit("blockMe", payload)

  }
}

//!https://wanago.io/2021/01/25/api-nestjs-chat-websockets/
//? https://javascript.info/websocket
//? https://docs.nestjs.com/fundamentals/lifecycle-events
//? https://docs.nestjs.com/websockets/gateways
// ?https://socket.io/docs/v3/emit-cheatsheet/
//* @WebsocketGateway() declarator which gives us access to the socket.io functionality.
//* OnGatewayInit, OnGatewayConnection and OnGatewayDisconnect which we use to log some key states of our application. For example, we log when a new client connects to the server or when a current client disconnects.
//* @WebsocketServer() which gives us access to the websockets server instance.
//* @SubscribeMessage('msgToServer') makes it listen to an event named msgToServer.

//@SubscribeMessage('connection') = listen to an event named connection
//socket.on = receive
//socket.emit = send
//socket.to(room).emit = send to everyone in a room including the sender
