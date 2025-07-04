import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.GATEWAY_PORT ? Number(process.env.GATEWAY_PORT) : 3000;
  console.log(`Gateway running on port: ${port}`);
  console.log(`Gateway: Excel Service Host: ${process.env.EXCEL_SERVICE_HOST}`);
  console.log(`Gateway: AI Service Host: ${process.env.AI_SERVICE_HOST}`);

  // Enable CORS for all origins (customize as needed)
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Financial Data Q&A API')
    .setDescription('API for uploading Excel files and querying financial data')
    .setVersion('1.0')
    .addBearerAuth() // Add Bearer token authentication
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
}
bootstrap();
