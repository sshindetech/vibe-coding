import { Module } from '@nestjs/common';
import { ExcelServiceController } from './excel-service.controller';
import { ExcelServiceService } from './excel-service.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadedFile } from './uploaded-file.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: '../../database/data.sqlite',
      entities: [UploadedFile],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([UploadedFile]),
    ClientsModule.register([
      {
        name: 'CLIENT_AI_SERVICE',
        transport: Transport.TCP,
        options: { 
          host: process.env.CLIENT_AI_SERVICE_HOST || 'localhost', 
          port: process.env.CLIENT_AI_SERVICE_PORT ? Number(process.env.CLIENT_AI_SERVICE_PORT) : undefined 
        },
      },
    ]),    
  ],
  controllers: [ExcelServiceController],
  providers: [ExcelServiceService],
})
export class ExcelServiceModule {}
