import { ApiProperty } from '@nestjs/swagger';

export class TwoFactDto {
    @ApiProperty()
    base32secret: string;

    @ApiProperty()
    userToken: string;
}