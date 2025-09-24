import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.use(express.static(join(__dirname, '../../frontend/dist')));
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(join(__dirname, '../../frontend/dist/index.html'));
    } else {
      next();
    }
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
