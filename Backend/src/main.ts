import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  //const app = await NestFactory.create(AppModule);
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configuración de CORS
  const corsOptions: CorsOptions = {
    origin: '*', // Aquí puedes configurar los dominios permitidos
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };

  app.enableCors(corsOptions);
  
  app.setGlobalPrefix("api/v1");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //Aceptara solo datos con los tipos de datos especificados en cada modulo
      forbidNonWhitelisted: true,
      transform: true, //Si el dato puede tener transformacion directa, lo hara
    })
  );

  await app.listen(3001);
}
bootstrap();
