import { Module } from '@nestjs/common';
import {chatController} from './chat.controller';
import { ChatService } from './chat.service';
import {ChatGateway} from './chat.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
	  imports: [],
	  controllers: [chatController],
	  providers: [ChatService,ChatGateway, AuthService,JwtService],
})
export class ChatModule 
{}
