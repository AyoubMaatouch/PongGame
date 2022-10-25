import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { fromEventPattern } from 'rxjs';
import { Socket, Server, Namespace } from 'socket.io';
import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway(3004, {
  namespace: 'userstate',
  cors: {
    origin: process.env.CLIENT_URL,
  },
})
export class UsersGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private authService: AuthService,
    readonly UsersService: UsersService,
  ) {}

  private logger: Logger = new Logger('UsersGateway');

  @WebSocketServer()
  io: Namespace;
  online : any[];

  afterInit(server: any) {
    this.online = [];
  }

  userExist(user_id: any) {
    for (let i = 0; i < this.online.length; i++) 
    {
      const user = this.online[i];
      if (user.user_id === user_id)
        return true;
    }
    return false;
  }

  async handleConnection(client: Socket) {
    const token = await this.authService.verifyToken(client.handshake.headers?.authorization);
    if (!token) {
      client.disconnect();
      // throw new  HttpException('Unauthorized', 403);
    } else {
    if (!this.userExist(client.handshake.query.user_id)) {
      this.online.push({
        user_id: client.handshake.query.user_id,
        socket_id: client.id,
      });
      this.io.emit('online', this.online);
    }
  }
  }

  handleDisconnect(client: Socket) 
  {
    for (let i = 0; i < this.online.length; i++) 
    {
      const user = this.online[i];
      if (user.user_id === client.handshake.query.user_id.toString()) 
      {
        this.online.splice(i, 1);
        break;
      }
    }
    this.io.emit('online', this.online);
}

  @SubscribeMessage('onlinePing')
  canvasWidth(client: Socket) {
    this.io.emit('online', this.online);
  }
}
