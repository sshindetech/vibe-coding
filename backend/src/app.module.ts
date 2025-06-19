import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LangChainService } from './langchain.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadedFile } from './uploaded-file.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database/data.sqlite',
      entities: [UploadedFile],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([UploadedFile]),
  ],
  controllers: [AppController],
  providers: [AppService, LangChainService],
})
export class AppModule {}
