import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthServiceModule } from './auth-service.module';

async function bootstrap() {
  const port = process.env.AUTH_SERVICE_PORT ? Number(process.env.AUTH_SERVICE_PORT) : 4003;
  const host = process.env.AUTH_SERVICE_HOST || '0.0.0.0';
  console.log(`Auth Service running on port: ${port}`);
  console.log(`Auth Service host: ${host}`);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthServiceModule, {
    transport: Transport.TCP,
    options: {
      host,
      port
    },
  });
  await app.listen();
}
bootstrap();
