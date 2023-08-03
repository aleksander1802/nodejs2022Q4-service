import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { join } from 'path';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000;

  const apiDocument = load(
    readFileSync(join(__dirname, '../doc/api.yaml'), 'utf8'),
  ) as Omit<OpenAPIObject, 'paths'>;

  const document = SwaggerModule.createDocument(app, apiDocument);
  SwaggerModule.setup('doc', app, document);

  await app.listen(port);
}

bootstrap();
