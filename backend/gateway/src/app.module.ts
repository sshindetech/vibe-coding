import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthController } from './auth.controller';
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
      {
        name: 'CLIENT_AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.CLIENT_AUTH_SERVICE_HOST,
          port: process.env.CLIENT_AUTH_SERVICE_PORT ? Number(process.env.CLIENT_AUTH_SERVICE_PORT) : 4003,
        },
      },
    ]),
  ],
  controllers: [AppController, AuthController],
})
export class AppModule {}
