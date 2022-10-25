
import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './clodinary.provider';
import { CloudinaryService } from './clodinary.service';

@Module({
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}