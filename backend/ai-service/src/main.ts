import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AiServiceModule } from './ai-service.module';

async function bootstrap() {
  const port = process.env.AI_SERVICE_PORT ? Number(process.env.AI_SERVICE_PORT) : 4002;
  const host = process.env.AI_SERVICE_HOST || '0.0.0.0';
  console.log(`AI Service running on port: ${port}`);
  console.log(`AI Service host: ${host}`);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AiServiceModule, {
    transport: Transport.TCP,
    options: { 
      host,
      port
    },
  });
  await app.listen();
}
bootstrap();
