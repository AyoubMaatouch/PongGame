import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request, response } from 'express';

const customExtractor = (req: Request) => {
  //THis function returns the token from the cookie and uses the return vallue to verify it
  let token = null;
  if (req.cookies['jwt'] && req.cookies['jwt']['access_token'])
  {
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
    
    // if (payload.isAuth && payload.isEnabled)
    //     {
    //       response.redirect(process.env.CLIENT_URL + '/2fa')
    //     }
    // throw new HttpException("Can't Authenticate", 403)
    if (payload.isAuth)
    {
      return payload
    }
  }
}
//https://wanago.io/2020/05/25/api-nestjs-authenticating-users-bcrypt-passport-jwt-cookies/
