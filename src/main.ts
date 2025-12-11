import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/api-response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { BadRequestFilter } from './common/filters/bad-request-exception.filter';
import { NotFoundFilter } from './common/filters/notfound-exception.filter';
import { ConflictFilter } from './common/filters/conflict-exception.filter';
import { join } from 'path';
import { UnauthorizedExceptionFilter } from './common/filters/unauthorized-exception.filter';
import { ForbiddenExceptionFilter } from './common/filters/forbidden-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>("PORT") || 3000;
  const PREFIX = configService.get<string>("PREFIX") || '/api';
  const VERSION  = configService.get<string>("VERSION") || "/v1"
  app.setGlobalPrefix(PREFIX+VERSION);
  app.useGlobalPipes(new ValidationPipe({whitelist : true, forbidNonWhitelisted: true, transform: true,}));
  app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: false,
  });
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new BadRequestFilter(),
    new NotFoundFilter(),
    new ConflictFilter(),
    new UnauthorizedExceptionFilter(),
    new ForbiddenExceptionFilter(),
  );
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/api/v1/uploads/',
  });
  await app.listen(PORT, '0.0.0.0'); // bind to all network interfaces
  console.log(`Application running on port ${PORT}`);
}
bootstrap();
