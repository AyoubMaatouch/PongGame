import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { HttpModule } from '@nestjs/axios';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { chatController } from './chat/chat.controller';
import { GameController } from './game/game.controller';
import { PrismaModule } from './prisma/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';
import { CloudinaryModule } from './users/clodinary/cloudinar.module';
import { UsersGateway } from './users/users.gateway';
import { UsersModule } from './users/users.module';
@Module({
  imports: [
    CloudinaryModule,
    AuthModule,
    HttpModule,
    ConfigModule.forRoot(),
    PrismaModule,
    ChatModule,
    GameModule,
  ],
  controllers: [UsersController, chatController, GameController],
  providers: [UsersService, UsersGateway],
})
export class AppModule {}

//https://docs.nestjs.com/recipes/serve-static
//https://stackoverflow.com/questions/63285055/nestjs-how-to-use-env-variables-in-main-app-module-file-for-database-connecti
// ServeStaticModule.forRoot({rootPath: join(__dirname, '..','public'),})
