import { Module } from '@nestjs/common';
import {chatController} from './chat.controller';
import { ChatService } from './chat.service';
import {ChatGateway} from './chat.gateway';

@Module({
	  imports: [],
	  controllers: [chatController],
	  providers: [ChatService,ChatGateway],
})
export class ChatModule 
{}
