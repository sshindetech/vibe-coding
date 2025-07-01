import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ExcelServiceModule } from './excel-service.module';

async function bootstrap() {
  const port = process.env.EXCEL_SERVICE_PORT ? Number(process.env.EXCEL_SERVICE_PORT) : 4001;
  console.log(`Excel Service running on port: ${port}`);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ExcelServiceModule, {
    transport: Transport.TCP,
    options: { port },
  });
  await app.listen();
}
bootstrap();
