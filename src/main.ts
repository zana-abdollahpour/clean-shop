import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { ApplicationExceptionFilter } from 'src/shared/infrastructure/exception-filters/application-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.useGlobalFilters(new ApplicationExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
