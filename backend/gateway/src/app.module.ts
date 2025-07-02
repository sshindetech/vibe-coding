import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CLIENT_EXCEL_SERVICE',
        transport: Transport.TCP,
        options: { 
          host: process.env.CLIENT_EXCEL_SERVICE_HOST, 
          port: process.env.CLIENT_EXCEL_SERVICE_PORT ? Number(process.env.CLIENT_EXCEL_SERVICE_PORT) : undefined 
        },
      },
      {
        name: 'CLIENT_AI_SERVICE',
        transport: Transport.TCP,
        options: { 
          host: process.env.CLIENT_AI_SERVICE_HOST, 
          port: process.env.CLIENT_AI_SERVICE_PORT ? Number(process.env.CLIENT_AI_SERVICE_PORT) : undefined 
        },
      },
    ]),
  ],
  controllers: [AppController],
})
export class AppModule {}
