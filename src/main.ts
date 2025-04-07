import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { useSwagger } from './app/app.swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '@app/base/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  useSwagger(app);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server is running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
}
await bootstrap();
