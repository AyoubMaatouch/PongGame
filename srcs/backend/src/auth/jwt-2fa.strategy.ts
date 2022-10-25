import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request, response } from 'express';
import { config } from 'dotenv';
import { PrismaService } from 'src/prisma/prisma.service';
// import { UsersService } from '../../users/users.service';
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
export class Jwt2faStrategy extends PassportStrategy(Strategy, 'jwt-two-factor') {
  constructor(private prisma: PrismaService) {
    super({
        
        jwtFromRequest: ExtractJwt.fromExtractors([customExtractor]), //This is where we use the customExtractor functiona
        secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
        return payload
  }
}