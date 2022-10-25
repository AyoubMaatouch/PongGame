import { Controller, Get } from '@nestjs/common';

@Controller('chat')
export class chatController {
  @Get()
  chat() {
    return 'Welcome User';
  }
}
