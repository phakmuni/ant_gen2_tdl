import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, Inject } from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';

@Catch(BadRequestException)
export class BadRequestFilter implements ExceptionFilter {

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const message = 'Invalid Input';

    const errorResponse: ApiResponse = {
        result: false,
        message:message,
        data: [],
    };
    const detailMessage = exceptionResponse['message'] || exception.message;

      
    response.status(status).json({
      ...errorResponse,
      details: detailMessage,
    });
  }
}
