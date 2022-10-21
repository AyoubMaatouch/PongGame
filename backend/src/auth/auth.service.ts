import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
//import { Account } from './entity/account.entity';
import { PrismaService } from 'src/prisma/prisma.service';
const speakeasy = require('speakeasy');

@Injectable()
export class AuthService {
	constructor(private jwtService: JwtService, private prisma: PrismaService) {} //Inject

	FortyTwoLogin(req) {
		if (!req.user) {
			return 'No user from  FortyTwo';
		}

		return {
			message: 'User information from  FortyTwo',
			user: req.user,
		};
	}

	async createAccount(id: string, avatar: string) {
		try 
		{
			const found = await this.prisma.user.findUnique({
				where: {
					user_login: id,
				},
			});

			if (!found) 
			{
				const User = await this.prisma.user.create({
					data: {
						user_login: id,
						user_name: id,
						user_avatar: avatar,
					},
				});				
				console.log(`User ${id} Created `);
				return User;
			}
			else
			{
				console.log(`User ${id}  Exists `);
				return found;
			}
		} 
		catch (err: any) 
		{
			throw new HttpException("Prisma Error Creating account", 502)
		}
	}

	
async generate2fa(id:string) 
{
	const getUser  = await this.prisma.user.findUnique({
		where: {
		  user_login: id,
		},
	  })
      
	var {two_authentication } = getUser;
	
	if (two_authentication === null)
	{
		var secret = speakeasy.generateSecret({
			 name: 'ponGame',
			 length: 10
			});
            console.log("secret ");
            
		const update = await this.prisma.user.update({
			where: {
			  user_login: id,
			},
			data: {
				two_authentication: secret.base32,
			},
		  })
		  two_authentication = secret.base32;
		  console.log('update :', update);
	}
		return (two_authentication);
}


async verify2fa(userToken : string, base32secret : string)
{
    // console.log()
	var verified = speakeasy.totp.verify({ secret: base32secret,
		encoding: 'base32',
		token: userToken });
		console.log(verified);
		return verified;
	}
async deleteTwoFa(user_id : string)
{
    // console.log()
    try
    {

        var deleted = this.prisma.user.update(
            {
                where:
                {
                    user_login: user_id,
                },
                data :{
                    two_authentication: null,
                }
            }
            ) 
            return deleted
        }
        catch(err)
        {
            throw new HttpException("ERROR", 404)
        }
	}


	async findUserId(login: string) {
		return await this.prisma.user.findUnique({ where: { user_login: String(login) } });
	}

	signToken(userLogin: string, twofa : boolean, enable : boolean) {
		const payload = {
			userLogin: userLogin,
			isAuth: twofa,
            isEnabled:enable
		};

		const accessToken = this.jwtService.sign(payload, {
			secret: process.env.JWT_SECRET,
			expiresIn: '1w',
		});

		return {
			access_token: accessToken,
		};
	}

}
