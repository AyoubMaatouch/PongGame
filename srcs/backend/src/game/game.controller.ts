import { Controller, Get } from '@nestjs/common';

@Controller('live-match')
export class GameController {
  @Get()
  liveMatch() {
    return 'Welcome User';
  }
}
