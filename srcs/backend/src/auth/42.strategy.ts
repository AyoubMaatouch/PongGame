import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-42';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';

config();

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {

  constructor() {
    super({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    });
  }

  async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { username, emails, displayName, photos } = profile
    const user = {
        username,
        email: emails[0].value,
        name: displayName,
		    avatar: photos[0].value,
        accessToken,
    }
    done(null, user);
  }
}