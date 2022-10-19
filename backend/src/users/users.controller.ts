import {
  Controller,
  Get,
  Redirect,
  Query,
  Param,
  Req,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseFilePipe,
  HttpCode,
  HttpStatus,
  Body,
  Module,
  BadRequestException,
  HttpException,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Express } from 'express';
import { FileInterceptor, MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Observable, of } from 'rxjs';
import {
  usernameDto,
  userDataDto,
  RoomInfoDto,
  AddedUsersDto,
  MemberStatus,
} from './DTO/username.dto';
import { CloudinaryService } from './clodinary/clodinary.service';
import { get } from 'http';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsMimeType } from 'class-validator';

// ! Before End, Check if the user is extracted from JWT, and remove static User (1)

//? blocking user by changing prev to "blocked"

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(
    private readonly UsersService: UsersService,
    private cloudinary: CloudinaryService,
  ) {}

  @Get('check')
  @HttpCode(200)
  async CheckUpdatedStatus(@Req() req: Request) {
    const user_info = await this.UsersService.getUserbyLogin(
      req.user['userLogin'],
    );
    const user = user_info.user_id;
    // const user = 1;
    // here get the room for the current user

    return this.UsersService.CheckUpdatedStatus(user).catch((err) => {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    });
  }

  @Get('group/all')
  @HttpCode(200)
  async GetAllRooms(@Req() req: Request) {
    // here get the room for the current user

    return this.UsersService.getAllRooms().catch((err) => {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    });
  }
  @Get('group/member')
  @HttpCode(200)
  async GetRooms(@Req() req: Request) {
    // here get the room for the current user
    const user_info = await this.UsersService.getUserbyLogin(
      req.user['userLogin'],
    );
    const user = user_info.user_id;
    // const user = 1;
    return this.UsersService.getRooms(user).catch((err) => {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    });
  }

  @Patch('group/update/:id')
  @ApiTags('Change Member status')
  @HttpCode(200)
  async ChangeMemberStatus(
    @Body() status: MemberStatus,
    @Param('id') param: Number,
    @Req() req: Request,
  ) {
    // GET ID USER FROM JWT
    const user_info = await this.UsersService.getUserbyLogin(
        req.user['userLogin'],
      );
      const user = user_info.user_id;
    const member = await this.UsersService.getMembersbyIdRoom(
      status.room_id,
      user,
    );

        //kandn zyda 
    // if (member[0].prev != ('owner' || 'admin'))
    //   throw new HttpException('You can\'t', HttpStatus.UNAUTHORIZED);

    return this.UsersService.ChangeMemberStatus(
      param,
      status.room_status,
      status.room_id,
    ).catch((err) => {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    });
  }
  // @Patch('group/update/data/:id')
  // @HttpCode(200)
  // @UseInterceptors()
  // async ChangeGroupStatus(
  //   @Body() status: AddedUsersDto,
  //   @Param('id') param: Number,
  //   @Req() req: Request,
  // ) {
  //   // GET ID USER FROM JWT;

  //   return this.UsersService.ChangeGroupStatus( param,
  //     status
  //   ).catch((err) => {
  //     throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  //   });
  // }

  @Get('/dm/:friend_id')
  async GetDmRoomId(@Param('friend_id') friend_id: Number, @Req() req) {
    //get user from JWT
    const user_info = await this.UsersService.getUserbyLogin(
        req.user['userLogin'],
      );
    const user = user_info.user_id;
    //! THE PROBLEM IS HERE
    // SOLUTION: GET USER USER  FROM JWT
    return await this.UsersService.getDmRoom(user, friend_id).catch(() => {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    });
  }

  @ApiTags('Add User to Room {AddedUsersDto}')
  @Post('group/add/:id')
  @HttpCode(201)
  @UseInterceptors()
  async AddUsersToRoomsbyId(
    @Body() user: AddedUsersDto,
    @Param('id') param: Number,
    @Req() req: Request,
  ) {
    if (user.room_password) {
      const room = await this.UsersService.getRoombyId(user.room_id);
      const status = this.UsersService.check_password(
        user.room_password,
        room.password,
      );
      if (!status)
        throw new HttpException('Password Invalid', HttpStatus.UNAUTHORIZED);
    }
    return this.UsersService.AddToRoom(param, 'member', user.room_id).catch(
      (err) => {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      },
    );
  }

  @Post('block/:id')
  @HttpCode(201)
  async BlockUserById(@Param('id') param: Number, @Req() req: Request) {
    // get id from user
    const user_info = await this.UsersService.getUserbyLogin(
      req.user['userLogin'],
    );
    const user = user_info.user_id;
    // const user = 1;
    return this.UsersService.BlockUserById(user, param).catch((err) => {
      throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    });
  }
  @Post('group/block/:id')
  @HttpCode(201)
  async BlockUserFromGroupById(
    @Body() room,
    @Param('id') user_id: Number,
    @Req() req: Request,
  ) {
    // get id from user
    return this.UsersService.BlockUserFromGroupById(
      Number(room.room_id),
      user_id,
    ).catch((err) => {
      throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    });
  }

  @Get('group/:id')
  @HttpCode(200)
  async GetRoomsbyId(@Param('id') param: Number, @Req() req: Request) {
    // here get the room for the current user
    return this.UsersService.getRoombyId(param).catch((err) => {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    });
  }

  @Post('group/:id')
  @HttpCode(201)
  async DeleteRoomsbyId(@Param('id') param: Number, @Req() req: Request) {
    // check if the user is owner or an admin after deletion you may delete all
    // and delete all the corresponded data from
    return this.UsersService.DeleteRoombyId(param).catch((err) => {
      throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    });
  }

  @Get('members/:id')
  @HttpCode(200)
  async GetMembersbyId(@Param('id') param: Number, @Req() req: Request) {
    // here get the room for the current user
    return this.UsersService.getMembersbyId(param).catch((err) => {
      throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    });
  }

  @Post('group')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('avatar'))
  async CreateRoom(
    @Body() RoomInfoDto: RoomInfoDto,
    @UploadedFile() file,
    @Req() req: Request,
  ) {
    // here you after succesfully creating room add the creator as the the owner
    // console.log('DTO', RoomInfoDto);
    const user_info = await this.UsersService.getUserbyLogin(
      req.user['userLogin'],
    );
    const user = user_info.user_id;
    // const user = 1;
    if (file) {
      const cloud = await this.cloudinary.uploadImage(file);
      if (cloud) {
        RoomInfoDto.room_avatar = cloud['url'];
      }
    }
    const ba = await this.UsersService.CreateRooom(RoomInfoDto);
    if (ba) {
      const val = await this.UsersService.AddToRoom(user, 'owner', ba.room_id);
    }
    return ba;
  }

  @Patch('group/:room_id')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('avatar'))
  async UpdateRoom(
    @Param('room_id') room_id,
    @Body() RoomInfoDto: RoomInfoDto,
    @UploadedFile() file,
    @Req() req: Request,
  ) {
    // here you after succesfully creating room add the creator as the the owner
    const user_info = await this.UsersService.getUserbyLogin(req.user['userLogin']);
    const user = user_info.user_id;
    // const user = 1;
    if (file) {
      const cloud = await this.cloudinary.uploadImage(file);
      if (cloud) {
        RoomInfoDto.room_avatar = cloud['url'];
      }
    }
    const room_updated = await this.UsersService.UpdateRooom(
      room_id,
      RoomInfoDto,
    ).catch((erro) => {
      throw new HttpException('CANT UPDATE DATA', HttpStatus.UNAUTHORIZED);
    });

    return room_updated;
  }
  @Post('add/:id')
  @HttpCode(201)
  async AddFriend(@Param('id') friend_id: Number, @Req() req) {
    const user_info = await this.UsersService.getUserbyLogin(
        req.user['userLogin'],
      );
    const user = user_info.user_id;
    // const user = 1;
    return await this.UsersService.friendReq(user, friend_id);
  }

  @Get('list/all')
  @HttpCode(200)
  async GetAllUsers(@Req() req) {
    // add JWT ID user
    const user_info = await this.UsersService.getUserbyLogin(
        req.user['userLogin'],
      );
    const user = user_info.user_id;
    return await this.UsersService.getAllUsers(user);
  }

  @Get('friends')
  @HttpCode(200)
  async getAllFriends(@Req() req) {
    /// add here JWT user
    const user_info = await this.UsersService.getUserbyLogin(
        req.user['userLogin'],
      );
    const user = user_info.user_id;
    return await this.UsersService.getAllFriends(user).catch((err) => {
      throw new BadRequestException(err);
    });
  }

  @Get('me')
  @HttpCode(200)
  async getMe(@Req() req: Request) {
    return await this.UsersService.getUserbyLogin(req.user['userLogin']);
  }

  @Get('match_history')
  @HttpCode(200)
  async getMachHistory(@Req() req) {
    // console.log("HHHHHHHHHHH")
    const user_info = await this.UsersService.getUserbyLogin(
      req.user['userLogin'],
    );
    const user = user_info.user_id;
    return await this.UsersService.GetMatchHistory(user);
    // console.log(value)
  }
  @Get(':id')
  async getUser(@Param('id') login: number) {
    return await this.UsersService.getUser(login).catch((err) => {
      throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    });
  }

  @Post(':login/avatar')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadImageToCloudinary(@UploadedFile() file) {
    return await this.cloudinary.uploadImage(file).catch((err) => {
      throw new BadRequestException(err);
    });
  }

  @Post('username/:login')
  @HttpCode(201)
  async setUsername(
    @Param('login') login: string,
    @Req() req,
    @Body() usernameDto: usernameDto,
  ) {
    return await this.UsersService.setUsername(login, req.body.username);
  }

  //! Add Validators to Upload
  @Post('update/profile')
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: {
        files: 1,
        fileSize: 10000000,
      },
    }),
  ) //https://docs.nestjs.com/techniques/file-upload
  async setData(
    @Param('login') login: any,
    @Req() req,
    @UploadedFile() file,
    @Body() userDataDto: userDataDto,
  ) {
    const userRecord = await this.UsersService.getUserbyLogin(
      req.user['userLogin'],
    );

    if (file) {
      const cloud = await this.cloudinary.uploadImage(file);
      if (cloud) {
        userDataDto.user_avatar = cloud['url'];
        console.log();
        userDataDto.user_avatar;
      }
    }

    return await this.UsersService.updateUserData(
      Number(userRecord.user_id),
      userDataDto,
    );
  }

  //! SHOUD BE MOVED TO CHAT CONTROLER

  @Get('/msg/:room_id')
  @HttpCode(200)
  async getAllChats(@Param('room_id') room_id: number) {
    return await this.UsersService.getAllChats(room_id).catch((error) => {
      throw new HttpException('NO MSG FOUND', HttpStatus.NOT_FOUND);
    });
    // console.log("HHHHHHHHHHH")
    // return await this.UsersService.GetMatchHistory("aymaatou");
    // console.log(value)
  }
}
