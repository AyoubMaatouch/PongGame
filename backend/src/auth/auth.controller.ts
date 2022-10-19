import {
  Body,
  Controller,
  Get,
  HttpCode,
  Injectable,
  Param,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { join } from 'path';
import { write } from 'fs';
import { TwoFactDto } from './DTOs/2fa.dto';

@Controller('42')
export class AuthController {
  constructor(
    private readonly AuthService: AuthService,
    private JwtService: JwtService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('42'))
  async FortyTwoAuth(@Req() req) {
    // console.log('MY current user:   => ', req.user);
    return { message: 'You are logged in' };
  }

  @Get('redirect')
  // @UseGuards(AuthGuard('jwt'))
  @UseGuards(AuthGuard('42'))
  async FortyTwoAuthRedirect(
    @Req() req,
    @Res({ passthrough: true }) res,
    @Query('code') code,
  ) {
    //console.log('MY current user:   => ', req.user);
    this.AuthService.createAccount(req.user.username, req.user.avatar);
    const accessToken = this.AuthService.signToken(req.user.username);
    res.cookie('jwt', accessToken, { httpOnly: false });
    return res.redirect('http://localhost:3000');
  }

  @Get('test')
  @UseGuards(AuthGuard('jwt')) //'jwt' is what we named our strategy in accessJwtStrategy.ts Guard used to get Payload JWT
  test(@Req() req: Request) {
    const user = req.user;
    console.log(user['userLogin']);
    return 'TEST inSIDE HAHA  ';
  }

  @Get('2fa')
  @UseGuards(AuthGuard('jwt')) //'jwt' is what we named our strategy in accessJwtStrategy.ts Guard used to get Payload JWT
  async TwoFactor(@Req() req: Request) {
    const user = req.user;
    var result = await this.AuthService.generate2fa(user['userLogin']);
    return result;
  }

  @Post('2fa')
  async TwoFAcheck(@Body() body: TwoFactDto) {
    // after check push secrect to db
    var res = await this.AuthService.verify2fa(
      body.userToken,
      body.base32secret,
    );
    return { message: res };
  }

  @Post('signout')
  @UseGuards(AuthGuard('jwt'))
  logout(@Res({ passthrough: true }) res) {
    res.clearCookie('jwt');
    return { message: 'Logged out' };
  }
}
