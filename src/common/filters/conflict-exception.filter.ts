
import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, Inject, ConflictException } from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';


@Catch(ConflictException)
export class ConflictFilter implements ExceptionFilter {

  catch(exception: ConflictException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;

    const errorResponse: ApiResponse = {
        result: false,
        message:message,
        data: [],
    };

      
    response.status(status).json(errorResponse);
  }
}
