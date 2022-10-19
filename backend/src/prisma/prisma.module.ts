import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() //Make this Module global Scoped
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}
