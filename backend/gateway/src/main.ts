import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all origins (customize as needed)
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Financial Data Q&A API')
    .setDescription('API for uploading Excel files and querying financial data')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.GATEWAY_PORT ?? 3000);
}
bootstrap();
