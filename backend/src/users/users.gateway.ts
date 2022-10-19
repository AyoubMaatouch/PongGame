import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { fromEventPattern } from 'rxjs';
import {Socket, Server} from 'socket.io';
import { Logger } from '@nestjs/common';
import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from './users.service';

@WebSocketGateway(3004,{namespace:'userstate', cors: {
	origin: process.env.FRONTEND_URL,
}})
export class UsersGateway implements  OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  

  constructor(private readonly PrismaService: PrismaService, readonly UsersService : UsersService) {}

  private logger: Logger = new Logger('UsersGateway');

  @WebSocketServer()
  server: Server;
  
  afterInit(server: any) {
    this.logger.log('Init');
  }

  handleConnection(client : Socket) {
 
    this.logger.log(`${client.handshake.query.login} connected: ${client.id} `); //! Add query login when connecting
    this.UsersService.setUserState(client.handshake.query.login, true);

  }

  handleDisconnect(client: Socket) {
    this.logger.log(`User disconnected: ${client.id}`);
    this.UsersService.setUserState(client.handshake.query.login, false);
  }
   
}
