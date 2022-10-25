import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
    constructor(private readonly prisma : PrismaService) {}
    // payload  { room_id: 1, message: 'ijkbvkjbkjvbjkdbs',
    //  userId: 1 }

    async pushMsg(payload : any) {
         const chats = await this.prisma.chats.create(
            {
                data:
                {
                    userId: Number(payload.userId),
                    message: payload.message,
                    to_id: Number(payload.room_id)
                }
            }
         )
        return chats
    }
}
