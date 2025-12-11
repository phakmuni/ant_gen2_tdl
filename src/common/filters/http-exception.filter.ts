import { ArgumentsHost, ExceptionFilter, HttpException, Inject } from "@nestjs/common";

import { Request, Response } from 'express';
import { ApiResponse } from "../interfaces/api-response.interface";


export class HttpExceptionFilter implements ExceptionFilter {

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const statusCode = exception instanceof HttpException ? exception.getStatus() : 500;
        const message = exception instanceof HttpException ? exception.message : 'Internal server error';

        console.log(exception);

        const errorResponse: ApiResponse = {
            result: false,
            message,
            data: [],
        };
        response.status(statusCode).json(errorResponse);
    }
    
}