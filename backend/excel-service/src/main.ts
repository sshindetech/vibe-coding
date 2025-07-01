import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ExcelServiceModule } from './excel-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ExcelServiceModule, {
    transport: Transport.TCP,
    options: { port: 4001 },
  });
  await app.listen();
}
bootstrap();
