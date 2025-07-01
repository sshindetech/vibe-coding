import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ExcelServiceModule } from './excel-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ExcelServiceModule, {
    transport: Transport.TCP,
    options: { port: process.env.EXCEL_SERVICE_PORT ? Number(process.env.EXCEL_SERVICE_PORT) : 4001 },
  });
  await app.listen();
}
bootstrap();
