import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpException,
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
import { twofaguard } from './guard.auth';


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
	@UseGuards(AuthGuard('42'))
	async FortyTwoAuthRedirect(
		@Req() req,
		@Res({ passthrough: true }) res,
		@Query('code') code,
	) {

		//console.log('MY current user:   => ', req.user);
		const found = await this.AuthService.createAccount(req.user.username, req.user.avatar);
		console.log("Found ===>", found.two_authentication)
		const twofa = !(found.two_authentication) ? true : false;	
	
		const accessToken = this.AuthService.signToken(req.user.username, twofa);


		res.cookie('jwt', accessToken, { httpOnly: false });

		return twofa ? res.redirect(process.env.CLIENT_URL) : res.redirect(process.env.CLIENT_URL + '/2fa');
	}



	@Get('2fa')
	@UseGuards(AuthGuard('jwt')) //'jwt' is what we named our strategy in accessJwtStrategy.ts Guard used to get Payload JWT
	async TwoFactor(@Req() req: Request) {
		const user = req.user;
		var result = await this.AuthService.generate2fa(user['userLogin']);
		return result;
	}

	@Post('2fa')
	//@UseGuards(AuthGuard('jwt')) 
	async TwoFAcheck(@Body() body: TwoFactDto, @Req() req) {
		// after check push secrect to db

		const res = await this.AuthService.verify2fa(
			body.userToken,
			body.base32secret,
		);
		if (res)
		{
			res.clearCookie('jwt');
			const accessToken = this.AuthService.signToken(req.user.username, true);
			res.cookie('jwt', accessToken, { httpOnly: false });
			return (res.redirect(process.env.CLIENT_URL));
		}
		else
			throw new HttpException("2fa invalid", 403);
	}

	@Post('signout')
	@UseGuards(AuthGuard('jwt'))
	logout(@Res({ passthrough: true }) res) {
		res.clearCookie('jwt');
		return { message: 'Logged out' };
	}
}
