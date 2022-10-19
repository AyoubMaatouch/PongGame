 import { ApiProperty } from '@nestjs/swagger';
import {IsString, Max, Min, Length, isString, IsNumber} from 'class-validator'
import { Multer } from 'multer';

 export class usernameDto {

	@Length(3, 20)
 	@IsString()
	@ApiProperty()
 	username: string;
 }
 
 export class userDataDto {
	@IsString()
	@ApiProperty()
	user_avatar? : string;
	@IsString()
	@ApiProperty()
	user_name?: string;
	@IsString()
	@ApiProperty()
	facebook?: string;
	@IsString()
	@ApiProperty()
	discord?: string;
	@IsString()
	@ApiProperty()
	instagram?: string;
}

export class RoomInfoDto{
	
	@ApiProperty()
	@IsString()
	room_name : string;

	@ApiProperty()
	@IsString()
	room_type : string;

	@ApiProperty()
	@IsString()
	room_password? : string;

	@ApiProperty()
	@IsString()
	room_avatar? : string;
 }

export class AddedUsersDto {

	
	@ApiProperty()
	@IsNumber()
	room_id : number;
	
	@ApiProperty()
	@IsString()
	room_password? : string;
}
export class MemberStatus {
	
	@ApiProperty()
	@IsNumber()
	room_id : number;
	
	@ApiProperty()
	@IsString()
	room_password? : string;
	
	@IsString()
	room_status : string;
}