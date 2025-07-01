import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AiServiceModule } from './ai-service.module';

async function bootstrap() {
  const port = process.env.AI_SERVICE_PORT ? Number(process.env.AI_SERVICE_PORT) : 4002;
  console.log(`AI Service running on port: ${port}`);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AiServiceModule, {
    transport: Transport.TCP,
    options: { port },
  });
  await app.listen();
}
bootstrap();
