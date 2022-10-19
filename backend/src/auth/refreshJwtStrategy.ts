import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {Request} from 'express';



@Injectable()
export class refreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
	  passReqToCallback: true
    });
  }

  validate(req : Request, payload: any) 
  {
	console.log('Before RT ', req.headers.authorization);
	const refreshToken = req.headers.authorization.replace('Bearer','').trim();
	console.log('After RT ', req.headers.authorization);
    return {...payload, refreshToken}; //Spread Operator
  }
}
