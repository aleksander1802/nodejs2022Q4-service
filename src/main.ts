import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import { LoggingService } from './logger/logging.service';
import { AllExceptionsFilter } from './filter/exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const loggingService = app.get(LoggingService);
  const filter = new AllExceptionsFilter(loggingService);

  app.useGlobalFilters(filter);

  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home music library service')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('doc', app, document);

  process.on('uncaughtException', (error) => {
    loggingService.error({
      message: 'Uncaught Exception',
      trace: error.stack,
      statusCode: 500,
    });
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    loggingService.error({
      message: 'Unhandled Rejection',
      trace: reason instanceof Error ? reason.stack : String(reason),
      statusCode: 500,
    });
    process.exit(1);
  });

  await app.listen(PORT);
}

bootstrap();
