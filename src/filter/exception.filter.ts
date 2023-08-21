import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { LoggingService } from 'src/logger/logging.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      errorResponse = exception.getResponse();
    } else if (exception instanceof UnauthorizedException) {
      status = HttpStatus.FORBIDDEN;
      errorResponse = {
        statusCode: status,
        message: 'Authentication failed.',
      };
    } else if (exception instanceof ForbiddenException) {
      status = HttpStatus.FORBIDDEN;
      errorResponse = {
        statusCode: status,
        message: 'Access forbidden.',
      };
    } else if (exception instanceof BadRequestException) {
      status = HttpStatus.BAD_REQUEST;
      errorResponse = {
        statusCode: status,
        message: exception.getResponse(),
      };
    } else {
      errorResponse = {
        statusCode: status,
        message: 'Internal server error.',
      };
    }

    const trace = exception instanceof Error ? exception.stack : undefined;

    this.loggingService.error({
      message: errorResponse.message || 'Internal server error',
      trace,
      statusCode: status,
      url: request.url,
      method: request.method,
      headers: request.headers,
      query: request.query,
      body: request.body,
      errorResponse,
    });

    response.status(status).json(errorResponse);
  }
}
