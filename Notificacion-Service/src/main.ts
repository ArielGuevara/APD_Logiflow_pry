import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:8081'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Servicio de Notificaciones')
    .setDescription('Microservicio para gestionar notificaciones del sistema Parkin')
    .setVersion('1.0')
    .addTag('notificaciones')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Iniciar servidor
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`Servicio de notificaciones ejecutándose en: http://localhost:${port}`);
  console.log(`Documentación Swagger: http://localhost:${port}/api-docs`);
}

bootstrap();