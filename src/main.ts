// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import { join } from 'path';

import { AllExceptionFilter } from './filters/exception.filter';
import { load } from 'js-yaml';

const port = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionFilter());

  const config = load(
    readFileSync(join(__dirname, '../doc/api.yaml'), 'utf8'),
  ) as OpenAPIObject;

  SwaggerModule.setup('doc', app, config);

  app.enableCors();
  await app.listen(port);

  console.log(`Application is listening on port ${port}`);
}

bootstrap();
