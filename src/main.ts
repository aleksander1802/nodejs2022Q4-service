import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import { LoggingService } from './logger/logging.service';
import { AllExceptionsFilter } from './filter/exception.filter';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggingService(),
  });

  app.useGlobalPipes(new ValidationPipe());

  const loggingService = app.get(LoggingService);
  app.useGlobalFilters(new AllExceptionsFilter(loggingService));

  await app.listen(PORT);
}

bootstrap();
