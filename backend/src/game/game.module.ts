import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { JwtService } from '@nestjs/jwt';
import { accessJwtStrategy } from 'src/auth/accessJwtStrategy';

@Module({
  imports: [],
  controllers: [GameController],
  providers: [GameService, GameGateway, JwtService, accessJwtStrategy],
})
export class GameModule {}
