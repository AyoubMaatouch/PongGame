import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { jwtGuard } from './guard.auth';

const customExtractor = (req: Request) => {
  //THis function returns the token from the cookie and uses the return vallue to verify it
  let token = null;
  console.log('cookies', req.cookies);
  if (req.cookies['jwt'] && req.cookies['jwt']['access_token']) {
    token = req.cookies['jwt']['access_token'];
  }
  return token;
};

@Injectable()
export class accessJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([customExtractor]), //This is where we use the customExtractor functiona
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // add here a bool value to check if 2fa is enabled or not
  async validate(payload: any) {
    console.log('IM IN VALIDATE!!', payload); 
    return payload;
  }
}
//https://wanago.io/2020/05/25/api-nestjs-authenticating-users-bcrypt-passport-jwt-cookies/
