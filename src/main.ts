import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as CookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api/v1/")
  app.useGlobalPipes(new ValidationPipe())
  app.use(CookieParser())
  await app.listen(8000);
}
bootstrap();
