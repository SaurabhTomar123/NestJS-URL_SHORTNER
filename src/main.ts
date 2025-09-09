import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './exceptions/global-exception-filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: "http://localhost:5173" }); 

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT') || 3000;
  app.useGlobalPipes( new ValidationPipe({
    whitelist: true,
    stopAtFirstError: true
  }));

  app.useGlobalFilters(new GlobalExceptionFilter());
   await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}
bootstrap();
