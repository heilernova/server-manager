import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { AppModule } from '@api/app.module';
import { AllExceptionsFilter, responseMiddleware } from '@api/middlewares';

async function bootstrap() {
  dotenv.config({ path: '.env' })
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();
  app.use(responseMiddleware);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  try {
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(`[APP] running in port ${port}`)
  } catch (error) {
    console.log(`[Error] Al iniciar la aplicación: `, error.message);
    process.exit(1);
  }
}
bootstrap();
