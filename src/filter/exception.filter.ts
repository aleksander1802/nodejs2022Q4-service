import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
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
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { statusCode: status, message: 'Internal server error.' };

    const trace = exception instanceof Error ? exception.stack : undefined;

    this.loggingService.error({
      message: 'Internal server error',
      trace,
      statusCode: status,
      url: request.url,
      method: request.method,
      headers: request.headers,
      query: request.query,
      body: request.body,
      errorResponse,
    });

    response.status(status).json({
      errorResponse,
    });
  }
}
