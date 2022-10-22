import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TwoFactDto {
    // @ApiProperty()
    // base32secret: string;
    @ApiProperty()
    @IsString()
    code: string;
}