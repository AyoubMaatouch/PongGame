import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      datasources: {
        db: {
          url: 'postgresql://pong:pong@localhost:5432/pongdb?schema=public',
        },
      },
    });
  }

  async onModuleInit() {
    //When Module Starts use this Function
    await this.$connect();
  }

  async onModuleDestroy() {
    //When Module Finishes use this Function
    await this.$disconnect();
  }
}
