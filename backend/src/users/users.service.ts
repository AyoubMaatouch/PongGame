import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { Http2ServerRequest } from 'http2';
import { throwError } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { userDataDto, RoomInfoDto} from './DTO/username.dto'
const bcrypt = require('bcrypt');

@Injectable()
export class UsersService {

		constructor(private readonly prisma : PrismaService) {}

    async GetMatchHistory(user) {
        // find a way to get 
        const match_result = await this.prisma.match_history.findMany({
			where : {
				OR:[
					{
						userId: Number(user)
					},
					{
						opponent_id: Number(user)
					}
				]
			}
		})
        return match_result
    }
	// inserting to a table with Foreing keys
	async CheckUpdatedStatus(user_id)
	{	
		// const user  = await this.prisma.user.findUnique({
		// 	where:
		// 	{
		// 		user_id: Number(user_id),
		// 	}
		// })
	
			console.log("are you here")
		 	const updated = await this.prisma.user.updateMany(
				{
					where:
					{
						user_id:  Number(user_id),
						updated : false,

					},
					data:
					{
						updated: true,
					}
				}
			)
			console.log(  updated )
		
		return updated
	}
	async  friendReq(user :Number, friend_id:Number) {
		try
		{

			const update = await this.prisma.friend.create({ data: 
				{ friendId: Number(friend_id) , user: { connect: { user_id: Number(user) } 
			} } })
			const roomName = user.toString() + '_' + friend_id.toString()
			const room_init = await this.prisma.room_info.create(
				{
					data: {
						room_name: roomName ,
						room_type: "DM",
					}
				}
				)
				const membership = await await this.prisma.members.create({
					data :
					{
						roomId: Number(room_init.room_id),
						userId: Number(user),
						prev: "DM" 
					},
				})
				const joine = await await this.prisma.members.create({
					data :
					{
						roomId: Number(room_init.room_id),
						userId: Number(friend_id),
						prev: "DM" 
					},
				})
			return update
		}
		catch(err)
			{
				throw new HttpException("Error", HttpStatus.UNPROCESSABLE_ENTITY)
			}
	}

	async BlockUserFromGroupById(group_id, user_id)
	{
		const blocked = await this.prisma.members.deleteMany (
			{
				where :
				{
					roomId: Number(group_id),
					userId: Number(user_id)
				}
			}
		)
		if (blocked.count == 0)
			{
				throw new HttpException("NOT FOUND", HttpStatus.NOT_FOUND)
			}
		return blocked
	}
	async getDmRoom (me , friend_id)
	{
		const private_room = await this.prisma.room_info.findFirst({
			where : {
				OR:[
					{
						room_name: {
							contains: me.toString() + '_' + friend_id.toString()
						},
					},
					{
						room_name: {
							contains: friend_id.toString() + '_' + me.toString()
						}
						
					}
				]
			}
		})
		return private_room
	}

	//! SHOULD BE MOVED TO CHAT SERVICES
	async getAllChats (room_id:number)
	{
		// try {
			const all_msg = await this.prisma.chats.findMany({
				where:
				{
					to_id : Number(room_id)
				}
			})
			
			return all_msg
		// } catch (error) {
		// 	throw new HttpException("CAN'T LOAD MSG", HttpStatus.NOT_FOUND)
		// }

	}


	async BlockUserById(me: number, DeletedUser )
	{
		const private_room = await this.prisma.room_info.findFirst({
			where : {
				OR:[
					{
						room_name: {
							contains: me.toString() + '_' + DeletedUser.toString()
						},
					},
					{
						room_name: {
							contains: DeletedUser.toString() + '_' + me.toString()
						}
						
					}
				]
			}
		})
		const delete_membership = await this.prisma.members.deleteMany(
			{
				where:
				{
					roomId:private_room.room_id
				}
			}
		)
		const delete_room = await this.prisma.room_info.delete(
			{
				where:
				{
					room_id:private_room.room_id
				}
			}
		)
		const deleted = await this.prisma.friend.deleteMany(
			{
				where :
				{
					userId : Number(me),
					friendId: Number(DeletedUser)
					
				}
			}
		)
		if (deleted.count == 0)
			throw "NOT FOUND"

		return deleted;
	}

	async AddToRoom(user, rool, roomId)
	{
		const update = await this.prisma.members.create({
			 data: 
			{ prev: (rool) , 
				room: { connect: { room_id: Number(roomId) } },
				user: { connect: { user_id: Number(user) } }
		 }
		 })
		 return update;
		}
	async ChangeMemberStatus(user, rool, roomId)
	{
		const update = await this.prisma.members.updateMany({
			where :
			{
				roomId: Number(roomId),
				userId: Number(user)
			} ,
			data: 
			{ prev: (rool) 
		 }
		 })
		 return update;
		}

	async UpdateRooom(room_id, RoomInfoDto: RoomInfoDto)
	{
		const saltRounds = 10;
		var hashed_password  = null
		// console.log("room password ",RoomInfoDto.room_password);
		
		if (RoomInfoDto.room_password)
		{
			hashed_password = bcrypt.hashSync(RoomInfoDto.room_password, saltRounds);
		}
		const room_init = await this.prisma.room_info.update(
			{
				where :
				{
					room_id : Number(room_id)
				},
				data: {
					room_name: RoomInfoDto.room_name,
					room_type: RoomInfoDto.room_type,
					password: hashed_password,
					room_avatar: RoomInfoDto.room_avatar,
				}
			}
			)	
			return room_init;
		}

	async CreateRooom(RoomInfoDto: RoomInfoDto)
	{
		const saltRounds = 10;
		var hashed_password  = null
		// console.log("room password ",RoomInfoDto.room_password);
		
		if (RoomInfoDto.room_password)
		{
			hashed_password = bcrypt.hashSync(RoomInfoDto.room_password, saltRounds);
		}
		// console.log("Hashed paassiwordi =>",hashed_password);
		
		// console.log(status)
		const room_init = await this.prisma.room_info.create(
			{
				data: {
					room_name: RoomInfoDto.room_name,
					room_type: RoomInfoDto.room_type,
					password: hashed_password,
					room_avatar: RoomInfoDto.room_avatar,
				}
			}
			)	
			return room_init;
		}
	check_password(room_password, hash) : boolean
		{
			return  bcrypt.compareSync(room_password, hash);	
		}
	async getRooms (id: Number)
	{
		const rooms = await this.prisma.members.findMany(
		{
			where :
			{
				userId : Number(id),
			},
		})
		console.log('rooms = >', rooms);
		
		return rooms
	}

	async getRoombyId (id: Number)
	{
			console.log("Id: ", id);
			const room = await this.prisma.room_info.findUnique(
				{
					where :
					{
					
						room_id : Number(id),
					},
				})
				if (!room)
					throw "NOT FOUND"
				return room		
	}
	async getAllRooms()
	{
		const all_rooms = await this.prisma.room_info.findMany (
			{
				where:
				{
					OR:
					[
						{
							room_type: {
								contains : "public",
							},
						},
						{
							room_type :
							{
								contains : "protected",
							},
						},
					]
				}
			}
		)

		return all_rooms
	}
	async DeleteRoombyId (id: Number)
	{
		// before deletion check if the user has the right to delete
		// then after that delete the chat after that do the actions below
		const removed  = await this.prisma.members.deleteMany(
			{
				where :
				{
					roomId : Number(id)
				}
			}
		)
		const deleted = await this.prisma.room_info.delete(
		{
			where :
			{
				room_id : Number(id),
			}
		}
		)
		
		return deleted;
	
	}
	async getMembersbyId (id: Number)
	{
		// console.log(user)
		const members = await this.prisma.members.findMany(
			{
				where :
				{
					roomId : Number(id),
				},
			})
			
		// console.log(members)
		return members
	}
	async getMembersbyIdRoom (id: Number, user:Number)
	{
		const members = await this.prisma.members.findMany(
		{
			where :
			{
				userId: Number(user),
				roomId : Number(id),
			},
		})

		return members
	}

	async  getAllUsers(me) {
		const users = await this.prisma.user.findMany(
			{
				where:
				{
					NOT :
					{
						user_id: Number(me)
					}
				}
			}
		);
		return users;

	}
	async getAllFriends(login: number)
	{
		const frineds = await this.prisma.friend.findMany ( {
			where :
			{
				userId : login,
					// friendId : login
			},
		})
		const other_frineds = await this.prisma.friend.findMany ( {
			where :
			{
				friendId : login,
					// friendId : login
			},
		})
		const user_id = frineds.map((friend) => friend.friendId);
		const other_user_id = other_frineds.map((friend) => friend.userId);
		
		const frineds_id = [...user_id, ...other_user_id];

		return frineds_id
	}

	async getUser(login : number)
	{	 
		const found = await this.prisma.user.findUnique({
			where: {
				user_id: Number(login),
			},
		});
		if (!found) {
			throw "NOT FOUND"
		}
		return found;
	}
	async getUserbyLogin(login : string)
	{
			
			const found = await this.prisma.user.findUnique({
				where: {
					user_login:login,
				},
			}); 
			if (!found) {
				throw "NOT FOUND";
			}
			return found;
	}

	async setUsername(login : string, username : string)
	{
		return await this.prisma.user.update({
			where: {
				user_login: login,
			},
			data: {
				user_name: username,
			},
		});
	}
	async updateUserData(login : Number, userDataDto : userDataDto)
	{
		return await this.prisma.user.update({
			where: {
				user_id: Number(login),
			},
			data: {
				user_avatar: userDataDto.user_avatar,
				user_name: userDataDto.user_name,
				facebook: userDataDto.facebook,
				discord: userDataDto.discord,
				instagram: userDataDto.instagram,
			},
		});
	}



	async setUserState(login : any, state : boolean)
	{
		console.log(`${login} userState: ${state}`);
		try 
		{
			const userOnline =  await this.prisma.user.update({
			where: {
				user_id: Number(login)
			},
			data: {
				online: state
			}
			})
		}
		catch (err : any) 
		{
			console.log('error in setUserState ', err);
		}
	}
}
