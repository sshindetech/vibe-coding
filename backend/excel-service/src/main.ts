import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ExcelServiceModule } from './excel-service.module';

async function bootstrap() {
  const port = process.env.EXCEL_SERVICE_PORT ? Number(process.env.EXCEL_SERVICE_PORT) : 4001;
  const host = process.env.EXCEL_SERVICE_HOST || '0.0.0.0';
  console.log(`Excel Service running on port: ${port}`);
  console.log(`Excel Service host: ${host}`);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ExcelServiceModule, {
    transport: Transport.TCP,
    options: { 
      host,
      port 
    },
  });
  await app.listen();
}
bootstrap();
