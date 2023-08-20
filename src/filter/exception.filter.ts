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

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.loggingService.error({
        message: 'Internal server error',
        trace: (exception as Error).stack,
        statusCode: status,
        url: request.url,
        method: request.method,
        headers: request.headers,
        query: request.query,
        body: request.body,
      });
    }

    response.status(status).json({
      statusCode: status,
      message:
        'Something went wrong. Of course, this is a custom error. For educational purposes',
    });
  }
}
