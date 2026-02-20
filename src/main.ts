import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(
    `🚀 8eyond Infinite Backend is running on: http://localhost:${port}/api`,
  );
}

// Xử lý lỗi khởi động mà không cần Top-level await
bootstrap().catch((err) => {
  console.error('💥 Critical Error during system startup:', err);
  process.exit(1);
});
