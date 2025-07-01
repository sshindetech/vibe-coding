import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

console.log(`Excel Service Host: ${process.env.EXCEL_SERVICE_HOST}`);
console.log(`AI Service Host: ${process.env.AI_SERVICE_HOST}`);

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EXCEL_SERVICE',
        transport: Transport.TCP,
        options: { 
          host: process.env.EXCEL_SERVICE_HOST, 
          port: process.env.EXCEL_SERVICE_PORT ? Number(process.env.EXCEL_SERVICE_PORT) : undefined 
        },
      },
      {
        name: 'AI_SERVICE',
        transport: Transport.TCP,
        options: { 
          host: process.env.AI_SERVICE_HOST, 
          port: process.env.AI_SERVICE_PORT ? Number(process.env.AI_SERVICE_PORT) : undefined 
        },
      },
    ]),
  ],
  controllers: [AppController],
})
export class AppModule {}
