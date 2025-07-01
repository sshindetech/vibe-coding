import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AiServiceModule } from './ai-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AiServiceModule, {
    transport: Transport.TCP,
    options: { port: 4002 },
  });
  await app.listen();
}
bootstrap();
