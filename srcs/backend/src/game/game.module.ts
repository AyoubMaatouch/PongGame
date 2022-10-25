import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { JwtService } from '@nestjs/jwt';
import { accessJwtStrategy } from 'src/auth/accessJwtStrategy';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [],
  controllers: [GameController],
  providers: [GameService, GameGateway, JwtService, accessJwtStrategy, AuthService],
})
export class GameModule {}
