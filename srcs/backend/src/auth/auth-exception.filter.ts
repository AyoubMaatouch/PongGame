import { ExceptionFilter, Catch, ArgumentsHost, HttpException, ForbiddenException } from '@nestjs/common';
import { Request, Response } from 'express';


@Catch(HttpException)
export class intraExceptionFilter implements ExceptionFilter
{
	catch(exception: any, host: ArgumentsHost) 
	{
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		response.redirect(process.env.CLIENT_URL + '/login');
	}
}