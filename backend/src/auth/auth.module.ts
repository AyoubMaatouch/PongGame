import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { accessJwtStrategy } from './accessJwtStrategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { FortyTwoStrategy } from './42.strategy'
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [JwtModule.register({}), PassportModule],
  controllers: [AuthController],
  providers: [AuthService,FortyTwoStrategy,accessJwtStrategy, JwtService],
})
export class AuthModule {} 
