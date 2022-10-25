
import { Module } from '@nestjs/common';
import { UsersProviders } from './users.providers';
import { UsersService } from './users.service';

@Module({
  providers: [UsersProviders, UsersService],
  exports: [UsersProviders, UsersService],
})
export class UsersModule {}